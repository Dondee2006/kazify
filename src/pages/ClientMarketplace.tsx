import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { GigCard } from '../components/GigCard';
import { Search, SlidersHorizontal, ChevronDown, PlusCircle, X } from 'lucide-react';

export const ClientMarketplace: React.FC = () => {
  const { filteredGigs, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, addShoutout } = useMarketplace();
  const { currentUser } = useAuth();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [shoutoutTitle, setShoutoutTitle] = useState('');
  const [shoutoutDesc, setShoutoutDesc] = useState('');
  const [shoutoutBudget, setShoutoutBudget] = useState(100);
  const [shoutoutTime, setShoutoutTime] = useState(3);
  const [shoutoutCat, setShoutoutCat] = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');
  const catRef = useRef<HTMLDivElement>(null);

  const categories = ['Graphics & Design', 'Programming & IT', 'Writing & Translation', 'Video & Animation'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handlePostShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addShoutout(shoutoutTitle, shoutoutDesc, shoutoutBudget, shoutoutTime, currentUser.id, shoutoutCat);
    setShoutoutTitle('');
    setShoutoutDesc('');
    setShoutoutBudget(100);
    setShoutoutTime(3);
    setShowPostModal(false);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="bg-[#0d4f47] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Browse Services</h1>
          <p className="text-white/70 text-sm mb-6">Find skilled professionals across Kazify</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden shadow-md max-w-3xl">
            <div className="pl-4 text-slate-400 flex-shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-[#0d4f47] hover:bg-[#0a3d37] text-white font-semibold px-8 py-3.5 text-sm transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-slate-700 hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                {selectedCategory || 'Category'}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
                  <button
                    onClick={() => { setSelectedCategory(null); setIsCatOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition ${!selectedCategory ? 'text-[#0d4f47] font-semibold bg-teal-50' : 'text-slate-700 hover:bg-gray-50'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCatOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${selectedCategory === cat ? 'text-[#0d4f47] font-semibold bg-teal-50' : 'text-slate-700 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active filter pill */}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-teal-50 text-[#0d4f47] border border-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                "{searchQuery}"
                <button onClick={() => { setSearchQuery(''); setLocalSearch(''); }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium">
              {filteredGigs.length} service{filteredGigs.length !== 1 ? 's' : ''}
            </span>
            {currentUser?.role === 'client' && (
              <button
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-1.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white text-sm font-semibold px-4 py-2 rounded-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                Post Job
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── GIGS GRID ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-9 h-9 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No services found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search or clearing the category filter to see more results.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setLocalSearch(''); setSelectedCategory(null); }}
              className="px-6 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white font-semibold rounded-lg text-sm transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ── POST JOB MODAL ──────────────────────────────────────────── */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post a Job Request</h3>
            <p className="text-xs text-slate-500 mb-5">
              Describe your task, set the maximum budget, and watch freelancers submit bids.
            </p>

            <form onSubmit={handlePostShoutout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js dashboard styling fixes"
                  value={shoutoutTitle}
                  onChange={(e) => setShoutoutTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the scope of work, technologies used, and expectations..."
                  value={shoutoutDesc}
                  onChange={(e) => setShoutoutDesc(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Budget (UGX)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={shoutoutBudget}
                    onChange={(e) => setShoutoutBudget(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={shoutoutTime}
                    onChange={(e) => setShoutoutTime(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={shoutoutCat}
                  onChange={(e) => setShoutoutCat(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Graphics & Design">Graphics & Design</option>
                  <option value="Programming & IT">Programming & IT</option>
                  <option value="Writing & Translation">Writing & Translation</option>
                  <option value="Video & Animation">Video & Animation</option>
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white text-sm font-bold rounded-lg transition"
                >
                  Post Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
