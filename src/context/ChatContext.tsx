import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatContextType {
  messages: Message[];
  activeChatUserId: string | null;
  setActiveChatUserId: (userId: string | null) => void;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  markAsRead: (fromUserId: string) => Promise<void>;
  conversations: { userId: string; lastMessage: Message; unreadCount: number }[];
  totalUnread: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  // Use a ref so fetchMessages always closes over the latest currentUser
  // without re-creating the subscription on every render
  const currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  const fetchMessages = useCallback(async () => {
    const user = currentUserRef.current;
    if (!user) return;

    if (!isSupabaseConfigured) {
      const storedMessages = localStorage.getItem('kazify_mock_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages).filter((m: any) => m.senderId === user.id || m.receiverId === user.id));
      } else {
        setMessages([]);
        localStorage.setItem('kazify_mock_messages', JSON.stringify([]));
      }
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        content: m.content,
        createdAt: m.created_at,
        // Gracefully handle databases that don't have the is_read column yet
        isRead: m.is_read ?? false
      })));
    }
  }, []); // stable — uses ref internally

  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      return;
    }

    fetchMessages();

    const handleCustomUpdate = () => {
      fetchMessages();
    };
    window.addEventListener('kazify_data_update', handleCustomUpdate);

    if (!isSupabaseConfigured) {
      return () => {
        window.removeEventListener('kazify_data_update', handleCustomUpdate);
      };
    }

    // One channel per user session — handles both INSERT and UPDATE
    const channel = supabase
      .channel(`messages-rt-${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => fetchMessages()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      window.removeEventListener('kazify_data_update', handleCustomUpdate);
      supabase.removeChannel(channel);
    };
  }, [currentUser, fetchMessages]);

  // ── Send a message ───────────────────────────────────────────────────────
  // Returns true on success so the UI can clear the input confidently.
  // NOTE: Do NOT pass is_read here — let the DB default (false) handle it.
  //       Passing is_read: false breaks silently if the column doesn't exist yet.
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<boolean> => {
    const user = currentUserRef.current;
    if (!user) return false;

    if (!isSupabaseConfigured) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        receiverId,
        content,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      const storedMessages = localStorage.getItem('kazify_mock_messages');
      const messagesList = storedMessages ? JSON.parse(storedMessages) : [];
      messagesList.push(newMessage);
      localStorage.setItem('kazify_mock_messages', JSON.stringify(messagesList));
      
      window.dispatchEvent(new Event('kazify_data_update'));
      return true;
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content
      // is_read intentionally omitted — DB default handles it
    });

    if (error) {
      console.error('[Chat] Failed to send message:', error.message);
      return false;
    }

    // Real-time INSERT listener will call fetchMessages automatically.
    // We also call it directly as a fallback in case real-time is slow.
    await fetchMessages();
    return true;
  }, [fetchMessages]);

  // ── Mark messages as read ────────────────────────────────────────────────
  // Only attempts the UPDATE — real-time UPDATE listener handles the re-fetch.
  // No manual fetchMessages() call here to avoid race conditions.
  const markAsRead = useCallback(async (fromUserId: string) => {
    const user = currentUserRef.current;
    if (!user) return;

    if (!isSupabaseConfigured) {
      const storedMessages = localStorage.getItem('kazify_mock_messages');
      if (storedMessages) {
        const messagesList = JSON.parse(storedMessages);
        const updated = messagesList.map((m: any) => {
          if (m.senderId === fromUserId && m.receiverId === user.id && !m.isRead) {
            return { ...m, isRead: true };
          }
          return m;
        });
        localStorage.setItem('kazify_mock_messages', JSON.stringify(updated));
        window.dispatchEvent(new Event('kazify_data_update'));
      }
      return;
    }

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', fromUserId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      // The real-time UPDATE subscription above will trigger fetchMessages()
    } catch (err) {
      // Silently ignore — is_read column may not exist in older DB schemas
      console.warn('[Chat] markAsRead failed (column may not exist):', err);
    }
  }, []);

  // ── Aggregate conversations ──────────────────────────────────────────────
  const conversations = useMemo(() => {
    if (!currentUser) return [];

    const convMap: { [userId: string]: Message } = {};

    messages.forEach(msg => {
      const otherUser = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      // Keep the most recent message per conversation
      if (!convMap[otherUser] || new Date(msg.createdAt) > new Date(convMap[otherUser].createdAt)) {
        convMap[otherUser] = msg;
      }
    });

    return Object.keys(convMap).map(userId => {
      const unreadCount = messages.filter(
        m => m.senderId === userId && m.receiverId === currentUser.id && !m.isRead
      ).length;

      return { userId, lastMessage: convMap[userId], unreadCount };
    }).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }, [messages, currentUser]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  return (
    <ChatContext.Provider value={{
      messages,
      activeChatUserId,
      setActiveChatUserId,
      sendMessage,
      markAsRead,
      conversations,
      totalUnread
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
