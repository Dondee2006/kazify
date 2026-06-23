import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JobRequest, useMarketplace } from '../context/MarketplaceContext';
import { Calendar, DollarSign, Tag, Send, CheckCircle2, MessageSquare, AlertCircle, XCircle } from 'lucide-react';

interface ShoutoutCardProps {
  shoutout: JobRequest;
}

export const ShoutoutCard: React.FC<ShoutoutCardProps> = ({ shoutout }) => {
  const { currentUser, allUsers } = useAuth();
  const { bids, placeBid } = useMarketplace();
  const client = allUsers.find(u => u.id === shoutout.clientId);
  
  const [bidAmount, setBidAmount] = useState(shoutout.budget);
  const [bidDuration, setBidDuration] = useState(shoutout.deliveryTime);
  const [proposal, setProposal] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  const myBid = bids.find(b => b.shoutoutId === shoutout.id && b.freelancerId === currentUser?.id);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsBidding(true);
    await placeBid(shoutout.id, currentUser.id, bidAmount, bidDuration, proposal);
    setProposal('');
    setIsBidding(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          {/* Header client profile */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={client?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${shoutout.clientId}`}
              alt={client?.name}
              className="w-10 h-10 rounded-full border border-slate-100 object-cover bg-slate-50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-slate-800 truncate">{client?.name || 'Unknown Client'}</h5>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{client?.country || 'Global'}</span>
                <span>•</span>
                <span>{timeAgo(shoutout.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Category Tag & Chat link */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{shoutout.category}</span>
            </div>
            {currentUser && currentUser.id !== shoutout.clientId && (
              <Link
                to={`/inbox?to=${shoutout.clientId}`}
                className="text-[10px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-0.5 hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Client</span>
              </Link>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-slate-800 mb-2 leading-snug">
          {shoutout.title}
        </h4>
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
          {shoutout.description}
        </p>

        {/* Meta Stats: Budget & Delivery */}
        <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-slate-50 rounded-xl mb-4 text-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Budget</p>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">UGX {shoutout.budget}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Timeline</p>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">{shoutout.deliveryTime} Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Freelancer Bid Section */}
      <div className="pt-3 border-t border-slate-100">
        {currentUser?.role === 'freelancer' ? (
          <div>
            {myBid ? (
              <div>
                {myBid.status === 'accepted' ? (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Bid Accepted! Offered UGX {myBid.amount} ({myBid.deliveryTime} days). Order created!</span>
                  </div>
                ) : myBid.status === 'rejected' ? (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>Bid not selected. Offered UGX {myBid.amount} ({myBid.deliveryTime} days).</span>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                    <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>Bid Submitted! Offered UGX {myBid.amount} in {myBid.deliveryTime} days. (Pending review)</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Place a Bid</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-[10px] font-bold">UGX</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min="1000"
                      step="1000"
                      className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Offer"
                      required
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={bidDuration}
                      onChange={(e) => setBidDuration(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Days"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Short proposal (e.g. I can help with this...)"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isBidding}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isBidding ? 'Sending...' : 'Bid'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : currentUser?.id === shoutout.clientId ? (
          <div className="text-center bg-slate-50 py-2.5 rounded-xl">
            <span className="text-xs text-slate-400 font-semibold italic">
              This is your job request. Bids will display on your dashboard.
            </span>
          </div>
        ) : (
          <div className="text-center bg-slate-50 py-2.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">
              Switch role to <span className="font-semibold text-primary-500">Freelancer</span> to place bids.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
