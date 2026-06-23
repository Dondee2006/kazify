import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockUsers } from '../data/mockData';

export interface User {
  id: string;
  name: string;
  role: 'client' | 'freelancer' | 'student';
  country: string;
  bio: string;
  avatar: string;
  rating: number;
  joinedDate: string;
  skills: string[];
  onboardingComplete: boolean;
  xp?: number;
  badges?: any[];
}

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  login: (userId: string) => void;
  logout: () => Promise<void>;
  loginWithGoogle: (role: 'client' | 'freelancer' | 'student', country: string) => Promise<void>;
  register: (name: string, role: 'client' | 'freelancer' | 'student', country: string, bio: string, email?: string, password?: string) => Promise<User | null>;
  switchUser: (userId: string) => void;
  completeOnboarding: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const mapProfile = (p: any): User => ({
    id: p.id,
    name: p.name,
    role: p.role,
    country: p.country,
    bio: p.bio || '',
    avatar: p.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(p.name)}`,
    rating: p.rating,
    joinedDate: p.joined_date,
    skills: p.skills || [],
    onboardingComplete: p.onboarding_complete,
    xp: p.xp,
    badges: []
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock Mode initialization
      const storedUsers = localStorage.getItem('kazify_mock_users');
      let usersList: User[] = [];
      if (storedUsers) {
        usersList = JSON.parse(storedUsers);
      } else {
        usersList = mockUsers.map(u => ({
          id: u.id,
          name: u.name,
          role: u.role,
          country: u.country,
          bio: u.bio || '',
          avatar: u.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.name)}`,
          rating: u.rating,
          joinedDate: u.joinedDate,
          skills: u.skills || [],
          onboardingComplete: u.onboardingComplete ?? true,
          xp: u.xp,
          badges: u.badges || []
        }));
        localStorage.setItem('kazify_mock_users', JSON.stringify(usersList));
      }
      setAllUsers(usersList);

      const storedCurrentUser = localStorage.getItem('kazify_mock_current_user');
      if (storedCurrentUser) {
        setCurrentUser(JSON.parse(storedCurrentUser));
      } else {
        // Sarah Mwangi is the default client out of the box (id: 'u-5')
        const defaultUser = usersList.find(u => u.id === 'u-5') || usersList[0] || null;
        setCurrentUser(defaultUser);
        if (defaultUser) {
          localStorage.setItem('kazify_mock_current_user', JSON.stringify(defaultUser));
        }
      }
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(mapProfile(profile));
        } else {
          // New Google user — no profile yet, set temporary state so onboarding can finish setup
          const googleUser = session.user;
          const pendingRole = (localStorage.getItem('kazify_pending_role') || 'client') as User['role'];
          const pendingCountry = localStorage.getItem('kazify_pending_country') || 'Kenya 🇰🇪';

          setCurrentUser({
            id: googleUser.id,
            name: googleUser.user_metadata?.full_name || googleUser.email?.split('@')[0] || 'New User',
            role: pendingRole,
            country: pendingCountry,
            bio: '',
            avatar: googleUser.user_metadata?.avatar_url || '',
            rating: 5.0,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            skills: [],
            onboardingComplete: false,
            xp: 0,
            badges: []
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    fetchProfiles();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfiles = async () => {
    if (!isSupabaseConfigured) {
      const storedUsers = localStorage.getItem('kazify_mock_users');
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
      return;
    }

    const { data } = await supabase.from('profiles').select('*');
    if (data) {
      setAllUsers(data.map(mapProfile));
    }
  };

  const loginWithGoogle = async (role: 'client' | 'freelancer' | 'student', country: string) => {
    if (!isSupabaseConfigured) {
      const matchedUser = allUsers.find(u => u.role === role && u.country.includes(country.split(' ')[0])) || allUsers.find(u => u.role === role) || allUsers[0];
      setCurrentUser(matchedUser);
      localStorage.setItem('kazify_mock_current_user', JSON.stringify(matchedUser));
      return;
    }

    localStorage.setItem('kazify_pending_role', role);
    localStorage.setItem('kazify_pending_country', country);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const login = async (userId: string) => {
    if (!isSupabaseConfigured) {
      const matchedUser = allUsers.find(u => u.id === userId);
      if (matchedUser) {
        setCurrentUser(matchedUser);
        localStorage.setItem('kazify_mock_current_user', JSON.stringify(matchedUser));
      }
      return;
    }

    console.error('Login by user ID is not supported with Supabase Auth.');
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setCurrentUser(null);
      localStorage.removeItem('kazify_mock_current_user');
      return;
    }

    await supabase.auth.signOut();
  };

  const register = async (name: string, role: 'client' | 'freelancer' | 'student', country: string, bio: string, email?: string, password?: string) => {
    if (!isSupabaseConfigured) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        name,
        role,
        country,
        bio,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        rating: 5.0,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        skills: role === 'freelancer' ? ['Generalist'] : [],
        onboardingComplete: false,
        xp: role === 'student' ? 0 : undefined
      };

      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      localStorage.setItem('kazify_mock_users', JSON.stringify(updatedUsers));
      setCurrentUser(newUser);
      localStorage.setItem('kazify_mock_current_user', JSON.stringify(newUser));
      return newUser;
    }

    const userEmail = email || `${name.replace(/\s+/g, '').toLowerCase()}${Date.now()}@kazify.mock`;
    const userPassword = password || 'KazifyMockPassword123!';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userEmail,
      password: userPassword,
    });

    if (authError || !authData.user) {
      console.error('Signup error:', authError);
      return null;
    }

    const newProfile = {
      id: authData.user.id,
      name,
      role,
      country,
      bio,
      rating: 5.0,
      joined_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      skills: role === 'freelancer' ? ['Generalist'] : [],
      onboarding_complete: false,
      xp: role === 'student' ? 0 : null
    };

    const { error: profileError } = await supabase.from('profiles').insert(newProfile);
    if (profileError) console.error('Profile creation error:', profileError);

    await fetchProfiles();

    return {
      id: newProfile.id,
      name: newProfile.name,
      role: newProfile.role as any,
      country: newProfile.country,
      bio: newProfile.bio,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      rating: newProfile.rating,
      joinedDate: newProfile.joined_date,
      skills: newProfile.skills,
      onboardingComplete: newProfile.onboarding_complete,
      xp: newProfile.xp || 0
    };
  };

  const switchUser = (userId: string) => {
    login(userId);
  };

  const completeOnboarding = async (updates: Partial<User>) => {
    if (!currentUser) return;

    if (!isSupabaseConfigured) {
      const updatedUser = { ...currentUser, ...updates, onboardingComplete: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('kazify_mock_current_user', JSON.stringify(updatedUser));

      const updatedUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
      setAllUsers(updatedUsers);
      localStorage.setItem('kazify_mock_users', JSON.stringify(updatedUsers));
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const googleMeta = session?.user?.user_metadata;

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', currentUser.id)
      .single();

    const profileData = {
      id: currentUser.id,
      name: updates.name || currentUser.name || googleMeta?.full_name || 'User',
      role: updates.role || currentUser.role,
      country: updates.country || currentUser.country,
      bio: updates.bio || currentUser.bio || '',
      avatar: googleMeta?.avatar_url || currentUser.avatar,
      rating: 5.0,
      joined_date: currentUser.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      skills: updates.skills || currentUser.skills || [],
      onboarding_complete: true,
      xp: (updates.role || currentUser.role) === 'student' ? 0 : null
    };

    if (existing) {
      await supabase.from('profiles').update({ ...profileData, onboarding_complete: true }).eq('id', currentUser.id);
    } else {
      await supabase.from('profiles').insert(profileData);
    }

    localStorage.removeItem('kazify_pending_role');
    localStorage.removeItem('kazify_pending_country');

    setCurrentUser({ ...currentUser, ...updates, onboardingComplete: true });
    await fetchProfiles();
  };

  return (
    <AuthContext.Provider value={{ currentUser, allUsers, login, logout, loginWithGoogle, register, switchUser, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

