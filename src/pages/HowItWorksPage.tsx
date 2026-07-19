import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, Star, ShieldCheck, Zap, ArrowRight, MessageCircle, Package, ThumbsUp } from 'lucide-react';

const clientSteps = [
  {
    step: '01',
    icon: <Search className="w-7 h-7 text-primary-500" />,
    title: 'Search or Post',
    desc: 'Browse thousands of verified services across every category — design, tech, events, cleaning, tutoring, and more. Or post a "Shoutout" describing what you need and let providers come to you.',
  },
  {
    step: '02',
    icon: <Star className="w-7 h-7 text-amber-500" />,
    title: 'Review & Choose',
    desc: 'Compare providers by reviews, ratings, portfolio samples, delivery time, and price. Message them before ordering to make sure they understand your requirements.',
  },
  {
    step: '03',
    icon: <ShieldCheck className="w-7 h-7 text-emerald-500" />,
    title: 'Pay Securely via Escrow',
    desc: 'Place your order and pay through our secure escrow system. Your money is held safely and only released to the provider once you are 100% satisfied with the delivery.',
  },
  {
    step: '04',
    icon: <Package className="w-7 h-7 text-violet-500" />,
    title: 'Receive Your Delivery',
    desc: 'The provider works on your order and delivers it through the platform. Review the work, request revisions if needed, and approve when you\'re happy.',
  },
  {
    step: '05',
    icon: <ThumbsUp className="w-7 h-7 text-rose-500" />,
    title: 'Approve & Leave a Review',
    desc: 'Once satisfied, approve the delivery — funds are released to the provider. Leave an honest review to help the community find great talent.',
  },
];

const providerSteps = [
  {
    step: '01',
    icon: <Zap className="w-7 h-7 text-amber-500" />,
    title: 'Create Your Profile',
    desc: 'Sign up, verify your identity, and build a compelling profile. Add your skills, portfolio work, past experience, and a professional bio that makes clients say "I need this person."',
  },
  {
    step: '02',
    icon: <Package className="w-7 h-7 text-primary-500" />,
    title: 'List Your Services',
    desc: 'Create detailed service listings ("gigs") with clear descriptions, pricing tiers, delivery timelines, and sample work. A well-crafted listing gets more orders.',
  },
  {
    step: '03',
    icon: <MessageCircle className="w-7 h-7 text-emerald-500" />,
    title: 'Receive & Accept Orders',
    desc: 'Get notified when a client places an order. Chat with them through our secure inbox to clarify requirements, then confirm you\'re ready to start.',
  },
  {
    step: '04',
    icon: <CheckCircle2 className="w-7 h-7 text-violet-500" />,
    title: 'Deliver Great Work',
    desc: 'Complete the work and submit your delivery through the platform before the deadline. Consistent on-time delivery earns you badges and boosts your ranking.',
  },
  {
    step: '05',
    icon: <ShieldCheck className="w-7 h-7 text-rose-500" />,
    title: 'Get Paid, Build Reputation',
    desc: 'Once the client approves the work, funds are released to your Kazify wallet instantly. Withdraw to M-Pesa, Airtel Money, or your bank. Earn great reviews and grow your income.',
  },
];

const features = [
  { emoji: '🔒', title: 'Escrow Protection', desc: 'Money is held safely until you approve the work — zero risk for clients, guaranteed payment for providers.' },
  { emoji: '⭐', title: 'Verified Reviews', desc: 'Only clients who have placed an order can leave a review — so every rating is real and earned.' },
  { emoji: '💬', title: 'In-App Messaging', desc: 'Communicate directly with your client or provider in our secure, built-in chat system.' },
  { emoji: '🌍', title: '25+ Countries', desc: 'Access Africa\'s best talent from over 25 countries, all from one platform.' },
  { emoji: '📱', title: 'Mobile App', desc: 'Manage orders, chat, and get notifications on the go with the Kazify mobile app.' },
  { emoji: '🎓', title: 'Kazify Academy', desc: 'Upskill with our free courses designed to help youth enter the professional services economy.' },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="flex-1 bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0d4f47] to-slate-900 text-white py-24 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          Simple & Transparent
        </span>
        <h1 className="text-5xl sm:text-6xl font-black mb-5">
          How <span className="text-primary-400">Kazify</span> Works
        </h1>
        <p className="text-white/75 max-w-xl mx-auto text-lg">
          Whether you're a client looking for help or a provider ready to earn — Kazify makes the whole process safe, simple, and rewarding.
        </p>
      </section>

      {/* For Clients */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">For Clients</span>
            <h2 className="text-3xl font-black text-slate-900">Hire in 5 simple steps</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">Find, hire, and pay with confidence. Your money is protected at every step.</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute left-[2.9rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary-200 via-primary-100 to-transparent" />
            <div className="space-y-8">
              {clientSteps.map(({ step, icon, title, desc }) => (
                <div key={step} className="flex gap-6 items-start">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-primary-100 flex items-center justify-center shadow-sm">
                      {icon}
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-black text-white bg-primary-600 rounded-full w-5 h-5 flex items-center justify-center">{step}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl px-6 py-5 border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-black text-slate-900 text-lg mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3.5 rounded-full transition">
              Start Browsing Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-gradient-to-r from-primary-600 to-emerald-500 h-1" />

      {/* For Providers */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 block">For Providers</span>
            <h2 className="text-3xl font-black text-slate-900">Start earning in 5 steps</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">Set up your profile, list your services, and get paid for what you're great at.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-[2.9rem] top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-100 to-transparent" />
            <div className="space-y-8">
              {providerSteps.map(({ step, icon, title, desc }) => (
                <div key={step} className="flex gap-6 items-start">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-emerald-100 flex items-center justify-center shadow-sm">
                      {icon}
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-black text-white bg-emerald-600 rounded-full w-5 h-5 flex items-center justify-center">{step}</span>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl px-6 py-5 border border-gray-100 hover:shadow-md transition">
                    <h3 className="font-black text-slate-900 text-lg mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/join" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-full transition">
              Join as a Provider <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">Built for Trust</span>
            <h2 className="text-3xl font-black text-slate-900">Why Kazify is Different</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ emoji, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <p className="text-3xl mb-4">{emoji}</p>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d4f47] py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-black mb-4">Ready to get started?</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">Join thousands of clients and providers already using Kazify every day.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/services" className="bg-white text-[#0d4f47] font-bold px-7 py-3 rounded-full hover:bg-slate-100 transition">Find a Service</Link>
          <Link to="/join"     className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3 rounded-full transition">Become a Provider</Link>
        </div>
      </section>

    </div>
  );
};
