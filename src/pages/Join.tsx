import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Laptop, Landmark, Loader2 } from 'lucide-react';

export const Join: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  const [role, setRole] = useState<'client' | 'freelancer' | 'student'>('client');
  const [country, setCountry] = useState('Kenya 🇰🇪');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const africanCountries = [
    "Kenya 🇰🇪", "Nigeria 🇳🇬", "Ghana 🇬🇭", "Senegal 🇸🇳",
    "Tanzania 🇹🇿", "South Africa 🇿🇦", "Mali 🇲🇱", "Rwanda 🇷🇼", "Uganda 🇺🇬"
  ];

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle(role, country);
      // Page will redirect to Google — no further action needed here
    } catch (err: any) {
      setError(err.message || 'Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="w-full max-w-xl grid md:grid-cols-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">

        {/* Left Sidebar */}
        <div className="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(22,163,74,0.08)_0%,transparent_40%)]" />

          <div className="space-y-4 z-10">
            <span className="text-2xl font-black font-display tracking-tight">Kazi<span className="text-primary-400">fy</span></span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Join the premier freelance marketplace bridging African creative and technology experts with global clients.
            </p>
          </div>

          <div className="space-y-4 z-10 pt-6">
            <div className="flex items-start gap-2 text-[10px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
              <span>Escrow protection guarantees payments for deliverables.</span>
            </div>
            <div className="flex items-start gap-2 text-[10px] text-slate-300">
              <Laptop className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
              <span>Vetted local talent from Ghana, Nigeria, Kenya and Mali.</span>
            </div>
            <div className="flex items-start gap-2 text-[10px] text-slate-300">
              <Landmark className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
              <span>Zero setup fees. Pay only for milestones achieved.</span>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-semibold mt-6 z-10">© 2026 Kazify Inc.</div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Join Kazify</h2>
            <p className="text-xs text-slate-400">Choose your role, then sign in with Google.</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">I want to...</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                  role === 'client'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>💼</span>
                <span>Hire Talent</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                  role === 'freelancer'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🛠️</span>
                <span>Work Freelance</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-3 px-2 text-center rounded-xl border text-[11px] font-bold transition flex flex-col items-center gap-1 ${
                  role === 'student'
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🎓</span>
                <span>Learn & Earn</span>
              </button>
            </div>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {africanCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-800 font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>{isLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            By continuing, you agree to Kazify's Terms of Service. Your role can be changed during onboarding.
          </p>
        </div>
      </div>
    </div>
  );
};
