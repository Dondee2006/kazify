import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { ShoutoutCard } from '../components/ShoutoutCard';
import { GigCard } from '../components/GigCard';
import { Zap, PlusCircle, Search, Laptop, Layers, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const FreelancerJobs: React.FC = () => {
  const { shoutouts, addShoutout, gigs, addGig, bids, acceptBid } = useMarketplace();
  const { currentUser, allUsers } = useAuth();
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [shoutoutTitle, setShoutoutTitle] = useState('');
  const [shoutoutDesc, setShoutoutDesc]   = useState('');
  const [shoutoutBudget, setShoutoutBudget] = useState(100);
  const [shoutoutTime, setShoutoutTime]   = useState(3);
  const [shoutoutCat, setShoutoutCat]     = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');
  const [filterCat, setFilterCat] = useState<string | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'find_jobs' | 'my_gigs'>('find_jobs');

  // Gig creation state
  const [showGigModal, setShowGigModal] = useState(false);
  const [gigTitle, setGigTitle] = useState('');
  const [gigDesc, setGigDesc] = useState('');
  const [gigCat, setGigCat] = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');
  const [gigPrice, setGigPrice] = useState(50000);
  const [gigTime, setGigTime] = useState(3);

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

  const handlePostGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await addGig(gigTitle, gigDesc, gigCat, gigPrice, gigTime, currentUser.id);
    setGigTitle('');
    setGigDesc('');
    setGigPrice(50000);
    setGigTime(3);
    setShowGigModal(false);
  };

  const categories = ["Graphics & Design", "Programming & IT", "Writing & Translation", "Video & Animation"];
  const displayShoutouts = filterCat ? shoutouts.filter(s => s.category === filterCat) : shoutouts;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-emerald-900 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2 flex-1">
             <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-2">
              <Zap className="w-5 h-5 fill-emerald-400" /> Workspace Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
              {activeTab === 'my_gigs' 
                ? (currentUser.role === 'client' ? 'My Posted Jobs' : 'My Service Listings')
                : (filterCat ? `${filterCat} Jobs` : 'Find Freelance Work')
              }
            </h1>
            <p className="text-emerald-200/80 text-lg max-w-2xl">
              {activeTab === 'my_gigs'
                ? (currentUser.role === 'client' 
                    ? 'Review and manage the job proposals freelancers have submitted to your listings.'
                    : 'Manage your professional service offerings. Gigs listed here are visible to all clients.')
                : 'Browse active job requests posted by clients. Submit your bids directly and start working instantly.'
              }
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center gap-4">
             {currentUser?.role === 'client' && (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary-500/20 text-sm"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Post Job Request</span>
                </button>
             )}
             {(currentUser?.role === 'freelancer' || currentUser?.role === 'student') && (
                <button
                  onClick={() => setShowGigModal(true)}
                  className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-primary-500/20 text-sm"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Service Listing</span>
                </button>
             )}
          </div>
        </div>

        {/* Tabs Selector */}
        <div className="flex gap-4 border-b border-slate-200 mb-8 z-10 relative">
          <button
            onClick={() => setActiveTab('find_jobs')}
            className={`pb-3 px-2 font-bold text-sm border-b-2 transition duration-200 flex items-center gap-2 ${
              activeTab === 'find_jobs'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            {currentUser?.role === 'client' ? 'All Job Requests' : 'Available Jobs'}
          </button>
          <button
            onClick={() => setActiveTab('my_gigs')}
            className={`pb-3 px-2 font-bold text-sm border-b-2 transition duration-200 flex items-center gap-2 ${
              activeTab === 'my_gigs'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {currentUser?.role === 'client' ? (
              <>
                <Layers className="w-4 h-4" />
                <span>My Posted Jobs</span>
              </>
            ) : (
              <>
                <Laptop className="w-4 h-4" />
                <span>My Service Listings</span>
              </>
            )}
          </button>
        </div>

        {activeTab === 'find_jobs' ? (
          <>
            {/* Categories Bar */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
              <button
                onClick={() => setFilterCat(null)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                  filterCat === null
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Jobs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                    filterCat === cat
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Jobs Feed Grid */}
            <div>
              {displayShoutouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayShoutouts.map((shoutout) => (
                    <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-800">No open jobs found</h3>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    There are currently no active job requests in this category. Check back soon or try another category.
                  </p>
                  {filterCat && (
                    <button
                      onClick={() => setFilterCat(null)}
                      className="mt-6 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg"
                    >
                      View All Categories
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Tab 2: My Gigs (Freelancer) or My Posted Jobs (Client) */
          <div>
            {currentUser?.role === 'client' ? (
              /* Client view: My Posted Jobs with Proposals List */
              shoutouts.filter(s => s.clientId === currentUser?.id).length > 0 ? (
                <div className="space-y-8">
                  {shoutouts.filter(s => s.clientId === currentUser?.id).map((shoutout) => {
                    const shoutoutBids = bids.filter(b => b.shoutoutId === shoutout.id);
                    
                    return (
                      <div key={shoutout.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        {/* Shoutout Header Info */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {shoutout.category}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-800 mt-2">{shoutout.title}</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-3xl">{shoutout.description}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-6 text-slate-700 bg-white p-4 rounded-2xl border border-slate-100">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Budget</p>
                              <p className="text-base font-black text-slate-800 mt-1">UGX {shoutout.budget}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Timeline</p>
                              <p className="text-base font-black text-slate-800 mt-1">{shoutout.deliveryTime} Days</p>
                            </div>
                          </div>
                        </div>

                        {/* Bids List */}
                        <div className="p-6">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                            Freelancer Proposals ({shoutoutBids.length})
                          </h4>
                          
                          {shoutoutBids.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                              {shoutoutBids.map(bid => {
                                const bidder = allUsers.find(u => u.id === bid.freelancerId);
                                
                                return (
                                  <div key={bid.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                      <img
                                        src={bidder?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${bid.freelancerId}`}
                                        alt={bidder?.name}
                                        className="w-11 h-11 rounded-full border border-slate-100 bg-slate-50 object-cover shrink-0"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-sm font-extrabold text-slate-800 truncate">{bidder?.name || 'Freelancer'}</span>
                                          <span className="text-[10px] text-slate-400 font-medium">({bidder?.country || 'Kenya'})</span>
                                          {bid.status === 'accepted' && (
                                            <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                              Accepted
                                            </span>
                                          )}
                                          {bid.status === 'rejected' && (
                                            <span className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                              Closed
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 italic leading-relaxed">
                                          "{bid.proposal || 'No proposal text provided.'}"
                                        </p>
                                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-semibold mt-1.5">
                                          <span>Offer: <span className="text-slate-700 font-bold">UGX {bid.amount}</span></span>
                                          <span>Delivery: <span className="text-slate-700 font-bold">{bid.deliveryTime} days</span></span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                                      <Link
                                        to={`/inbox?to=${bid.freelancerId}`}
                                        className="flex-1 md:flex-initial px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                                      >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Message</span>
                                      </Link>
                                      {bid.status === 'pending' && (
                                        <button
                                          onClick={() => acceptBid(bid.id)}
                                          className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span>Accept Proposal</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-2xl">
                              <p className="text-xs font-semibold">No proposals received yet.</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Freelancers will submit bids soon.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                  <Layers className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-800">No job requests found</h3>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    You haven't posted any job requests (shoutouts) yet. Post a job to match with top African freelance talent.
                  </p>
                  <button
                    onClick={() => setShowPostModal(true)}
                    className="mt-6 px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg"
                  >
                    Post Your First Job
                  </button>
                </div>
              )
            ) : (
              /* Freelancer view: My Service Listings */
              gigs.filter(g => g.freelancerId === currentUser?.id).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gigs.filter(g => g.freelancerId === currentUser?.id).map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                  <Laptop className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-800">No service listings found</h3>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    You haven't created any service listings (gigs) yet. Create one to display your skills in the marketplace.
                  </p>
                  <button
                    onClick={() => setShowGigModal(true)}
                    className="mt-6 px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg"
                  >
                    Create Your First Listing
                  </button>
                </div>
              )
            )}
          </div>
        )}
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

      {/* Create Gig Modal Form Drawer */}
      {showGigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Service Listing (Gig)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Offer your professional services to clients. Set your own starting price and delivery time.
            </p>

            <form onSubmit={handlePostGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. I will design a high-converting landing page"
                  value={gigTitle}
                  onChange={(e) => setGigTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your service in detail, what is included, your workflow, and what the client will receive..."
                  value={gigDesc}
                  onChange={(e) => setGigDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Starting Price (UGX)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={gigPrice}
                    onChange={(e) => setGigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={gigTime}
                    onChange={(e) => setGigTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={gigCat}
                  onChange={(e) => setGigCat(e.target.value as any)}
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
                  onClick={() => setShowGigModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-primary-500/20"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
