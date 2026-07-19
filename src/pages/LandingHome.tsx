import React, { useState, useEffect, useCallback } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { GigCard } from '../components/GigCard';
import { Search, Sparkles, Target, Trophy, Briefcase, ArrowRight, CheckCircle2, Zap, Bell, MapPin, Shield, SearchCheck, MessageCircle, CheckSquare, Home, Wrench, Users, LogIn, Palette, Code2, PenLine, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
    country: 'Uganda 🇺🇬',
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
  const { filteredGigs, searchQuery, setSearchQuery, addShoutout } = useMarketplace();
  const { currentUser, allUsers } = useAuth();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPostModal, setShowPostModal] = useState(false);
  const [shoutoutTitle, setShoutoutTitle] = useState('');
  const [shoutoutDesc, setShoutoutDesc]   = useState('');
  const [shoutoutBudget, setShoutoutBudget] = useState(100);
  const [shoutoutTime, setShoutoutTime]   = useState(3);
  const [shoutoutCat, setShoutoutCat]     = useState<'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation'>('Programming & IT');

  const nextSlide = useCallback(() =>
    setCurrentSlide(s => (s + 1) % SLIDES.length), []);
  const goToSlide = useCallback((i: number) => setCurrentSlide(i), []);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [nextSlide]);

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


  return (
    <div className="flex-1 bg-slate-50">
            {/* ── HERO SECTION ───────────────────────────────────────────────── */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[800px] overflow-hidden text-white flex items-center">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0 bg-black">
          {[
            '/pexels-kindelmedia-8487341.jpg',
            '/pexels-pexels-by-ardarh-664883754-33653240.jpg',
            '/slide1.jpg',
            '/slide2.jpg',
          ].map((bg, index) => (
            <img
              key={index}
              src={bg}
              alt={`Hero Background ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${
                currentSlide % 4 === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Subtle overlay only on the left for text readability, keeping pictures bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Slide Controls (Dots) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                (currentSlide % 4) === idx ? 'bg-primary-500 w-8' : 'bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Top Badge */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/40 text-white text-sm font-medium border border-white/10 backdrop-blur-md">
              Kazify's Number-One services marketplace
            </span>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Hire Africa's Best Freelancers
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/90">
              Designers, developers, photographers, tutors, cleaners, event planners & more — all in one place.
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <div className="flex items-center w-full max-w-4xl bg-white rounded-full p-2 shadow-2xl">
                <div className="pl-4 pr-2 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-lg focus:outline-none px-2"
                />
                <button
                  onClick={() => {
                    const destPath = currentUser 
                      ? (currentUser.role === 'client' ? '/services' : currentUser.role === 'student' ? '/academy' : '/jobs') 
                      : '/services';
                    if (window.location.pathname !== destPath) {
                      window.location.href = destPath;
                    }
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-full flex items-center gap-2 transition"
                >
                  Search
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  'Graphics & Design',
                  'Programming & IT',
                  'Events & Media',
                  'Education & Training',
                  'Home & Cleaning',
                  'Business Services',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full transition"
                  >
                    {tag}
                    <ArrowRight className="w-4 h-4 text-white/70" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* ── PROFESSIONALS SCROLL ────────────────────────────────────────── */}
      <section className="w-full bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent"></div>
        <div className="flex overflow-x-auto scrollbar-hide">
          {allUsers.filter(u => u.role !== 'student').map((user) => (
            <div key={user.id} className="min-w-[220px] max-w-[300px] flex-shrink-0 flex items-center gap-3 px-4 py-3 border-r border-gray-100 hover:bg-slate-50 transition cursor-pointer">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800 line-clamp-1">{user.name}</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">{user.country || 'Verified Provider'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES SCROLL ───────────────────────────────────────────── */}
      <section className="w-full bg-gray-50 border-b border-gray-100 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-gray-50 to-transparent"></div>
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { label: 'Graphics & Design', icon: <Palette className="w-3.5 h-3.5" />, color: 'bg-pink-100 text-pink-600' },
            { label: 'Programming & IT', icon: <Code2 className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-600' },
            { label: 'Writing & Translation', icon: <PenLine className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-600' },
            { label: 'Video & Animation', icon: <Video className="w-3.5 h-3.5" />, color: 'bg-violet-100 text-violet-600' },
            { label: 'Events & Media', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-orange-100 text-orange-600' },
            { label: 'Education & Training', icon: <Zap className="w-3.5 h-3.5" />, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Home & Cleaning', icon: <Home className="w-3.5 h-3.5" />, color: 'bg-green-100 text-green-600' },
            { label: 'Business Services', icon: <Briefcase className="w-3.5 h-3.5" />, color: 'bg-teal-100 text-teal-600' },
            { label: 'Photography', icon: <Bell className="w-3.5 h-3.5" />, color: 'bg-rose-100 text-rose-600' },
            { label: 'Personal Care', icon: <Users className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-600' },
          ].map(({ label, icon, color }, idx) => (
            <div key={idx} className="min-w-[170px] flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 border-r border-gray-100 hover:bg-white transition cursor-pointer" onClick={() => setSearchQuery(label)}>
              <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <span className="text-sm text-slate-700 font-medium whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── THIS AFTERNOON'S PICKS ──────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">This afternoon's picks</h2>
              <p className="mt-1 text-sm font-normal text-gray-500">New services added this afternoon</p>
            </div>
            <a href="/services" className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-primary-600">
              Browse all <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGigs.slice(0, 4).map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOT RIGHT NOW ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                  🔥 Trending
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Hot right now</h2>
              <p className="mt-1 text-sm font-normal text-gray-500">Most viewed services this afternoon</p>
            </div>
            <a href="/services" className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-primary-600">
              Browse all <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGigs.slice(4, 8).map(gig => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      {/* ── KAZIFY IN YOUR POCKET ───────────────────────────────────────── */}
      <section className="bg-[#0d4f47] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

            {/* Left: Text Content */}
            <div className="flex-1 text-white">
              {/* NOW AVAILABLE badge */}
              <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">Now available</span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
                Kazify in your pocket.<br />
                <span className="text-white">Skills, anywhere, anytime.</span>
              </h2>

              {/* Sub-text */}
              <p className="text-white/75 text-base leading-relaxed mb-8 max-w-md">
                Find trusted professionals, send enquiries, and manage your bookings on the go — all from the Kazify app.
              </p>

              {/* Feature bullets — 2×2 grid */}
              <div className="grid grid-cols-2 gap-3 mb-10 max-w-md">
                {[
                  { icon: <Zap className="w-4 h-4 text-yellow-300" />, title: 'Browse & contact', sub: 'providers instantly' },
                  { icon: <Bell className="w-4 h-4 text-sky-300" />, title: 'Real-time enquiry', sub: 'notifications' },
                  { icon: <MapPin className="w-4 h-4 text-rose-300" />, title: 'Find services', sub: 'near you' },
                  { icon: <Shield className="w-4 h-4 text-emerald-300" />, title: 'Safe, direct', sub: 'communication' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/10 hover:bg-white/15 transition rounded-xl px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0 bg-white/10 rounded-lg p-1.5">{feat.icon}</span>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">{feat.title}</p>
                      <p className="text-white/70 text-xs">{feat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Store Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Google Play */}
                <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white rounded-xl px-5 py-3 transition">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.4.22.85.24 1.27.07l12.04-6.96-2.73-2.73L3.18 23.76zM.56 1.6C.21 2 0 2.6 0 3.33v17.34c0 .73.21 1.33.56 1.73l.09.09 9.71-9.71v-.23L.65 1.51l-.09.09zM21.1 10.27l-2.71-1.57-3.07 3.07 3.07 3.07 2.73-1.57c.78-.45.78-1.55-.02-2z"/>
                    <path d="M4.45.24L16.49 7.2 13.76 9.93 1.72.24C2.15.07 2.6.09 3 .31L4.45.24z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/60 leading-none mb-0.5">GET IT ON</p>
                    <p className="text-sm font-bold leading-none">Google Play</p>
                  </div>
                </a>

                {/* App Store */}
                <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white rounded-xl px-5 py-3 transition">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</p>
                    <p className="text-sm font-bold leading-none">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Phone Mockup — hand-crafted to match reference */}
            <div className="flex-shrink-0 relative flex items-end justify-center w-full lg:w-auto">
              <div className="relative">
                {/* Glow blob */}
                <div className="absolute -inset-12 bg-white/5 blur-3xl rounded-full pointer-events-none" />

                {/* Phone shell */}
                <div className="relative z-10 w-[230px] bg-black rounded-[2.8rem] border-[7px] border-black shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden" style={{height: '480px'}}>

                  {/* Status bar */}
                  <div className="bg-white flex items-center justify-between px-5 pt-2 pb-1">
                    <span className="text-[9px] font-bold text-black">18:39</span>
                    {/* Dynamic island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full" />
                    <div className="flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0112 10c-2.06 0-3.96.57-5.59 1.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>
                      <svg className="w-3 h-2 text-black fill-current" viewBox="0 0 20 12"><rect x="0" y="2" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="1.5" y="3.5" width="10" height="6" rx="1" fill="currentColor"/><path d="M17 5v3a2 2 0 000-3z" fill="currentColor"/></svg>
                    </div>
                  </div>

                  {/* App content - scrollable inner */}
                  <div className="h-full overflow-hidden flex flex-col">

                    {/* App top bar */}
                    <div className="bg-white flex items-center justify-between px-3 py-2 border-b border-gray-100">
                      <div>
                        <p className="text-[11px] font-black text-slate-900 leading-tight">
                          Kazi<span className="text-primary-600">fy</span>
                        </p>
                        <p className="text-[7px] text-slate-400 leading-tight">Find trusted local services</p>
                      </div>
                      <Link to="/join" className="flex items-center gap-1 border border-[#0d4f47] rounded-full px-2 py-0.5 hover:bg-slate-50 transition">
                        <svg className="w-2 h-2 text-[#0d4f47]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14"/></svg>
                        <span className="text-[8px] font-bold text-[#0d4f47]">Sign in</span>
                      </Link>
                    </div>

                    {/* Hero with background image slideshow — mirrors the real site */}
                    <div className="relative overflow-hidden" style={{minHeight: '155px'}}>
                      {/* Background images — same array as real hero */}
                      {[
                        '/pexels-kindelmedia-8487341.jpg',
                        '/pexels-pexels-by-ardarh-664883754-33653240.jpg',
                        '/slide1.jpg',
                        '/slide2.jpg',
                      ].map((bg, index) => (
                        <img
                          key={index}
                          src={bg}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
                          style={{ opacity: (currentSlide % 4) === index ? 1 : 0 }}
                        />
                      ))}
                      {/* Gradient overlay — dark left just like the real site */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Content on top */}
                      <div className="relative z-10 px-3 py-3">
                        <span className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 mb-2 border border-white/20">
                          <span className="text-[7px] text-white font-semibold">Kazify's #1 services marketplace</span>
                        </span>
                        <h3 className="text-white font-black text-[13px] leading-tight mb-0.5 drop-shadow">
                          Find trusted professionals<br/>near you
                        </h3>
                        <p className="text-white/80 text-[7px] leading-tight mb-2 drop-shadow">
                          Designers, developers, photographers & more.
                        </p>
                        {/* Search bar */}
                        <Link to="/services" className="flex items-center bg-white rounded-lg overflow-hidden mb-2 shadow-lg cursor-pointer hover:bg-slate-50 transition">
                          <svg className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                          <span className="flex-1 text-[7px] text-gray-400 px-1.5 py-1.5 text-left">Search services, providers...</span>
                          <div className="bg-[#0d4f47] p-1.5 m-0.5 rounded-md">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                          </div>
                        </Link>
                        {/* Category pills */}
                        <div className="flex gap-1 overflow-hidden">
                          {['Events & Media', 'Tech & Digital', 'Education'].map(c => (
                            <button
                              key={c}
                              onClick={() => { setSearchQuery(c === 'Education' ? 'Education & Training' : c); navigate('/services'); }}
                              className="flex-shrink-0 flex items-center gap-0.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-2 py-0.5 hover:bg-white/30 transition text-left"
                            >
                              <span className="text-white text-[6px] font-medium">{c}</span>
                              <svg className="w-1.5 h-1.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                            </button>
                          ))}
                        </div>
                        {/* Slide dots */}
                        <div className="flex items-center gap-1 mt-2">
                          {[0,1,2,3].map(i => (
                            <div key={i} className="rounded-full transition-all" style={{
                              width: (currentSlide % 4) === i ? '10px' : '4px',
                              height: '3px',
                              background: (currentSlide % 4) === i ? '#fff' : 'rgba(255,255,255,0.4)'
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* White content below */}
                    <div className="bg-white flex-1 px-3 py-2 overflow-hidden">
                      {/* Browse by category */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-black text-slate-900">Browse by category</span>
                        <Link to="/services" className="text-[7px] font-semibold text-[#0d4f47] flex items-center gap-0.5 hover:underline">
                          See all <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3 overflow-hidden">
                        {[
                          { label: 'Events & Media', color: 'bg-orange-50 text-orange-700 border-orange-100' },
                          { label: 'Tech & Digital', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                          { label: 'Education', color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
                          { label: 'Personal', color: 'bg-pink-50 text-pink-700 border-pink-100' },
                        ].map((cat) => (
                          <button
                            key={cat.label}
                            onClick={() => { setSearchQuery(cat.label === 'Education' ? 'Education & Training' : cat.label === 'Personal' ? 'Personal Services' : cat.label); navigate('/services'); }}
                            className={`px-2 py-1 rounded-full border text-[6px] font-bold transition transform hover:scale-105 active:scale-95 ${cat.color}`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Featured Services */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-[9px] font-black text-slate-900">Featured Services</p>
                          <p className="text-[6px] text-slate-400">Top-rated gigs on Kazify</p>
                        </div>
                        <Link to="/services" className="text-[7px] font-semibold text-[#0d4f47] flex items-center gap-0.5 hover:underline">
                          See all <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </Link>
                      </div>
                      {/* Horizontal scrollable service cards */}
                      <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
                        {(filteredGigs.length > 0 ? filteredGigs : [
                          { id:'ph1', title:'Brand Identity & Logo Design', image:'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400', startingPrice:500000, rating:4.8 },
                          { id:'ph2', title:'Next.js Web Application', image:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', startingPrice:1000000, rating:4.9 },
                          { id:'ph3', title:'Motion Graphics & Video', image:'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400', startingPrice:250000, rating:5.0 },
                          { id:'ph4', title:'Swahili Translation', image:'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400', startingPrice:10000, rating:4.7 },
                        ] as any[]).slice(0, 5).map((gig: any) => (
                          <Link to={gig.id.startsWith('ph') ? '/services' : `/gig/${gig.id}`} key={gig.id} className="flex-shrink-0 w-[72px] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm block hover:shadow-md transition">
                            {/* Service thumbnail */}
                            <div className="w-full h-[52px] overflow-hidden relative">
                              <img
                                src={gig.image}
                                alt={gig.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=400';
                                }}
                              />
                              {/* Price badge */}
                              <div className="absolute bottom-0.5 left-0.5 bg-[#0d4f47] text-white text-[4.5px] font-black px-1 py-0.5 rounded-full leading-none">
                                From UGX {(gig.startingPrice / 1000).toFixed(0)}k
                              </div>
                            </div>
                            {/* Card info */}
                            <div className="px-1 py-1">
                              <p className="text-[5.5px] font-bold text-slate-800 leading-tight line-clamp-2 mb-0.5">{gig.title}</p>
                              <div className="flex items-center gap-0.5">
                                <svg className="w-1.5 h-1.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                <span className="text-[4.5px] font-semibold text-slate-600">{gig.rating?.toFixed(1)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="bg-white border-t border-gray-100 flex items-center justify-around px-2 py-1.5">
                      {[
                        { icon: <Home className="w-3 h-3" />, label: 'Home', path: '/' },
                        { icon: <Wrench className="w-3 h-3" />, label: 'Services', path: '/services' },
                        { icon: <Users className="w-3 h-3" />, label: 'Providers', path: '/providers' },
                        { icon: <LogIn className="w-3 h-3" />, label: 'Sign in', path: '/join' },
                      ].map(n => (
                        <Link to={n.path} key={n.label} className="flex flex-col items-center gap-0.5 hover:text-[#0d4f47] transition">
                          <span className={n.path === '/' ? 'text-[#0d4f47]' : 'text-slate-400'}>{n.icon}</span>
                          <span className={`text-[5.5px] font-semibold ${n.path === '/' ? 'text-[#0d4f47]' : 'text-slate-400'}`}>{n.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* "Free to use" floating pill */}
                <div className="absolute -bottom-3 -right-4 z-20 bg-[#0d9488] text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Free to use
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FROM SEARCH TO DONE ─────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold tracking-[0.15em] text-primary-600 uppercase mb-3">HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">From search to done</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: 'Discover', desc: 'Browse services or search providers near you.', icon: <SearchCheck className="w-7 h-7 text-primary-600" />, color: 'bg-primary-50 border-primary-100' },
            { title: 'Request', desc: 'Message the provider or request a booking.', icon: <MessageCircle className="w-7 h-7 text-sky-600" />, color: 'bg-sky-50 border-sky-100' },
            { title: 'Pay Securely', desc: 'Pay safely. Funds are held until the job is done.', icon: <Shield className="w-7 h-7 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-100' },
            { title: 'Confirm', desc: 'Mark the work complete and the provider gets paid.', icon: <CheckSquare className="w-7 h-7 text-violet-600" />, color: 'bg-violet-50 border-violet-100' },
          ].map((step, idx) => (
            <div key={idx} className="text-center flex flex-col items-center group">
              {/* Step number connector */}
              <div className="relative mb-5">
                <div className={`w-16 h-16 rounded-2xl ${step.color} border-2 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">{idx + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARE YOU A PROFESSIONAL ──────────────────────────────────────── */}
      <section className="bg-primary-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-primary-800/50 border border-primary-700/50 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm shadow-xl">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Are you a <span className="text-primary-300">professional?</span></h2>
            <p className="text-white/70 text-lg mb-6 max-w-md">Join Kazify and start connecting with clients today. Post unlimited services and get paid securely.</p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/join" className="inline-flex bg-white text-primary-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition transform hover:scale-105 items-center gap-2">
              Join as a provider <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

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
                Are you an ambitious youth with a passion for tech, creative arts, business, or professional services? Join our learning arena to develop high-income skills, complete real-world challenges, and build a professional portfolio to launch your career.
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
                Why youth are choosing Kazify Academy
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
                <p className="text-slate-400 text-sm">Create your profile today and gain access to the Academy Arena.</p>
                <Link
                  to="/join"
                  className="block w-full bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-4 rounded-xl transition text-lg shadow-xl"
                >
                  Create Free Account
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
