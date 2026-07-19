import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, Star, Zap, Heart, CheckCircle2, Target } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    { value: '50,000+', label: 'Registered Providers' },
    { value: '120,000+', label: 'Happy Clients' },
    { value: '25+', label: 'African Countries' },
    { value: '$4M+', label: 'Paid to Freelancers' },
  ];

  const values = [
    { icon: <ShieldCheck className="w-6 h-6 text-primary-500" />, title: 'Trust & Safety', desc: 'Every transaction is protected by our secure escrow system — funds are released only when work is approved.' },
    { icon: <Globe className="w-6 h-6 text-emerald-500" />, title: 'African Excellence', desc: 'We believe Africa has world-class talent waiting to be discovered. Kazify is that bridge to the world.' },
    { icon: <Zap className="w-6 h-6 text-amber-500" />, title: 'Speed & Simplicity', desc: 'From posting a job to receiving a finished deliverable — every step is streamlined and effortless.' },
    { icon: <Heart className="w-6 h-6 text-rose-500" />, title: 'Community First', desc: 'We\'re building more than a marketplace — we\'re nurturing a thriving community of skilled professionals.' },
    { icon: <Target className="w-6 h-6 text-violet-500" />, title: 'Opportunity for All', desc: 'Whether you\'re a graphic designer, plumber, tutor, or event planner — Kazify has a place for you.' },
    { icon: <Star className="w-6 h-6 text-blue-500" />, title: 'Quality Guaranteed', desc: 'Our review and verification system ensures only the best providers rise to the top.' },
  ];

  const team = [
    { name: 'Amara Diallo', role: 'CEO & Co-Founder', country: 'Senegal', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Kofi Mensah',  role: 'CTO & Co-Founder', country: 'Ghana',   avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Fatima Osei',  role: 'Head of Design',   country: 'Nigeria', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Tariq Nkosi',  role: 'Head of Growth',   country: 'Uganda',  avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
  ];

  const timeline = [
    { year: '2021', title: 'Idea Born', desc: 'Two friends frustrated by the lack of a trustworthy African freelance platform sketch out Kazify on a napkin in Kampala, Uganda.' },
    { year: '2022', title: 'Beta Launch', desc: 'Kazify launches in private beta with 200 hand-picked providers across Uganda, Kenya, Ghana and Nigeria.' },
    { year: '2023', title: 'Escrow Introduced', desc: 'We launch our proprietary escrow payment system, making transactions safer for both clients and providers.' },
    { year: '2024', title: 'Pan-African Expansion', desc: 'Kazify grows to 25+ countries with over 50,000 registered providers and 120,000+ happy clients.' },
    { year: '2025', title: 'Kazify Academy', desc: 'We launch the Academy — a learning platform helping youth upskill and enter the professional services economy.' },
  ];

  return (
    <div className="flex-1 bg-white">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#0d4f47] to-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #14b8a6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0d9488 0%, transparent 40%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🌍 Our Story
          </span>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Unlocking Africa's<br />
            <span className="text-primary-400">Boundless Talent</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Kazify was born from a simple belief: Africa's skilled professionals deserve a world-class platform to showcase their work, connect with global clients, and get paid fairly.
          </p>
          <Link to="/join" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-7 py-3.5 rounded-full transition shadow-lg shadow-primary-900/30">
            Join the Movement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-b border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-slate-900 mb-1">{value}</p>
              <p className="text-sm text-slate-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">Our Mission</span>
            <h2 className="text-4xl font-black text-slate-900 mb-5 leading-tight">We exist to close the opportunity gap.</h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Kazify is Africa's premier escrow-backed marketplace where clients find vetted, talented professionals across every service category — from web development and graphic design to event planning, tutoring, cleaning, photography, and more.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              We handle the trust layer so you don't have to. Payments are held securely in escrow, released only when you're satisfied with the work. No more scams, no more ghosting — just great work, done right.
            </p>
            <div className="space-y-3">
              {['Safe escrow payment protection', 'Verified and rated professionals', 'All service categories under one roof', 'Serving 25+ African countries'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="text-slate-700 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
              alt="Team collaborating"
              className="rounded-2xl shadow-2xl object-cover w-full h-[380px]"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100">
              <p className="text-2xl font-black text-slate-900">98%</p>
              <p className="text-xs text-slate-500 font-medium">Client satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">What Drives Us</span>
            <h2 className="text-3xl font-black text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-4">{icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">How Far We've Come</span>
            <h2 className="text-3xl font-black text-slate-900">Our Journey</h2>
          </div>
          <div className="relative border-l-2 border-primary-100 pl-8 space-y-10">
            {timeline.map(({ year, title, desc }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.6rem] top-0 w-5 h-5 rounded-full bg-primary-500 border-4 border-white shadow" />
                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{year}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">The People Behind It</span>
            <h2 className="text-3xl font-black text-slate-900">Meet the Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, country, avatar }) => (
              <div key={name} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition">
                <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-slate-100" />
                <p className="font-bold text-slate-900">{name}</p>
                <p className="text-sm text-primary-600 font-medium mt-0.5">{role}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1"><Globe className="w-3 h-3" />{country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d4f47] py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-black mb-4">Ready to be part of the story?</h2>
        <p className="text-white/75 mb-8 max-w-md mx-auto">Whether you're a client looking for top talent or a provider ready to showcase your skills — Kazify is your home.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/services" className="bg-white text-[#0d4f47] font-bold px-7 py-3 rounded-full hover:bg-slate-100 transition">Find a Service</Link>
          <Link to="/join" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3 rounded-full transition">Join as Provider</Link>
        </div>
      </section>

    </div>
  );
};
