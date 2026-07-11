import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<'client' | 'freelancer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!selected) {
      setError('Please choose an option to continue.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      // Register a local simulation user
      await register(
        name.trim(),
        selected,
        'Uganda 🇺🇬',
        selected === 'freelancer' ? 'Ugandan Freelancer Specialist' : 'Business owner looking for Ugandan talent.'
      );
      // Navigate to onboarding flow
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-slate-900">
              Kazi<span className="text-[#0d4f47]">fy</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Onboarding Simulator</h1>
          <p className="text-sm text-slate-500 mb-6">Choose your role and enter your name to simulate onboarding.</p>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 focus:border-[#0d4f47] transition"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">I want to...</label>

              {/* Hire Talent */}
              <button
                type="button"
                onClick={() => setSelected('client')}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  selected === 'client'
                    ? 'border-[#0d4f47] bg-[#0d4f47]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {/* Radio circle */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === 'client' ? 'border-[#0d4f47]' : 'border-gray-300'
                }`}>
                  {selected === 'client' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d4f47]" />
                  )}
                </div>
                <div>
                  <p className={`font-bold text-base ${selected === 'client' ? 'text-[#0d4f47]' : 'text-slate-800'}`}>
                    Hire Talent
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">I need to find skilled professionals for my work.</p>
                </div>
              </button>

              {/* Find Work */}
              <button
                type="button"
                onClick={() => setSelected('freelancer')}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  selected === 'freelancer'
                    ? 'border-[#0d4f47] bg-[#0d4f47]/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {/* Radio circle */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === 'freelancer' ? 'border-[#0d4f47]' : 'border-gray-300'
                }`}>
                  {selected === 'freelancer' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d4f47]" />
                  )}
                </div>
                <div>
                  <p className={`font-bold text-base ${selected === 'freelancer' ? 'text-[#0d4f47]' : 'text-slate-800'}`}>
                    Find Work
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">I want to offer my skills and earn as a freelancer.</p>
                </div>
              </button>
            </div>

            {/* Start Simulation Button */}
            <button
              type="submit"
              disabled={!selected || !name.trim() || isLoading}
              className="w-full bg-[#0d4f47] hover:bg-[#0a3d37] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition"
            >
              {isLoading ? 'Starting Simulation...' : 'Start Onboarding Simulation'}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/join" className="text-[#0d4f47] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          By continuing, you agree to Kazify's{' '}
          <span className="underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
