import React, { useState, useEffect, useCallback } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { GigCard } from '../components/GigCard';
import { ShoutoutCard } from '../components/ShoutoutCard';
import { Search, PlusCircle, Zap, ShieldCheck, Flame, ArrowUpRight, ChevronLeft, ChevronRight, Star, MapPin, CheckCircle, Sparkles, Target, Trophy, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Slideshow data: one entry per slide ──────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    name: 'David Osei',
    country: 'Ghana 🇬🇭',
    role: 'Business Consultant',
    specialty: 'Strategy · Team Leadership · Project Management',
    rating: 4.9,
    avatar: '/hero1.jpg',
    bg: '/hero1.jpg',
    gradient: 'from-emerald-950/90 via-emerald-950/70 to-emerald-950/30',
    accent: 'bg-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  {
    id: 2,
    name: 'Kwame Asante',
    country: 'Nigeria 🇳🇬',
    role: 'Full-Stack Developer',
    specialty: 'React · Node.js · Cloud Architecture',
    rating: 4.8,
    avatar: '/hero2.jpg',
    bg: '/hero2.jpg',
    gradient: 'from-emerald-950/90 via-green-950/65 to-emerald-950/25',
    accent: 'bg-green-400',
    badge: 'bg-green-500/20 text-green-300 border-green-400/30',
    dot: 'bg-green-400',
  },
  {
    id: 3,
    name: 'Academy Team',
    country: 'Kenya 🇰🇪',
    role: 'Kazify Academy',
    specialty: 'Skills · Challenges · Badges · Real Gigs',
    rating: 5.0,
    avatar: '/hero3.jpg',
    bg: '/hero3.jpg',
    gradient: 'from-purple-950/90 via-purple-950/65 to-indigo-950/25',
    accent: 'bg-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    dot: 'bg-purple-400',
  },
  {
    id: 4,
    name: 'Fatima Al-Rashid',
    country: 'Tanzania 🇹🇿',
    role: 'Rising Student Talent',
    specialty: 'Design · Copywriting · Social Media',
    rating: 4.7,
    avatar: '/hero4.jpg',
    bg: '/hero4.jpg',
    gradient: 'from-emerald-950/90 via-teal-950/65 to-emerald-950/25',
    accent: 'bg-teal-400',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    dot: 'bg-teal-400',
  },
];

