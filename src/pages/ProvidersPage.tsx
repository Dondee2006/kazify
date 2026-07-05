import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Star, MapPin, Briefcase, Search, CheckCircle, ChevronRight } from 'lucide-react';

const skillColors = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-teal-50 text-teal-700 border-teal-100',
  'bg-orange-50 text-orange-700 border-orange-100',
  'bg-rose-50 text-rose-700 border-rose-100',
  'bg-green-50 text-green-700 border-green-100',
];

export const ProvidersPage: React.FC = () => {
  const { allUsers } = useAuth();
  const { gigs } = useMarketplace();
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Only show freelancers
  const freelancers = allUsers.filter(u => u.role === 'freelancer');

  // Collect all unique skills across freelancers for filter pills
  const allSkills = Array.from(
    new Set(freelancers.flatMap(f => (f as any).skills || []))
  ) as string[];

  // Filter by search and skill
  const filtered = freelancers.filter(f => {
    const skills: string[] = (f as any).skills || [];
    const bio: string = (f as any).bio || '';
    const matchesSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.country.toLowerCase().includes(search.toLowerCase()) ||
      bio.toLowerCase().includes(search.toLowerCase()) ||
      skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSkill = !selectedSkill || skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div className="bg-[#0d4f47] px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Browse Providers</h1>
          <p className="text-white/70 text-sm mb-6">Discover skilled professionals ready to work with you</p>

          {/* Search */}
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md max-w-3xl">
            <div className="pl-4 text-slate-400 flex-shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, or country..."
              className="flex-1 px-4 py-3.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 text-slate-400 hover:text-slate-700 text-sm transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── SKILL FILTER BAR ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedSkill(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              !selectedSkill
                ? 'bg-[#0d4f47] text-white border-transparent'
                : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Skills
          </button>
          {allSkills.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                selectedSkill === skill
                  ? 'bg-[#0d4f47] text-white border-transparent'
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {skill}
            </button>
          ))}
          <span className="ml-auto flex-shrink-0 text-sm text-slate-500 font-medium pl-4">
            {filtered.length} provider{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── PROVIDERS GRID ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(freelancer => {
              const skills: string[] = (freelancer as any).skills || [];
              const bio: string = (freelancer as any).bio || '';
              const rating: number = (freelancer as any).rating || 0;
              const joinedDate: string = (freelancer as any).joinedDate || '';
              // Count how many gigs this freelancer has
              const gigCount = gigs.filter(g => g.freelancerId === freelancer.id).length;

              return (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Top: Avatar + Name + Location */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={freelancer.avatar}
                          alt={freelancer.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        {/* Online dot */}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-base font-bold text-slate-900 truncate">{freelancer.name}</h3>
                          <CheckCircle className="w-4 h-4 text-[#0d4f47] flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{freelancer.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)}</span>
                          <span className="text-xs text-slate-400">• Joined {joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {bio}
                    </p>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={skill}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${skillColors[idx % skillColors.length]}`}
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 5 && (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-gray-50 text-gray-500 border-gray-100">
                            +{skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mx-6" />

                  {/* Card Footer: Stats + CTA */}
                  <div className="px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-700">{gigCount}</span>
                        <span>service{gigCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => {}}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0d4f47] hover:underline transition group-hover:gap-2"
                    >
                      View Services
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-9 h-9 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No providers found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search or clearing the skill filter.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedSkill(null); }}
              className="px-6 py-2.5 bg-[#0d4f47] hover:bg-[#0a3d37] text-white font-semibold rounded-lg text-sm transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
