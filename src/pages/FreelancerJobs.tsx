import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { 
  DollarSign, Briefcase, Mail, Clock, CheckCircle2, 
  MessageSquare, Activity, Search, Wallet, Compass, 
  Send, Paperclip, Smile, Mic, Share2, Bookmark, Star, 
  AlertCircle, PlusCircle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const FreelancerJobs: React.FC = () => {
  const { shoutouts, gigs, addGig, bids, placeBid } = useMarketplace();
  const { currentUser, allUsers } = useAuth();
  const { conversations, activeChatUserId, setActiveChatUserId, sendMessage, messages } = useChat();

  // Navigation tab state: 'dashboard' | 'find_jobs' | 'messages' | 'wallet'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'find_jobs' | 'messages' | 'wallet'>('dashboard');

  // Find Jobs state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [filterBudget, setFilterBudget] = useState<number>(0);
  const [filterRemote, setFilterRemote] = useState<boolean>(false);
  const [filterExp, setFilterExp] = useState<string>('All');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Job Apply / Bid State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyBidAmount, setApplyBidAmount] = useState<number>(0);
  const [applyBidDays, setApplyBidDays] = useState<number>(3);
  const [applyProposal, setApplyProposal] = useState('');

  // Slack-like Messages state
  const [typedMessage, setTypedMessage] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  // Wallet state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100000);
  const [withdrawMethod, setWithdrawMethod] = useState<'mtn' | 'airtel' | 'bank'>('mtn');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Gig creation state
  const [showGigModal, setShowGigModal] = useState(false);
  const [gigTitle, setGigTitle] = useState('');
  const [gigDesc, setGigDesc] = useState('');
  const [gigCat, setGigCat] = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');
  const [gigPrice, setGigPrice] = useState(50000);
  const [gigTime, setGigTime] = useState(3);

  // Auto-select first job on tab mount
  useEffect(() => {
    if (shoutouts.length > 0 && !selectedJobId) {
      setSelectedJobId(shoutouts[0].id);
    }
  }, [shoutouts, selectedJobId]);

  if (!currentUser) return <Navigate to="/join" replace />;

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

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !currentUser) return;
    try {
      await placeBid(selectedJobId, currentUser.id, applyBidAmount, applyBidDays, applyProposal);
      setShowApplyModal(false);
      setApplyProposal('');
      alert('Proposal submitted successfully!');
    } catch (err: any) {
      alert('Failed to submit proposal: ' + err.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatUserId) return;
    await sendMessage(activeChatUserId, typedMessage.trim());
    setTypedMessage('');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
      alert('Withdrawal request initiated successfully via Mobile Money / Bank!');
    }, 1500);
  };

  // Mock Wallet data
  const walletData = {
    balance: 'UGX 1,400,000',
    withdrawn: 'UGX 350,000',
    transactions: [
      { id: 't-1', type: 'Earnings', job: 'Next.js payment hook Integration', date: '2026-07-10', amount: 'UGX 500,000', status: 'completed' },
      { id: 't-2', type: 'Withdrawal', job: 'MTN Mobile Money withdrawal', date: '2026-07-08', amount: '-UGX 200,000', status: 'completed' },
      { id: 't-3', type: 'Earnings', job: 'Figma Brand Guidelines design', date: '2026-07-05', amount: 'UGX 800,000', status: 'completed' },
      { id: 't-4', type: 'Withdrawal', job: 'Airtel Money withdrawal', date: '2026-07-01', amount: '-UGX 150,000', status: 'completed' },
    ],
    invoices: [
      { id: 'inv-101', date: '2026-07-10', amount: 'UGX 500,000', client: 'Sarah Mwangi', status: 'Paid' },
      { id: 'inv-100', date: '2026-07-05', amount: 'UGX 800,000', client: 'Koffi Mensah', status: 'Paid' },
    ]
  };

  // Categories and filtering
  const categories = ["Graphics & Design", "Programming & IT", "Writing & Translation", "Video & Animation"];
  
  const filteredJobs = shoutouts.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCat === 'All' || job.category === filterCat;
    const matchesBudget = filterBudget === 0 || job.budget >= filterBudget;
    return matchesSearch && matchesCat && matchesBudget;
  });

  const selectedJob = shoutouts.find(j => j.id === selectedJobId) || shoutouts[0];

  // Derived chat details
  const activeParticipant = allUsers.find(u => u.id === activeChatUserId) || null;
  const activeMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === activeChatUserId) ||
    (m.senderId === activeChatUserId && m.receiverId === currentUser.id)
  );

  // Filtered direct message list based on search
  const filteredConversations = conversations.filter(conv => {
    const participant = allUsers.find(u => u.id === conv.userId);
    return !chatSearch || (participant?.name.toLowerCase().includes(chatSearch.toLowerCase()));
  });

  // Calendar dates
  const daysInMonth = 31;
  const today = new Date().getDate();

  // Stats
  const stats = {
    totalEarnings: 'UGX 1,750,000',
    pendingPayments: 'UGX 350,000',
    activeJobsCount: 2,
    invitationsCount: 2,
    profileScore: 85,
    rating: 4.9,
  };

  // Get active bids for user
  const activeBids = bids.filter(b => b.freelancerId === currentUser.id);

  // Get own gigs
  const ownGigs = gigs.filter(g => g.freelancerId === currentUser.id);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex flex-col lg:flex-row">
      
      {/* ── SIDEBAR NAVIGATION (OS / Slack-like Dashboard Navigation) ── */}
      <aside className="w-full lg:w-64 bg-[#0d4f47] text-white shrink-0 flex flex-col border-r border-[#0a3d37]">
        {/* Workspace Brand / Header */}
        <div className="p-6 border-b border-[#0a3d37] flex items-center justify-between">
          <div>
            <h2 className="font-black tracking-tight text-lg">KaziWorkspace</h2>
            <p className="text-[10px] text-teal-200">Freelancer Portal</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-[#0a3d37] flex items-center gap-3 bg-[#0a3d37]/20">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full border border-teal-600 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">{currentUser.name}</p>
            <p className="text-[10px] text-teal-200 uppercase tracking-wider">{currentUser.role}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-teal-100 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('find_jobs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'find_jobs' ? 'bg-white/10 text-white' : 'text-teal-100 hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'messages' ? 'bg-white/10 text-white' : 'text-teal-100 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'wallet' ? 'bg-white/10 text-white' : 'text-teal-100 hover:bg-white/5'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#0a3d37] space-y-2">
          <button
            onClick={() => setShowGigModal(true)}
            className="w-full bg-white hover:bg-slate-100 text-[#0d4f47] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Gig</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT AREA ──────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Tab Content Router */}
        <div className="flex-1 overflow-y-auto">

          {/* ──────────────────────────────────────────────────────────
              1. TAB: DASHBOARD
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
              
              {/* Dashboard Welcome Header */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Freelancer Dashboard</h1>
                <p className="text-xs text-slate-400 mt-0.5">Welcome back! Here is a summary of your workspace stats.</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d4f47] flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Total Earnings</p>
                    <p className="text-xl font-bold text-slate-800 mt-0.5">UGX 1,750,000</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Pending Payments</p>
                    <p className="text-xl font-bold text-slate-800 mt-0.5">UGX 350,000</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Active Jobs</p>
                    <p className="text-xl font-bold text-slate-800 mt-0.5">2 Jobs</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Invitations</p>
                    <p className="text-xl font-bold text-slate-800 mt-0.5">2 Pending</p>
                  </div>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Active Jobs Widget */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Jobs</h3>
                      <button onClick={() => setActiveTab('find_jobs')} className="text-xs font-semibold text-[#0d4f47] hover:underline">Find Work</button>
                    </div>
                    <div className="p-6 divide-y divide-gray-100">
                      <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-850">Fintech Paystack Webhooks Integration</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Client: Sarah Mwangi • Escrow Secured</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">Deliver Work</span>
                      </div>
                      <div className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-850">Corporate Style Guide Revision</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Client: Koffi Mensah • In Progress</p>
                        </div>
                        <span className="text-xs font-medium text-slate-500">2 days left</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Jobs Widget */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recommended For You</h3>
                      <button onClick={() => setActiveTab('find_jobs')} className="text-xs font-semibold text-[#0d4f47] hover:underline">View All Feed</button>
                    </div>
                    <div className="p-6 divide-y divide-gray-100">
                      {shoutouts.slice(0, 3).map((job) => (
                        <div key={job.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{job.category}</span>
                            <h4 className="text-sm font-bold text-slate-850 mt-1">{job.title}</h4>
                            <p className="text-xs text-slate-400">Budget: UGX {job.budget}</p>
                          </div>
                          <button
                            onClick={() => { setSelectedJobId(job.id); setActiveTab('find_jobs'); }}
                            className="text-xs font-bold text-[#0d4f47] border border-gray-200 hover:border-[#0d4f47] px-3.5 py-1.5 rounded-lg transition"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Proposals / Gigs Widget (utilizing bids and gigs contexts) */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="border-b border-gray-150 px-6 py-4">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Active Gigs & Proposals</h3>
                    </div>
                    <div className="p-6 divide-y divide-gray-100">
                      {activeBids.length > 0 ? (
                        activeBids.slice(0, 2).map((bid) => (
                          <div key={bid.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-850">Proposal bid for Shoutout #{bid.shoutoutId}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Offered Amount: UGX {bid.amount} • Timeline: {bid.deliveryTime} days</p>
                            </div>
                            <span className="text-[9px] uppercase font-bold bg-amber-55 text-amber-700 px-2 py-0.5 rounded">
                              {bid.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        ownGigs.slice(0, 2).map((g) => (
                          <div key={g.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-850">{g.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Price: UGX {g.startingPrice} • Category: {g.category}</p>
                            </div>
                            <span className="text-[9px] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                              Active Gig
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Side Sidebar Widgets */}
                <div className="space-y-6">

                  {/* Profile Completion */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Profile Completion</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>Score Status</span>
                        <span className="text-slate-800 font-black">{stats.profileScore}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{width: `${stats.profileScore}%`}} />
                      </div>
                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Skills listed & verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="hover:underline cursor-pointer">Link Github/Behance (+15%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Recent Activity</h3>
                    <div className="space-y-3 font-mono text-[10px] text-slate-400 leading-normal">
                      <div className="flex items-start gap-2">
                        <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>Escrow release processed for "Next.js payment module"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>Bid accepted by Sarah Mwangi</span>
                      </div>
                    </div>
                  </div>

                  {/* Calendar deadlines */}
                  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Calendar</h3>
                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-slate-400 font-bold mb-1">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <div 
                          key={day} 
                          className={`py-1 rounded ${
                            day === today ? 'bg-[#0d4f47] text-white font-bold' : 'hover:bg-slate-50 text-slate-650'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              2. TAB: FIND JOBS
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'find_jobs' && (
            <div className="h-full flex flex-col lg:flex-row overflow-hidden" style={{minHeight: 'calc(100vh - 65px)'}}>
              
              {/* Left filter bar */}
              <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-gray-200/80 p-6 space-y-6 overflow-y-auto">
                <div>
                  <h2 className="text-base font-bold text-slate-850">Filters</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tailor recommended job feeds</p>
                </div>

                {/* Search query */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keywords, skills..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 text-slate-850"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 text-slate-850"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Budget slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min Budget</label>
                    <span className="text-xs font-semibold text-slate-650">UGX {filterBudget || '0'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="50000"
                    value={filterBudget}
                    onChange={(e) => setFilterBudget(Number(e.target.value))}
                    className="w-full accent-[#0d4f47]"
                  />
                </div>

                {/* Remote option */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remote only</label>
                  <input
                    type="checkbox"
                    checked={filterRemote}
                    onChange={(e) => setFilterRemote(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0d4f47] focus:ring-[#0d4f47]/30"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-slate-850">
                    <option>Uganda 🇺🇬</option>
                    <option>Kenya 🇰🇪</option>
                    <option>Nigeria 🇳🇬</option>
                    <option>Ghana 🇬🇭</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Experience</label>
                  <select
                    value={filterExp}
                    onChange={(e) => setFilterExp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-slate-850"
                  >
                    <option value="All">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </aside>

              {/* Middle Feed List */}
              <section className="flex-1 bg-white border-r border-gray-200/80 flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-gray-150 flex items-center justify-between shrink-0">
                  <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Available Jobs ({filteredJobs.length})</h3>
                </div>

                <div className="divide-y divide-gray-100 flex-1">
                  {filteredJobs.map(job => {
                    const isSelected = selectedJobId === job.id;
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`p-6 cursor-pointer hover:bg-slate-50 transition-all ${
                          isSelected ? 'bg-teal-50/40 border-l-4 border-[#0d4f47]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] bg-slate-100 text-slate-655 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{job.category}</span>
                          <span className="text-xs font-bold text-slate-800">UGX {job.budget}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">{job.title}</h4>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {['React', 'Next.js', 'APIs', 'Escrow Vetted'].slice(0, 3).map(skill => (
                            <span key={skill} className="text-[9px] bg-teal-50 text-[#0d4f47] border border-teal-100 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span>Timeline: {job.deliveryTime} days</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-current" /> 4.9 client
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Right Side Job Details Pane */}
              <section className="flex-1 bg-slate-50 p-6 overflow-y-auto space-y-6">
                {selectedJob ? (
                  <>
                    {/* Header info */}
                    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] bg-teal-50 text-[#0d4f47] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{selectedJob.category}</span>
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Save Job"><Bookmark className="w-4 h-4 text-slate-500" /></button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Share Job"><Share2 className="w-4 h-4 text-slate-500" /></button>
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight mb-4">{selectedJob.title}</h2>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-semibold border-y border-gray-100 py-3 mb-4">
                        <div className="flex items-center gap-1 text-slate-500">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span>Budget: <span className="text-slate-800 font-bold">UGX {selectedJob.budget}</span></span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Timeline: <span className="text-slate-800 font-bold">{selectedJob.deliveryTime} days</span></span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Escrow: <span className="text-slate-800 font-bold">Verified</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setApplyBidAmount(selectedJob.budget);
                          setApplyBidDays(selectedJob.deliveryTime);
                          setShowApplyModal(true);
                        }}
                        className="w-full bg-[#0d4f47] hover:bg-[#0a3d37] text-white font-bold py-3 rounded-xl text-sm transition"
                      >
                        Apply for Job
                      </button>
                    </div>

                    {/* Job Details Description & Requirements */}
                    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider mb-2">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedJob.description}</p>
                      </div>
                      <div className="pt-2">
                        <h3 className="text-sm font-bold text-[#0d4f47] mb-2">Skills Required</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {['TypeScript', 'Next.js', 'PostgreSQL', 'API Integration'].map(s => (
                            <span key={s} className="text-xs bg-slate-100 text-slate-650 px-3 py-1.5 rounded-lg border border-gray-200/50">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Client Profile */}
                    <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-[#0d4f47] font-black text-lg">
                        S
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-850">Sarah Mwangi</h4>
                        <p className="text-xs text-slate-400">Uganda • Vetted Buyer since 2023</p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-650">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span>4.9 Client Rating (24 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    <p className="text-sm">Select a job from the feed to view details.</p>
                  </div>
                )}
              </section>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              3. TAB: MESSAGES (SLACK-LIKE VIEW)
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <div className="h-full flex overflow-hidden" style={{minHeight: 'calc(100vh - 65px)'}}>
              
              {/* Slack-like Sidebar */}
              <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-950 flex flex-col select-none shrink-0">
                <div className="p-4 border-b border-slate-950">
                  <input
                    type="text"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder="Search direct messages..."
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 text-white placeholder-slate-500"
                  />
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {/* Mock Channels */}
                  <div>
                    <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Channels</span>
                    <div className="space-y-0.5 text-xs">
                      {['#general', '#development-ug', '#figma-design'].map(chan => (
                        <span key={chan} className="px-4 py-2 hover:bg-slate-800 hover:text-white cursor-pointer block font-semibold text-slate-400">
                          {chan}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Messages */}
                  <div>
                    <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Direct Messages</span>
                    <div className="space-y-0.5 text-xs">
                      {filteredConversations.map(conv => {
                        const participant = allUsers.find(u => u.id === conv.userId) || { name: 'Client', avatar: '' };
                        const isActive = activeChatUserId === conv.userId;
                        return (
                          <div
                            key={conv.userId}
                            onClick={() => setActiveChatUserId(conv.userId)}
                            className={`px-4 py-2 flex items-center justify-between cursor-pointer transition ${
                              isActive ? 'bg-[#0d4f47]/30 text-white font-bold border-l-4 border-[#0d9488]' : 'hover:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="truncate">{participant.name}</span>
                            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0 ml-1.5" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Chat Area */}
              <section className="flex-1 bg-white flex flex-col overflow-hidden">
                {activeChatUserId && activeParticipant ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between shrink-0 bg-slate-50/50">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          {activeParticipant.name}
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                        </h3>
                        <p className="text-[10px] text-slate-400 leading-tight">Vetted Buyer • Response time: under 1h</p>
                      </div>
                    </div>

                    {/* Messages pane */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {activeMessages.map((m, idx) => {
                        const isMe = m.senderId === currentUser.id;
                        return (
                          <div key={idx} className={`flex items-start gap-3 max-w-xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#0d4f47]">
                              {isMe ? 'M' : activeParticipant.name[0]}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${
                              isMe ? 'bg-[#0d4f47] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                              <p className="leading-relaxed">{m.content}</p>
                              <span className={`text-[8.5px] mt-1 block text-right ${isMe ? 'text-teal-200' : 'text-slate-400'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message Input form with simulated OS/Slack buttons */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-150 bg-slate-50/50 shrink-0">
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <textarea
                          value={typedMessage}
                          onChange={(e) => setTypedMessage(e.target.value)}
                          placeholder={`Message ${activeParticipant.name}...`}
                          className="w-full px-4 py-3 text-sm focus:outline-none resize-none text-slate-800"
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        {/* Input bar controls: Attachments, Voice, Emoji, Send */}
                        <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <button type="button" className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-650 transition" title="Attach file"><Paperclip className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-650 transition" title="Add Emoji"><Smile className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-650 transition" title="Record Voice Memo"><Mic className="w-4 h-4" /></button>
                          </div>
                          <button
                            type="submit"
                            className="bg-[#0d4f47] hover:bg-[#0a3d37] text-white p-2 rounded-xl transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-24 text-slate-400">
                    <p className="text-sm">Select a direct message channel to open the conversation.</p>
                  </div>
                )}
              </section>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              4. TAB: WALLET
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'wallet' && (
            <div className="p-6 space-y-8 max-w-5xl mx-auto">
              
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Financial Wallet</h1>
                <p className="text-xs text-slate-400 mt-0.5">Manage payouts, generate invoices, and withdraw your funds.</p>
              </div>

              {/* Wallet metrics card */}
              <div className="bg-[#0d4f47] rounded-2xl p-6 text-white shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1.5 relative z-10">
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Available Balance</span>
                  <h2 className="text-3xl font-black">{walletData.balance}</h2>
                  <p className="text-xs text-teal-200 font-medium">Safe in escrow protector • UGX 350,000 pending release</p>
                </div>
                
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="bg-white hover:bg-slate-100 text-[#0d4f47] font-bold px-6 py-3.5 rounded-xl text-sm transition shrink-0 shadow relative z-10"
                >
                  Withdraw Earnings
                </button>
              </div>

              {/* Invoices and Transactions list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Transaction history list */}
                <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">Recent Transactions</h3>
                  <div className="divide-y divide-gray-100">
                    {walletData.transactions.map((tx) => (
                      <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{tx.job}</h4>
                          <span className="text-[10px] text-slate-450">{tx.date} • {tx.type}</span>
                        </div>
                        <span className={`text-sm font-bold ${tx.amount.startsWith('-') ? 'text-slate-650' : 'text-emerald-600'}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoices list */}
                <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">Client Invoices</h3>
                  <div className="divide-y divide-gray-100">
                    {walletData.invoices.map((inv) => (
                      <div key={inv.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Invoice #{inv.id}</h4>
                          <span className="text-[10px] text-slate-450">{inv.date} • Client: {inv.client}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-800">{inv.amount}</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase">Paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── APPLY / BID SUBMISSION MODAL ──────────────────────────────── */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <PlusCircle className="w-5 h-5 rotate-45 text-slate-500" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Submit Proposal</h3>
            <p className="text-xs text-slate-500 mb-4">Job: {selectedJob.title}</p>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Bid Amount (UGX)</label>
                  <input
                    type="number"
                    required
                    value={applyBidAmount}
                    onChange={(e) => setApplyBidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    required
                    value={applyBidDays}
                    onChange={(e) => setApplyBidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Proposal Letter</label>
                <textarea
                  required
                  rows={4}
                  value={applyProposal}
                  onChange={(e) => setApplyProposal(e.target.value)}
                  placeholder="Introduce yourself, outline your experience, and describe how you plan to complete this job..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white text-sm font-bold rounded-xl transition shadow-lg"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── WITHDRAW FUNDS MODAL ────────────────────────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <PlusCircle className="w-5 h-5 rotate-45 text-slate-500" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Withdraw Funds</h3>
            <p className="text-xs text-slate-500 mb-4">Send available earnings directly to your mobile money or bank.</p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Withdrawal Amount (UGX)</label>
                <input
                  type="number"
                  min="5000"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Payout Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none text-slate-850"
                >
                  <option value="mtn">MTN Mobile Money 📱</option>
                  <option value="airtel">Airtel Money 📲</option>
                  <option value="bank">Bank Transfer 🏦</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawSuccess}
                  className="flex-1 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white text-sm font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  {withdrawSuccess ? 'Processing...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Gig Modal Form Drawer ────────────────────────────── */}
      {showGigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowGigModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <PlusCircle className="w-5 h-5 rotate-45 text-slate-500" />
            </button>
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={gigCat}
                  onChange={(e) => setGigCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4f47] text-slate-855"
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
                  className="flex-1 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white text-sm font-bold rounded-xl transition shadow-lg"
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
