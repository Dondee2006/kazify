import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import {
  Send, MessageSquare, ArrowLeft, Search, CheckCheck,
  Briefcase, User as UserIcon, Circle
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatBubbleTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Inbox: React.FC = () => {
  const { messages, activeChatUserId, setActiveChatUserId, sendMessage, markAsRead, conversations, totalUnread } = useChat();
  const { currentUser, allUsers } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-select conversation from URL ?to=userId
  useEffect(() => {
    const toUserId = searchParams.get('to');
    if (toUserId) {
      setActiveChatUserId(toUserId);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, setActiveChatUserId]);

  // Mark messages as read and focus input whenever we open a conversation
  useEffect(() => {
    if (activeChatUserId) {
      markAsRead(activeChatUserId);
    }
    if (activeChatUserId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [activeChatUserId, markAsRead]);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatUserId]);

  const activeUser = useMemo(() => {
    if (!activeChatUserId) return null;
    return allUsers.find(u => u.id === activeChatUserId) || null;
  }, [activeChatUserId, allUsers]);

  // Messages for the active thread
  const chatMessages = useMemo(() => {
    if (!currentUser || !activeChatUserId) return [];
    return messages.filter(
      msg =>
        (msg.senderId === currentUser.id && msg.receiverId === activeChatUserId) ||
        (msg.senderId === activeChatUserId && msg.receiverId === currentUser.id)
    );
  }, [messages, currentUser, activeChatUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text || !activeChatUserId) return;
    // Only clear input if the send actually succeeded
    const ok = await sendMessage(activeChatUserId, text);
    if (ok) {
      setInputMessage('');
    } else {
      // Keep the message in the input so the user can retry
      alert('Message failed to send. Please check your connection and try again.');
    }
  };

  // Build the conversation list (inject new chat entry if needed)
  const displayConversations = useMemo(() => {
    const list = [...conversations];
    if (activeChatUserId && !conversations.some(c => c.userId === activeChatUserId)) {
      list.unshift({
        userId: activeChatUserId,
        unreadCount: 0,
        lastMessage: {
          id: 'temp',
          senderId: '',
          receiverId: '',
          content: 'New conversation',
          createdAt: new Date().toISOString(),
          isRead: true
        }
      });
    }
    return list;
  }, [conversations, activeChatUserId]);

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return displayConversations;
    const q = searchQuery.toLowerCase();
    return displayConversations.filter(conv => {
      const user = allUsers.find(u => u.id === conv.userId);
      return (
        user?.name?.toLowerCase().includes(q) ||
        conv.lastMessage.content.toLowerCase().includes(q)
      );
    });
  }, [displayConversations, searchQuery, allUsers]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">

        {/* Page Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              Messages
              {totalUnread > 0 && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 bg-rose-500 text-white text-xs font-black rounded-full px-1.5 ml-1 shadow shadow-rose-500/30">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentUser?.role === 'client'
                ? 'Chat with freelancers about proposals, orders, and project details.'
                : 'Chat with clients about jobs, bids, and deliverables.'}
            </p>
          </div>
        </div>

        {/* Main Chat Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col md:flex-row" style={{ minHeight: '520px' }}>

          {/* ── LEFT PANEL: Conversation List ── */}
          <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-white ${activeChatUserId ? 'hidden md:flex' : 'flex'}`}>

            {/* Search Bar */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conv => {
                  const userProfile = allUsers.find(u => u.id === conv.userId);
                  const isSelected = activeChatUserId === conv.userId;
                  const isSentByMe = conv.lastMessage.senderId === currentUser?.id;
                  const hasUnread = conv.unreadCount > 0;

                  return (
                    <button
                      key={conv.userId}
                      onClick={() => setActiveChatUserId(conv.userId)}
                      className={`w-full p-3.5 flex items-start gap-3 text-left transition-all duration-150 ${
                        isSelected
                          ? 'bg-emerald-50 border-l-[3px] border-emerald-500 pl-3'
                          : hasUnread
                          ? 'bg-slate-50/80 hover:bg-slate-100/60 border-l-[3px] border-transparent'
                          : 'hover:bg-slate-50 border-l-[3px] border-transparent'
                      }`}
                    >
                      {/* Avatar with online dot placeholder */}
                      <div className="relative shrink-0">
                        <img
                          src={userProfile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${conv.userId}`}
                          alt={userProfile?.name}
                          className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50 object-cover"
                        />
                        {/* Role badge dot */}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
                          userProfile?.role === 'client' ? 'bg-blue-400' : 'bg-emerald-400'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-sm truncate ${hasUnread ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {userProfile?.name || 'Unknown User'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0">
                            {relativeTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs truncate flex-1 ${
                            hasUnread ? 'text-slate-700 font-semibold' : 'text-slate-400'
                          }`}>
                            {isSentByMe ? (
                              <span className="inline-flex items-center gap-0.5">
                                <CheckCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                                {conv.lastMessage.content}
                              </span>
                            ) : conv.lastMessage.content}
                          </p>

                          {/* Unread badge */}
                          {hasUnread && (
                            <span className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center bg-emerald-500 text-white text-[9px] font-black rounded-full px-1">
                              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                            </span>
                          )}
                        </div>

                        {/* Role tag */}
                        {userProfile?.role && (
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide mt-1.5 ${
                            userProfile.role === 'client'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {userProfile.role === 'client' ? <Briefcase className="w-2 h-2" /> : <UserIcon className="w-2 h-2" />}
                            {userProfile.role}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                  {searchQuery ? (
                    <>
                      <Search className="w-10 h-10 mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-slate-500">No results found</p>
                      <p className="text-xs text-slate-400 mt-1">Try a different name or keyword.</p>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-12 h-12 mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-slate-500">No conversations yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                        {currentUser?.role === 'client'
                          ? 'Browse freelancers and click "Contact Seller" to start chatting.'
                          : 'Find jobs and click "Message Client" to start chatting.'}
                      </p>
                      <Link
                        to={currentUser?.role === 'client' ? '/services' : '/jobs'}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow"
                      >
                        {currentUser?.role === 'client' ? 'Browse Talent' : 'Find Work'}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: Chat Thread ── */}
          {activeChatUserId ? (
            <div className="flex-1 flex flex-col bg-slate-50/30">

              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center gap-3 shadow-sm">
                <button
                  onClick={() => setActiveChatUserId(null)}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition mr-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeChatUserId}`}
                    alt={activeUser?.name}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 object-cover"
                  />
                  <Circle className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 fill-emerald-400 text-emerald-400 border-2 border-white rounded-full`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                    {activeUser?.name || 'Loading...'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${
                      activeUser?.role === 'client' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {activeUser?.role === 'client' ? <Briefcase className="w-2 h-2" /> : <UserIcon className="w-2 h-2" />}
                      {activeUser?.role || 'User'}
                    </span>
                    {activeUser?.country && (
                      <span className="text-xs text-slate-400">{activeUser.country}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const prevMsg = chatMessages[idx - 1];
                    // Show date separator if day changes
                    const showDateSep = !prevMsg ||
                      new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();

                    return (
                      <React.Fragment key={msg.id}>
                        {showDateSep && (
                          <div className="flex items-center gap-2 my-3">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap px-2">
                              {new Date(msg.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <div className="flex-1 h-px bg-slate-100" />
                          </div>
                        )}
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                          {!isMe && (
                            <img
                              src={activeUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.senderId}`}
                              className="w-6 h-6 rounded-full border border-slate-100 shrink-0 object-cover mb-0.5"
                              alt=""
                            />
                          )}
                          <div className={`max-w-[72%] group`}>
                            <div className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                              isMe
                                ? 'bg-emerald-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                            }`}>
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[9px] text-slate-400 font-medium">
                                {formatBubbleTime(msg.createdAt)}
                              </span>
                              {isMe && (
                                <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-emerald-500' : 'text-slate-300'}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 pt-16">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center mb-4">
                      <img
                        src={activeUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeChatUserId}`}
                        className="w-16 h-16 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                    <h5 className="font-extrabold text-slate-800 text-base mb-1">{activeUser?.name || 'New Chat'}</h5>
                    <p className="text-xs text-slate-400 max-w-xs text-center leading-relaxed">
                      This is the beginning of your conversation. Say hello to get the project started!
                    </p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-slate-100 bg-white">
                <form onSubmit={handleSend} className="flex gap-2 items-end">
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    placeholder={`Message ${activeUser?.name?.split(' ')[0] || 'user'}...`}
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (inputMessage.trim()) handleSend(e as unknown as React.FormEvent);
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-3 rounded-2xl flex items-center justify-center gap-1.5 transition font-bold text-sm shadow-md shadow-emerald-600/20 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Press Enter to send</p>
              </div>
            </div>
          ) : (
            /* Empty State – no conversation selected */
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-50/20 text-slate-400 p-12">
              <div className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-5">
                <MessageSquare className="w-10 h-10 text-slate-200" />
              </div>
              <h5 className="font-extrabold text-slate-800 text-lg mb-2">Select a conversation</h5>
              <p className="text-sm text-slate-400 max-w-xs text-center leading-relaxed mb-6">
                Pick a conversation on the left, or start a new one by clicking "Contact Seller" or "Message Client" on any gig or job page.
              </p>
              {totalUnread > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                    {totalUnread}
                  </span>
                  unread message{totalUnread !== 1 ? 's' : ''} waiting
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
