import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Gig } from '../context/MarketplaceContext';

interface GigCardProps {
  gig: Gig;
}

export const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const { allUsers } = useAuth();
  // Find the freelancer profile associated with the gig
  const freelancer = allUsers.find(u => u.id === gig.freelancerId);

  return (
    <Link to={`/gig/${gig.id}`} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1 block">
      {/* Gig Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        {gig.badges && gig.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {gig.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Freelancer Profile Header */}
          <div className="flex items-center gap-2 mb-3">
            {freelancer ? (
              <>
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-100"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {freelancer.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium leading-none">
                    {freelancer.country}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-xs">Unknown Provider</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 line-clamp-2 leading-snug mb-2 transition-colors">
            {gig.title}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{gig.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 font-normal">({gig.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Footer Pricing */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Starting Price
          </span>
          <span className="text-base font-extrabold text-slate-800 font-display">
            UGX {gig.startingPrice}
          </span>
        </div>
      </div>
    </Link>
  );
};
