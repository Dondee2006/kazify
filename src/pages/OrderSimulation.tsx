import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck, HelpCircle, CheckCircle, User as UserIcon, Send, RefreshCcw, DollarSign, Clock, FileText, MessageSquare, Star } from 'lucide-react';

export const OrderSimulation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, submitDelivery, approveDelivery } = useOrder();
  const { currentUser, switchUser, allUsers } = useAuth();
  const { gigs, shoutouts } = useMarketplace();

  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFile, setDeliveryFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const { submitReview } = useMarketplace();

  const order = getOrderById(id || '');
  if (!order) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The order sequence does not exist or has expired.</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const gig = gigs.find(g => g.id === order.gigId);
  const shoutout = shoutouts.find(s => s.id === order.shoutoutId);
  const orderTitle = gig?.title || shoutout?.title || 'Custom Milestone Service';
  const clientUser = allUsers.find(u => u.id === order.clientId);
  const freelancerUser = allUsers.find(u => u.id === order.freelancerId);

  // Helper check: who is the current user viewing this?
  const isClient = currentUser?.id === order.clientId;
  const isFreelancer = currentUser?.id === order.freelancerId;

  // Determine current active stepper index
  let stepIndex = 1; // 1: Escrow Held, 2: Delivered/Pending Approval, 3: Released
  if (order.status === 'escrow_held') {
    stepIndex = 1;
  } else if (order.status === 'pending_approval') {
    stepIndex = 2;
  } else if (order.status === 'released') {
    stepIndex = 3;
  }

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryNote.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitDelivery(order.id, deliveryNote, deliveryFile);
      setIsSubmitting(false);
      setDeliveryNote('');
      setDeliveryFile('');
    }, 1000);
  };

  const handleApproveAndRelease = () => {
    approveDelivery(order.id);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order.gigId) return; // Reviews only for gigs currently
    await submitReview(order.id, order.gigId, order.clientId, order.freelancerId, reviewRating, reviewComment);
    setReviewSubmitted(true);
  };

  return (
    <div className="flex-1 bg-slate-50 py-10 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Summary */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,163,74,0.06)_0%,transparent_35%)]" />
          <div className="space-y-1 z-10">
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Transaction Simulation ID: {order.id}</span>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white mt-1">
              Escrow Order Status Overview
            </h1>
            <p className="text-xs text-slate-400">
              Service: <span className="font-semibold text-slate-200">{orderTitle}</span>
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3 z-10 shrink-0">
            <DollarSign className="w-8 h-8 text-primary-400 bg-slate-900/50 p-1.5 rounded-lg border border-slate-750" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Secured Budget</p>
              <p className="text-lg font-extrabold text-white mt-0.5">UGX {order.amount}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Swapper Panel for Simulation Testers */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <RefreshCcw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">Sandbox Simulator Tools</h3>
              <p className="text-xs text-amber-750 leading-relaxed">
                Escrow requires interaction from both roles. Use the quick-swappers below to test each party's perspective:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => switchUser(order.clientId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                isClient
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Simulate Client ({clientUser?.name.split(' ')[0]})</span>
            </button>
            <button
              onClick={() => switchUser(order.freelancerId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                isFreelancer
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                  : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Simulate Freelancer ({freelancerUser?.name.split(' ')[0]})</span>
            </button>
          </div>
        </div>

        {/* Escrow Progress Stepper */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-6">Escrow Milestones</h3>
          
          <div className="relative">
            {/* Connecting lines */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-100 z-0 hidden sm:block" />
            <div
              className="absolute top-5 left-6 h-0.5 bg-primary-500 z-0 transition-all duration-550 hidden sm:block"
              style={{ width: stepIndex === 1 ? '0%' : stepIndex === 2 ? '50%' : '100%' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              {/* Step 1: Deposit */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow ${
                  stepIndex >= 1
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {stepIndex > 1 ? '✓' : '1'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">1. Client Escrow Deposit</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Funds Held securely</p>
                </div>
              </div>

              {/* Step 2: Work Submission */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow ${
                  stepIndex >= 2
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : stepIndex === 1
                    ? 'bg-slate-200 text-slate-700 ring-4 ring-slate-100'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {stepIndex > 2 ? '✓' : '2'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">2. Work Delivery</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Freelancer submits files</p>
                </div>
              </div>

              {/* Step 3: Payout Release */}
              <div className="flex sm:flex-col items-center sm:text-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow ${
                  stepIndex >= 3
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {stepIndex > 3 ? '✓' : '3'}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">3. Release & Pay</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Client approves output</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Role Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Action Console (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm text-left">
              
              {/* If Client Mode */}
              {isClient && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="p-1 rounded-full bg-blue-100 text-blue-800">💼</span>
                    <h3 className="text-lg font-bold text-slate-900">Client Control Panel</h3>
                  </div>

                  {order.status === 'escrow_held' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 text-sm leading-relaxed">
                        <p className="font-bold flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-4 h-4 text-blue-600" /> Funds Secured in Escrow
                        </p>
                        <span>
                          Your payment of **UGX {order.amount}** has been securely deposited. The freelancer ({freelancerUser?.name}) is safe to begin working. The funds will remain in escrow until you review and approve their work output.
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 italic">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting delivery from the freelancer...</span>
                      </div>
                    </div>
                  )}

                  {order.status === 'pending_approval' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-900 text-sm leading-relaxed">
                        <p className="font-bold flex items-center gap-1.5 mb-1">
                          🔔 Review Submission Request
                        </p>
                        <span>
                          The freelancer has marked this order as delivered. Review the delivery file and notes below. Click approve to clear escrow and release payment.
                        </span>
                      </div>

                      {/* Delivery Details Block */}
                      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                        <p className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Freelancer Delivery Note
                        </p>
                        <p className="text-sm text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                          "{order.deliveryNote}"
                        </p>
                        {order.deliveryFileUrl && (
                          <div className="pt-2">
                            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Delivered Preview</p>
                            <img
                              src={order.deliveryFileUrl}
                              alt="Delivery Output Preview"
                              className="max-w-xs rounded-lg border border-slate-200/60 shadow-sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* Release action trigger */}
                      <button
                        onClick={handleApproveAndRelease}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-primary-500/20 text-center flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                        <span>Approve Work & Release Payment</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'released' && (
                    <div className="space-y-4">
                      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm leading-relaxed">
                        <p className="font-bold text-base flex items-center gap-1.5 mb-1 text-emerald-950">
                          <CheckCircle className="w-5 h-5 text-emerald-500" /> Payout Released Successfully
                        </p>
                        <span>
                          The funds of **UGX {order.amount}** have been cleared from escrow and released to the freelancer. This order sequence is completed.
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                        <p className="text-xs font-bold text-slate-400">Order Delivery Record</p>
                        <p className="text-xs text-slate-600 italic">
                          " {order.deliveryNote} "
                        </p>
                      </div>

                      {order.gigId && !reviewSubmitted ? (
                        <form onSubmit={handleReviewSubmit} className="mt-6 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                          <h4 className="text-sm font-bold text-slate-900">Leave a Review for {freelancerUser?.name}</h4>
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Rating</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className={`p-2 rounded-lg transition ${reviewRating >= star ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >
                                  <Star className={`w-6 h-6 ${reviewRating >= star ? 'fill-current' : ''}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Comment</label>
                            <textarea
                              required
                              rows={3}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="How was your experience working with this freelancer?"
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition"
                          >
                            Submit Review
                          </button>
                        </form>
                      ) : reviewSubmitted ? (
                        <div className="mt-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-2xl text-center text-sm font-semibold">
                          Review submitted successfully! Thank you.
                        </div>
                      ) : null}

                      <Link
                        to="/"
                        className="inline-block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-sm rounded-xl transition mt-4"
                      >
                        Return to Marketplace
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* If Freelancer Mode */}
              {isFreelancer && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <span className="p-1 rounded-full bg-primary-100 text-primary-800">🛠️</span>
                    <h3 className="text-lg font-bold text-slate-900">Freelancer Workspace</h3>
                  </div>

                  {order.status === 'escrow_held' && (
                    <form onSubmit={handleDeliverySubmit} className="space-y-5">
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs sm:text-sm leading-relaxed">
                        <p className="font-bold flex items-center gap-1 mb-1 text-emerald-950">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Funds Active
                        </p>
                        <span>
                          Client has deposited **UGX {order.amount}** in secure escrow. You are fully protected to begin development and branding milestones. Submit work once completed.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Delivery Message / Notes</label>
                        <textarea
                          required
                          rows={4}
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          placeholder="Tell the client about what you have delivered. Include links to code repo, files or attachment summaries..."
                          className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Visual Attachment URL (Optional)</label>
                        <input
                          type="url"
                          value={deliveryFile}
                          onChange={(e) => setDeliveryFile(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/your-design.png"
                          className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Submitting Work...' : 'Deliver Project & Request Release'}</span>
                      </button>
                    </form>
                  )}

                  {order.status === 'pending_approval' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-900 text-sm leading-relaxed">
                        <p className="font-bold flex items-center gap-1 mb-1">
                          ⏳ Waiting for Client Approval
                        </p>
                        <span>
                          Your work delivery has been submitted. The client is reviewing your notes and files. We will notify you as soon as funds are cleared.
                        </span>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-xl space-y-2 text-xs">
                        <p className="font-bold text-slate-400">Your Submitted Note:</p>
                        <p className="text-slate-650 italic bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                          "{order.deliveryNote}"
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'released' && (
                    <div className="space-y-4">
                      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-sm leading-relaxed">
                        <p className="font-bold text-base flex items-center gap-1.5 mb-1 text-emerald-950">
                          🎉 Payment Released!
                        </p>
                        <span>
                          Great job! The client reviewed your deliverables and approved the release. The sum of **UGX {order.amount}** has been added to your Kazify earnings wallet.
                        </span>
                      </div>

                      <Link
                        to="/"
                        className="inline-block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center font-bold text-sm rounded-xl transition"
                      >
                        Find More Gigs
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Sandbox notice if persona doesn't match */}
              {!isClient && !isFreelancer && (
                <div className="text-center py-6">
                  <HelpCircle className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">You are in Observer Mode</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    To act on this escrow milestone, you must swap your persona. Use the switcher widget above or the quick buttons.
                  </p>
                  
                  <div className="flex gap-2 justify-center mt-4">
                    <button
                      onClick={() => switchUser(order.clientId)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition"
                    >
                      Swap to Client
                    </button>
                    <button
                      onClick={() => switchUser(order.freelancerId)}
                      className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-[10px] font-bold rounded-lg transition"
                    >
                      Swap to Freelancer
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Escrow Informational sidebar (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Parties Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Participants</h4>
              
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <img src={clientUser?.avatar} alt={clientUser?.name} className="w-8 h-8 rounded-full border bg-slate-50 object-cover" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-none">{clientUser?.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Buyer Client • {clientUser?.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src={freelancerUser?.avatar} alt={freelancerUser?.name} className="w-8 h-8 rounded-full border bg-slate-50 object-cover" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-none">{freelancerUser?.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Freelancer Specialist • {freelancerUser?.country}</p>
                  </div>
                </div>

                {currentUser && (isClient || isFreelancer) && (
                  <div className="pt-2 border-t border-slate-100/60">
                    <Link
                      to={`/inbox?to=${isClient ? order.freelancerId : order.clientId}`}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 text-xs"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>Message {isClient ? 'Freelancer' : 'Client'}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Explainer Card */}
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-400">How Escrow Safeguards Work</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Kazify's Escrow secures client funds before the project starts. This reassures freelancers that their effort is paid, and reassures clients that no money is released until they approve the output.
              </p>
              
              <div className="space-y-2 pt-1.5 text-[11px] text-slate-350">
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✔</span>
                  <span>100% Secure deposits</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✔</span>
                  <span>Interactive file review board</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">✔</span>
                  <span>Dispute resolution protocol</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
