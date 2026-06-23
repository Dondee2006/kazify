import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

/**
 * This page handles the OAuth redirect from Google/Supabase.
 * Supabase processes the URL hash token, fires onAuthStateChange,
 * which AuthContext listens to and sets the user.
 * We then redirect to onboarding if new user, or home if existing.
 */
export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Give Supabase a moment to process the hash tokens from the URL
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Auth callback error:', error);
        navigate('/join');
        return;
      }

      // Check if user already has a profile (returning user) or is new
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, onboarding_complete')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_complete) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">Signing you in...</p>
          <p className="text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};
