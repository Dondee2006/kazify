import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { GigCard } from '../components/GigCard';
import { Search, Briefcase, PlusCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const ClientMarketplace: React.FC = () => {
  const { filteredGigs, setSearchQuery, selectedCategory, setSelectedCategory, addShoutout } = useMarketplace();
  const { currentUser } = useAuth();

  // Modal and form states
  const [showPostModal, setShowPostModal] = useState(false);
  const [shoutoutTitle, setShoutoutTitle] = useState('');
  const [shoutoutDesc, setShoutoutDesc]   = useState('');
  const [shoutoutBudget, setShoutoutBudget] = useState(100);
  const [shoutoutTime, setShoutoutTime]   = useState(3);
  const [shoutoutCat, setShoutoutCat]     = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');

  // If not logged in or not a client (or admin/testing), you could redirect. 
  // For the sandbox, we'll allow viewing but preferably this is for clients.
  if (!currentUser) {
    return <Navigate to="/join" replace />;
  }

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

  const categories = ["Graphics & Design", "Programming & IT", "Writing & Translation", "Video & Animation"];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Marketplace Section Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2 flex-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-xs mb-2">
              <Briefcase className="w-5 h-5" /> Client Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
              {selectedCategory ? `${selectedCategory} Services` : 'Discover Top Freelance Talent'}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Browse vetted professional services. Hire securely with escrow protection and zero risk.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center gap-4">
             {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-slate-500 hover:text-slate-800 font-bold transition"
                >
                  Clear Filters
                </button>
             )}
             {currentUser?.role === 'client' && (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary-500/20 text-sm"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Post Job Request</span>
                </button>
             )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gigs Grid */}
        <div>
          {filteredGigs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-800">No services match your request</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                Try adjusting your search terms or clearing the selected category filter to see more results.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="mt-6 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Post Shoutout Modal Form Drawer */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Post a Job Shoutout</h3>
            <p className="text-xs text-slate-500 mb-4">
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={shoutoutTime}
                    onChange={(e) => setShoutoutTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={shoutoutCat}
                  onChange={(e) => setShoutoutCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Graphics & Design">Graphics & Design</option>
                  <option value="Programming & IT">Programming & IT</option>
                  <option value="Writing & Translation">Writing & Translation</option>
                  <option value="Video & Animation">Video & Animation</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-primary-500/20"
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
