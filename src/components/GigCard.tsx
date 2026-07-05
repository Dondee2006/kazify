import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Gig } from '../context/MarketplaceContext';

interface GigCardProps {
  gig: Gig;
}

// Map categories to distinct colours
const categoryColors: Record<string, string> = {
  'Graphics & Design':      'bg-purple-600',
  'Programming & IT':       'bg-blue-600',
  'Writing & Translation':  'bg-orange-500',
  'Video & Animation':      'bg-rose-600',
};

export const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const { allUsers } = useAuth();
  const freelancer = allUsers.find(u => u.id === gig.freelancerId);
  const badgeColor = categoryColors[gig.category] || 'bg-teal-600';

  return (
    <Link
      to={`/gig/${gig.id}`}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Image with category badge overlay */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge - top left overlay */}
        <span className={`absolute top-3 left-3 ${badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-10 shadow`}>
          {gig.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 line-clamp-2 leading-snug mb-3 transition-colors">
          {gig.title}
        </h4>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
          {/* Freelancer avatar + name */}
          {freelancer ? (
            <>
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{freelancer.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{gig.category}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 flex-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="text-xs">Unknown Provider</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-semibold ml-auto flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span className="text-slate-700">{gig.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

