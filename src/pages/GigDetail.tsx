import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { Star, ShieldCheck, Clock, RefreshCw, Check, ArrowLeft, MessageSquare } from 'lucide-react';

export const GigDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, getReviewsForGig } = useMarketplace();
  const { currentUser, switchUser, allUsers } = useAuth();
  const { createOrder } = useOrder();

  const [activeTab, setActiveTab] = useState<'basic' | 'standard' | 'premium'>('standard');

  const gig = gigs.find(g => g.id === id);
  const freelancer = allUsers.find(u => u.id === gig?.freelancerId);

  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    if (gig) {
      getReviewsForGig(gig.id).then(setReviews);
    }
  }, [gig, getReviewsForGig]);

  if (!gig) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gig Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The service listing you are looking for does not exist.</p>
          <Link to="/" className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Define package multipliers/options
  const packages = {
    basic: {
      name: 'Essential Launch',
      price: gig.startingPrice,
      delivery: gig.deliveryTime,
      desc: 'Perfect for starters and minor tasks. Covers all basic features with full delivery output files.',
      features: ['Core configuration and setup', '1 Revision cycle', 'Source files included']
    },
    standard: {
      name: 'Professional Tier',
      price: Math.floor(gig.startingPrice * 1.8),
      delivery: Math.max(1, gig.deliveryTime - 1),
      desc: 'Highly recommended for startups and growing businesses. Contains complete premium features.',
      features: ['Complete solution deployment', '3 Revision cycles', 'Source files + documentation', 'SEO auditing']
    },
    premium: {
      name: 'Enterprise Grade',
      price: Math.floor(gig.startingPrice * 3.2),
      delivery: Math.max(1, gig.deliveryTime - 2),
      desc: 'Custom dedicated architecture, maximum speed delivery, and 30-day post-launch support.',
      features: ['Advanced custom modules', 'Unlimited revision cycles', 'High priority response', '1 Month support', 'Marketing graphics']
    }
  };

  const selectedPkg = packages[activeTab];

  const handleOrderSecurely = async () => {
    if (!currentUser) {
      // Prompt user to register/login
      navigate('/join');
      return;
    }

    if (currentUser.role !== 'client') {
      // Helpfully auto-switch to a client or show prompt
      const clientUser = allUsers.find(u => u.role === 'client');
      if (clientUser) {
        switchUser(clientUser.id);
        const order = await createOrder(gig.id, clientUser.id, gig.freelancerId, selectedPkg.price);
        if (order) {
          navigate(`/order/${order.id}`);
        }
      } else {
        alert("Please register a client profile first to place orders.");
      }
      return;
    }

    // Create the order
    const order = await createOrder(gig.id, currentUser.id, gig.freelancerId, selectedPkg.price);
    if (order) {
      // Redirect to escrow simulation panel
      navigate(`/order/${order.id}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Layout split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Category & Title */}
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  {gig.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight leading-tight">
                  {gig.title}
                </h1>
              </div>

              {/* Freelancer Header */}
              {freelancer && (
                <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 bg-slate-50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-800">{freelancer.name}</span>
                      <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        Vetted Pro
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{freelancer.country}</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{gig.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({gig.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => alert('Message feature coming soon! You will be able to direct message the freelancer here.')}
                      className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-xl transition"
                    >
                      Contact {freelancer.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              )}

              {/* Cover Image */}
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">About This Service</h3>
                <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line">
                  {gig.description}
                </p>
                <p className="text-sm text-slate-650 leading-relaxed">
                  We guarantee high communication efficiency, fast responses, and a fully professional approach to work milestones. By utilizing our integrated Escrow architecture, you can rest assured that your project funds are completely protected until you review the final delivery output.
                </p>
              </div>

              {/* Skills tags */}
              {freelancer?.skills && (
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills / Tools Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Work Feedback</h3>
              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map((review, idx) => (
                  <div key={review.id} className={`space-y-2 ${idx > 0 ? 'pt-4 border-t border-slate-100' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {review.client?.avatar ? (
                          <img src={review.client.avatar} alt={review.client.name} className="w-8 h-8 rounded-full border bg-slate-50 object-cover" />
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                            {review.client?.name?.substring(0,2).toUpperCase() || 'U'}
                          </span>
                        )}
                        <div>
                          <p className="text-xs font-bold">{review.client?.name || 'Client'}</p>
                          <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${review.rating > i ? 'fill-current' : 'text-slate-200'}`} />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      "{review.comment}"
                    </p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">No reviews yet for this service.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing package box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
              
              {/* Package Selector Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-100 text-center font-bold text-xs bg-slate-50">
                {(['basic', 'standard', 'premium'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 capitalize transition-all border-b-2 ${
                      activeTab === tab
                        ? 'bg-white border-primary-500 text-primary-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Package Body */}
              <div className="p-6 space-y-6 text-left">
                <div className="flex items-baseline justify-between">
                  <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                    {selectedPkg.name}
                  </h4>
                  <span className="text-2xl font-black text-slate-900 font-display">
                    UGX {selectedPkg.price}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedPkg.desc}
                </p>

                {/* Package Meta Info */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 py-3 border-y border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{selectedPkg.delivery} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Revisions Sync</span>
                  </div>
                </div>

                {/* Inclusions list */}
                <ul className="space-y-2.5 text-xs text-slate-650">
                  {selectedPkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-primary-500 stroke-[3] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Action */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleOrderSecurely}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-primary-500/20 text-center flex items-center justify-center gap-2 group"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 group-hover:scale-105 transition" />
                    <span>Secure Payment & Order</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 leading-tight">
                    🔒 Funds will be held securely in escrow. Released only upon your approval.
                  </p>

                  {currentUser && currentUser.id !== gig.freelancerId && (
                    <Link
                      to={`/inbox?to=${gig.freelancerId}`}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition text-center flex items-center justify-center gap-2 text-xs"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>Contact Seller</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Persona Context Notice helper if freelancer */}
              {currentUser?.role === 'freelancer' && (
                <div className="bg-amber-50 border-t border-amber-100 p-4 text-xs text-amber-800 text-left">
                  <p className="font-bold flex items-center gap-1 mb-0.5">
                    <span>💡</span> Tester Note
                  </p>
                  <span>
                    You are logged in as a **Freelancer**. Clicking "Secure Payment" will automatically switch your identity to a **Client** (Sarah Mwangi) to simulate the purchase order flow.
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
