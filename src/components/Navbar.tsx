import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useChat } from '../context/ChatContext';
import { Search, ChevronDown, LogOut, ArrowLeftRight, Check, Award, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, allUsers, switchUser, logout } = useAuth();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useMarketplace();
  const { totalUnread } = useChat();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDevSwitcherOpen, setIsDevSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Graphics & Design",
    "Programming & IT",
    "Writing & Translation",
    "Video & Animation"
  ];

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Determine the correct destination path based on role
    const destPath = currentUser 
      ? (currentUser.role === 'client' ? '/services' : currentUser.role === 'student' ? '/academy' : '/jobs') 
      : '/';
      
    if (window.location.pathname !== destPath) {
      navigate(destPath);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-emerald-950 border-b border-emerald-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Category Dropdown */}
        <div className="flex items-center gap-6">
          <Link 
            to={currentUser ? (currentUser.role === 'client' ? '/services' : currentUser.role === 'student' ? '/academy' : '/jobs') : '/'} 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} 
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-black font-display tracking-tight text-white flex items-center">
              Kazi<span className="text-primary-400">fy</span>
            </span>
          </Link>

          {/* Category Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-emerald-100 hover:text-white transition duration-200"
            >
              <span>{selectedCategory || 'Categories'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-emerald-900 border border-emerald-800 shadow-xl py-1 z-20 transition-all duration-200">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="w-full text-left px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-800 hover:text-white transition-colors"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category as any)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-900/40 text-primary-400 font-medium'
                          : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {currentUser?.role === 'student' && (
            <Link to="/academy" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-amber-300 hover:text-amber-200 transition duration-200 border border-amber-500/20 bg-amber-500/10">
              <Award className="w-4 h-4" />
              <span>Academy Arena</span>
            </Link>
          )}

          {currentUser?.role === 'client' && (
            <>
              <Link to="/services" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-emerald-100 hover:text-white transition duration-200">
                Browse Talent
              </Link>
              <Link to="/jobs" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-emerald-100 hover:text-white transition duration-200">
                Job Requests
              </Link>
            </>
          )}

          {currentUser?.role === 'freelancer' && (
            <Link to="/jobs" className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-emerald-100 hover:text-white transition duration-200">
              Find Work
            </Link>
          )}

          {/* Messages Link — visible to clients and freelancers */}
          {currentUser && currentUser.role !== 'student' && (
            <Link
              to="/inbox"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-emerald-900 text-emerald-100 hover:text-white transition duration-200 relative"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[9px] font-black rounded-full px-1 shadow-md shadow-rose-500/40 animate-pulse">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/80">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search verified services (e.g. Next.js, logo)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-emerald-900 border border-emerald-800 text-emerald-50 placeholder-emerald-400 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-inner"
          />
        </div>

        {/* Right Section: Auth or User Dashboard Switcher */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Role indicator badge */}
              <span className={`hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                currentUser.role === 'client' 
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-800' 
                  : currentUser.role === 'student'
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-800'
                    : 'bg-primary-900/50 text-primary-300 border border-primary-800'
              }`}>
                {currentUser.role} Mode
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
                    className="w-8 h-8 rounded-full border border-emerald-700 object-cover shadow-sm bg-emerald-800"
                  />
                  <span className="hidden sm:block text-sm font-medium text-emerald-100 hover:text-white transition">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 hidden sm:block text-emerald-300" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-emerald-900 border border-emerald-800 shadow-xl py-2 z-20 text-emerald-100">
                      <div className="px-4 py-3 border-b border-emerald-800">
                        <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                        <p className="text-xs text-emerald-300 mt-0.5">{currentUser.country}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setIsUserMenuOpen(false); setIsDevSwitcherOpen(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-800 flex items-center gap-2 text-emerald-300"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                          <span>Simulate Another User</span>
                        </button>
                        <button
                          onClick={() => { setIsUserMenuOpen(false); logout(); navigate('/'); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-800 flex items-center gap-2 text-rose-400"
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
            <div className="flex items-center gap-3">
              <Link to="/join" className="text-sm font-medium text-emerald-200 hover:text-white transition px-3 py-2">
                Sign In
              </Link>
              <Link
                to="/join"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-4 py-2 rounded-full transition duration-200 shadow-lg shadow-primary-500/20"
              >
                Join Kazify
              </Link>
            </div>
          )}

          {/* Quick Persona Switcher Toggle Icon */}
          <button
            onClick={() => setIsDevSwitcherOpen(!isDevSwitcherOpen)}
            className="p-2 bg-emerald-900 text-emerald-300 hover:text-primary-400 hover:bg-emerald-800 rounded-lg transition"
            title="Open Developer Identity Switcher"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Developer Persona Switcher Drawer/Modal */}
      {isDevSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-emerald-950 rounded-2xl border border-emerald-800 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-900/50 text-emerald-400">⚡</span>
              Identity Simulator Widget
            </h3>
            <p className="text-xs text-emerald-300/80 mb-4">
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
                      ? 'bg-primary-900/30 border-primary-500/50 text-white'
                      : 'bg-emerald-900 border-emerald-800 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-700 object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-emerald-400/80 font-medium">
                        {user.role === 'client' ? '💼 Client' : user.role === 'student' ? '🎓 Learner' : '🛠️ Freelancer'} • {user.country}
                      </p>
                    </div>
                  </div>
                  {currentUser?.id === user.id && (
                    <Check className="w-4 h-4 text-primary-400 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsDevSwitcherOpen(false)}
              className="mt-5 w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold text-sm rounded-xl transition"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

