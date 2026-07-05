import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useChat } from '../context/ChatContext';
import { ChevronDown, LogOut, ArrowLeftRight, Check, Award, MessageSquare, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, logout } = useAuth();
  const { setSearchQuery, setSelectedCategory } = useMarketplace();
  const { totalUnread } = useChat();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDevSwitcherOpen, setIsDevSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link 
            to={currentUser ? (currentUser.role === 'client' ? '/services' : currentUser.role === 'student' ? '/academy' : '/jobs') : '/'} 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} 
            className="flex items-center gap-2"
          >
            {/* Kept the logo text but updated color for white background */}
            <span className="text-2xl font-black font-display tracking-tight text-slate-900 flex items-center">
              Kazi<span className="text-primary-600">fy</span>
            </span>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-end pr-6 border-r border-gray-200">
          {!currentUser ? (
            <>
              <Link to="/" className="text-sm font-semibold text-primary-700 hover:text-primary-900 transition">
                Home
              </Link>
              <Link to="/services" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition">
                Services
              </Link>
              <Link to="/providers" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition">
                Providers
              </Link>
            </>
          ) : (
            <>
              {currentUser.role === 'student' && (
                <Link to="/academy" className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition">
                  <Award className="w-4 h-4" />
                  Academy Arena
                </Link>
              )}
              {currentUser.role === 'client' && (
                <>
                  <Link to="/services" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition">
                    Browse Talent
                  </Link>
                  <Link to="/jobs" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition">
                    Job Requests
                  </Link>
                </>
              )}
              {currentUser.role === 'freelancer' && (
                <Link to="/jobs" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition">
                  Find Work
                </Link>
              )}
              {currentUser.role !== 'student' && (
                <Link to="/inbox" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-700 transition relative">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                  {totalUnread > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[9px] font-black rounded-full px-1 shadow-sm">
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Section: Auth or User Dashboard Switcher */}
        <div className="flex items-center gap-4 pl-2">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Role indicator badge */}
              <span className={`hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentUser.role === 'client' 
                  ? 'bg-blue-50 text-blue-600' 
                  : currentUser.role === 'student'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-primary-50 text-primary-700'
              }`}>
                {currentUser.role}
              </span>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm bg-gray-50"
                  />
                  <ChevronDown className="w-4 h-4 hidden sm:block text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{currentUser.country}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setIsDevSwitcherOpen(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                          <span>Simulate Another User</span>
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); logout(); navigate('/'); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2 text-rose-600 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/join" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                <LogIn className="w-4 h-4 text-slate-500" />
                Sign in
              </Link>
              <Link
                to="/join"
                className="bg-[#0f766e] hover:bg-[#115e59] text-white font-semibold text-sm px-6 py-2.5 rounded-full transition duration-200 shadow-sm"
              >
                Join free
              </Link>
            </div>
          )}

          {/* Quick Persona Switcher Toggle Icon (For Dev) */}
          <button
            onClick={() => setIsDevSwitcherOpen(!isDevSwitcherOpen)}
            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition ml-2"
            title="Open Developer Identity Switcher"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Developer Persona Switcher Drawer/Modal */}
      {isDevSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">⚡</span>
              Identity Simulator Widget
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantly toggle between clients and freelancers to test buy-flows, job postings, and escrow state transitions.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsDevSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition duration-150 ${
                    currentUser?.id === user.id
                      ? 'bg-primary-50 border-primary-200 text-slate-900'
                      : 'bg-white border-gray-100 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-100 border border-gray-200 object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {user.role === 'client' ? '💼 Client' : user.role === 'student' ? '🎓 Learner' : '🛠️ Freelancer'} • {user.country}
                      </p>
                    </div>
                  </div>
                  {currentUser?.id === user.id && (
                    <Check className="w-4 h-4 text-primary-600 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsDevSwitcherOpen(false)}
              className="mt-5 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