export const LandingHome: React.FC = () => {
  const { filteredGigs, shoutouts, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, addShoutout } = useMarketplace();
  const { currentUser } = useAuth();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused]           = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [shoutoutTitle, setShoutoutTitle] = useState('');
  const [shoutoutDesc, setShoutoutDesc]   = useState('');
  const [shoutoutBudget, setShoutoutBudget] = useState(100);
  const [shoutoutTime, setShoutoutTime]   = useState(3);
  const [shoutoutCat, setShoutoutCat]     = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');

  const popularTags = ['Logo Design', 'Next.js', 'Swahili Localization', 'Video Explainer'];

  const nextSlide = useCallback(() =>
    setCurrentSlide(s => (s + 1) % SLIDES.length), []);
  const prevSlide = useCallback(() =>
    setCurrentSlide(s => (s - 1 + SLIDES.length) % SLIDES.length), []);
  const goToSlide = useCallback((i: number) => setCurrentSlide(i), []);

  // Auto-advance every 5 s, pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [isPaused, nextSlide]);

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

  const handlePopularTagClick = (tag: string) => {
    setSearchQuery(tag);
  };


  return (
    <div className="flex-1 bg-slate-50">
      {/* ── HERO SLIDESHOW ───────────────────────────────────────────────── */}
      <section
        className="relative h-[88vh] min-h-[560px] max-h-[860px] overflow-hidden text-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide background images — cross-fade via opacity transition */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img
              src={s.bg}
              alt={s.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* Per-slide directional gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
            {/* Bottom fade to blend into content below */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-950 to-transparent" />
          </div>
        ))}

        {/* ── Headline + CTA (always visible, left-anchored) ── */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Empowering African Professional Talent
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black font-display tracking-tight leading-[1.08] text-white drop-shadow-lg">
              Find the right freelance<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-400">
                service, instantly.
              </span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
              Kazify connects global businesses with vetted African talent. Work securely with escrow protection, fast milestone reviews, and zero risk.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/join"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full transition shadow-lg shadow-primary-500/30 flex items-center gap-2 group text-sm"
              >
                <span>Hire Top Talent</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>
              <Link
                to="/join"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 font-semibold px-6 py-3 rounded-full transition text-sm"
              >
                Start Working
              </Link>
            </div>

            {/* Popular search tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-white/50 font-semibold">Popular:</span>
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handlePopularTagClick(tag)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white/80 hover:text-white rounded-full transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Freelancer Placecard (bottom-right) ── */}
        <div className="absolute bottom-10 right-6 sm:right-12 z-20">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="transition-all duration-700 ease-in-out"
              style={{
                opacity: i === currentSlide ? 1 : 0,
                transform: i === currentSlide ? 'translateY(0)' : 'translateY(16px)',
                position: i === currentSlide ? 'relative' : 'absolute',
                pointerEvents: i === currentSlide ? 'auto' : 'none',
              }}
            >
              <div className="glass-dark border border-white/10 rounded-2xl p-4 w-64 shadow-2xl">
                {/* Top row: avatar + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative shrink-0">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    {/* Accent dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${s.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-white leading-tight truncate">{s.name}</p>
                    <p className="text-[11px] text-white/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {s.country}
                    </p>
                  </div>
                </div>

                {/* Role badge */}
                <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.badge} mb-2`}>
                  {s.role}
                </span>

                {/* Specialty */}
                <p className="text-[10px] text-white/50 leading-snug mb-3">{s.specialty}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, ri) => (
                      <Star
                        key={ri}
                        className={`w-3 h-3 ${
                          ri < Math.floor(s.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-white">{s.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-white/40 font-medium">/ 5.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Prev / Next arrows ── */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white backdrop-blur-sm transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white backdrop-blur-sm transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Navigation dots ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? `w-6 h-2.5 ${s.dot}`
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Escrow trust badge (bottom-left) */}
        <div className="absolute bottom-10 left-6 sm:left-12 z-20 hidden sm:flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
          <ShieldCheck className="w-4 h-4 text-primary-400" />
          <span className="text-xs font-semibold text-white/80">100% Escrow Protected Payments</span>
        </div>
      </section>

      {/* Trusted By Banner */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by leading enterprises across Africa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 transition-all duration-500">
            {/* Absa */}
            <img src="/absa.png" alt="Absa Bank" className="h-10 object-contain" />
            
            {/* Junior Achievement Uganda */}
            <img
              src="/ja_uganda_logo.png"
              alt="Junior Achievement Uganda"
              className="h-12 w-auto max-w-[180px] object-contain"
            />

            {/* MTN */}
            <img src="/mtn.png" alt="MTN" className="h-12 object-contain" />
            
            {/* Airtel */}
            <img src="/airtel.png" alt="Airtel" className="h-10 object-contain" />
          </div>
        </div>
      </div>

      {/* ── BENEFITS SECTION (Why Choose Kazify) ── */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 leading-tight">
                A whole world of African freelance talent at your fingertips
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">The best for every budget</h4>
                    <p className="text-slate-600 text-sm">Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Quality work done quickly</h4>
                    <p className="text-slate-600 text-sm">Find the right freelancer to begin working on your project within minutes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Protected payments, every time</h4>
                    <p className="text-slate-600 text-sm">Always know what you'll pay upfront. Your payment isn't released until you approve the work.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">24/7 support</h4>
                    <p className="text-slate-600 text-sm">Questions? Our round-the-clock support team is available to help anytime, anywhere.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Embedded illustration or placeholder representing the community */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square lg:aspect-[4/5] bg-emerald-900">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000" alt="Professional meeting" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                  <p className="text-white text-lg font-semibold italic">
                    "Kazify completely transformed how we source talent for our campaigns. The quality and speed are unmatched."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400" alt="Client" />
                    <div>
                      <p className="text-sm font-bold text-white">Aisha Kamau</p>
                      <p className="text-xs text-emerald-200">Marketing Director, Safaricom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 mb-12">
            Explore the Marketplace
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Programming */}
            <button
              onClick={() => setSelectedCategory('Programming')}
              className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
                alt="Programming"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-white font-extrabold text-base mb-0.5">Programming</h3>
                <p className="text-emerald-300 text-xs font-semibold">Software & Tech</p>
              </div>
            </button>

            {/* Design */}
            <button
              onClick={() => setSelectedCategory('Design')}
              className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
                alt="Design"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/85 via-purple-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-white font-extrabold text-base mb-0.5">Design</h3>
                <p className="text-purple-300 text-xs font-semibold">Graphics & UI/UX</p>
              </div>
            </button>

            {/* Marketing */}
            <button
              onClick={() => setSelectedCategory('Marketing')}
              className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800"
                alt="Marketing"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/85 via-amber-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-white font-extrabold text-base mb-0.5">Marketing</h3>
                <p className="text-amber-300 text-xs font-semibold">Digital & Social</p>
              </div>
            </button>

            {/* Video */}
            <button
              onClick={() => setSelectedCategory('Video')}
              className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"
                alt="Video & Audio"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/85 via-blue-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="text-white font-extrabold text-base mb-0.5">Video & Audio</h3>
                <p className="text-blue-300 text-xs font-semibold">Animation & Editing</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Marketplace Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
              {selectedCategory ? `${selectedCategory} Services` : 'Explore Creative & Tech Services'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse high-quality gigs delivered by vetted professionals.'}
            </p>
          </div>

          {/* Filter Clean state helper */}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-primary-600 hover:text-primary-700 font-bold underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Fields
          </button>
          {["Graphics & Design", "Programming & IT", "Writing & Translation", "Video & Animation"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>



        {/* Grid split: Left Column: Gigs (2/3 width) | Right Column: Shoutout Board (1/3 width) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gigs Grid */}
          <div className="lg:col-span-8 space-y-6">
            {filteredGigs.length > 0 ? (
              selectedCategory || searchQuery ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredGigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              ) : (
                <div className="space-y-12">
                  {["Graphics & Design", "Programming & IT", "Writing & Translation", "Video & Animation"].map((cat) => {
                    const catGigs = filteredGigs.filter(g => g.category === cat);
                    if (catGigs.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h3 className="text-xl font-bold font-display text-slate-900">{cat}</h3>
                          <button
                            onClick={() => setSelectedCategory(cat)}
                            className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group transition"
                          >
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                          {catGigs.slice(0, 4).map((gig) => (
                            <GigCard key={gig.id} gig={gig} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                <Search className="w-12 h-12 text-slate-350 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No services match your request</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or choosing another category from the filters above.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                  className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Reset Filter Search
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Shoutout Offers / Job Request Feed */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-900">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-md font-bold font-display tracking-tight flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-secondary-400" />
                  Shoutouts Feed
                </h3>
                
                {currentUser?.role === 'client' ? (
                  <button
                    onClick={() => setShowPostModal(true)}
                    className="text-xs bg-primary-500 hover:bg-primary-600 text-white font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Request</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Open Job Requests
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-1">
                Clients post instant job requests. Freelancers can submit bids directly on the cards below.
              </p>
            </div>

            {/* Job Board Feed list */}
            <div className="space-y-4">
              {shoutouts.length > 0 ? (
                shoutouts.map((shoutout) => (
                  <ShoutoutCard key={shoutout.id} shoutout={shoutout} />
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                  <p className="text-sm text-slate-400">No active job requests available.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ── STUDENT MODE: ACADEMY HERO ── */}
      <section className="relative bg-slate-50 py-24 overflow-hidden border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-bold border border-purple-200 shadow-sm mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Kazify Academy is now open</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 leading-[1.1]">
                Turn your free time into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">freelance career.</span>
              </h2>
              
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Are you a high school student with a passion for tech or design? Join our gamified learning arena to develop high-income skills, complete real-world challenges, and build a portfolio before you even graduate.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/join"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 group text-lg"
                >
                  Join the Academy
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#academy-how-it-works"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-xl transition border border-slate-200 flex items-center justify-center text-lg"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/students.jpg"
                  alt="High school students collaborating on a laptop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Achievement Unlocked</p>
                  <p className="text-sm font-extrabold text-slate-800">First Gig Completed!</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-purple-300/20 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/2"></div>
      </section>

      {/* ── STUDENT MODE: HOW IT WORKS ── */}
      <section id="academy-how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-4">
              Your path from Student to Pro
            </h2>
            <p className="text-lg text-slate-500">
              The Academy is designed to bridge the gap between learning and earning through a gamified, supportive environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Learn the Skills</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access curated tutorials covering high-demand digital skills like web design, coding, video editing, and copywriting.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Complete Challenges</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter the Arena and tackle mock job requests. Earn XP, level up your profile, and collect skill badges to prove your worth.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Secure Real Gigs</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Once you reach Level 5, your profile unlocks for the main Kazify marketplace. Start bidding on real jobs and getting paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT MODE: WHY JOIN ── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                Why high schoolers are choosing Kazify Academy
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Safe & Monitored Environment</h4>
                    <p className="text-slate-400 text-sm">Our mock challenges are risk-free. You learn the ropes of client communication without the pressure of actual contracts.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Build a Verified Portfolio</h4>
                    <p className="text-slate-400 text-sm">Every completed Arena challenge acts as a portfolio piece vetted by our senior community members.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Zero Upfront Costs</h4>
                    <p className="text-slate-400 text-sm">The Academy is completely free to join and participate. We invest in the next generation of African talent.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold font-display text-white">Ready to level up?</h3>
                <p className="text-slate-400 text-sm">Create your student profile today and gain access to the Academy Arena.</p>
                <Link
                  to="/join"
                  className="block w-full bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-4 rounded-xl transition text-lg shadow-xl"
                >
                  Create Student Account
                </Link>
                <p className="text-xs text-slate-500 pt-2">Requires no credit card or commitment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                <select
                  value={shoutoutCat}
                  onChange={(e) => setShoutoutCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
