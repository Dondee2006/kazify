import React, { useState } from 'react';

import { MapPin, Briefcase, Clock, ArrowRight, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  team: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const openRoles: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    team: 'Engineering',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Build and scale the Kazify web platform. You\'ll work on our React/TypeScript codebase, shaping the experience for hundreds of thousands of users.',
    requirements: ['4+ years React/TypeScript experience', 'Strong eye for design and UX', 'Familiarity with REST APIs', 'Experience with Vite or Next.js'],
  },
  {
    id: 2,
    title: 'Product Designer (UX/UI)',
    team: 'Design',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Design beautiful, intuitive experiences for clients and freelancers. You\'ll own end-to-end design from research to high-fidelity prototypes.',
    requirements: ['3+ years product design experience', 'Proficiency in Figma', 'Portfolio showcasing web/mobile work', 'Experience running user research sessions'],
  },
  {
    id: 3,
    title: 'Community Growth Manager',
    team: 'Marketing',
    location: 'Remote or Lagos / Nairobi',
    type: 'Full-time',
    description: 'Grow Kazify\'s provider and client community. You\'ll run campaigns, partnerships, and events that bring more African talent onto the platform.',
    requirements: ['2+ years in growth or community roles', 'Deep understanding of African freelance/gig market', 'Strong written and verbal communication', 'Data-driven mindset'],
  },
  {
    id: 4,
    title: 'Trust & Safety Analyst',
    team: 'Operations',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Keep our marketplace safe and fair. You\'ll review flags, resolve disputes, and shape policies that protect both clients and providers.',
    requirements: ['Experience in trust & safety or fraud ops', 'Strong analytical and communication skills', 'Ability to handle sensitive situations with empathy', 'Knowledge of African internet culture'],
  },
  {
    id: 5,
    title: 'Partnership Manager — SMEs',
    team: 'Business Development',
    location: 'Nairobi / Accra / Lagos',
    type: 'Full-time',
    description: 'Build Kazify\'s B2B pipeline by signing SMEs, agencies, and corporates as repeat buyers on the platform.',
    requirements: ['3+ years B2B sales or partnerships experience', 'Existing network in the African SME sector', 'Strong negotiation skills', 'Self-starter who thrives without micromanagement'],
  },
];

const perks = [
  { emoji: '🌍', title: 'Fully Remote', desc: 'Work from anywhere in Africa. We\'re a remote-first team that trusts you to deliver.' },
  { emoji: '💰', title: 'Competitive Pay', desc: 'Market-rate salaries with annual performance bonuses tied to platform growth.' },
  { emoji: '📚', title: 'Learning Budget', desc: '$500/year for courses, books, conferences, and skills that make you better.' },
  { emoji: '🏥', title: 'Health Cover', desc: 'We provide health insurance for you and your immediate family.' },
  { emoji: '🏖️', title: 'Flexible Leave', desc: '25 days annual leave plus all public holidays in your country.' },
  { emoji: '🤝', title: 'Mission-Driven', desc: 'Work on something that meaningfully impacts millions of lives across Africa.' },
];

export const CareersPage: React.FC = () => {
  const [openJob, setOpenJob] = useState<number | null>(null);

  return (
    <div className="flex-1 bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0d4f47] to-slate-900 text-white py-24 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          🚀 We're Hiring
        </span>
        <h1 className="text-5xl sm:text-6xl font-black mb-5">Build Africa's Future<br /><span className="text-primary-400">With Us</span></h1>
        <p className="text-white/75 max-w-xl mx-auto text-lg mb-8">
          Join a passionate, remote-first team on a mission to unlock Africa's limitless talent for the world. We move fast, think big, and put people first.
        </p>
        <a href="#roles" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-7 py-3.5 rounded-full transition shadow-lg shadow-primary-900/30">
          View Open Roles <ArrowRight className="w-5 h-5" />
        </a>
      </section>

      {/* Perks */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">Why Kazify?</span>
            <h2 className="text-3xl font-black text-slate-900">Life at Kazify</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <p className="text-3xl mb-4">{emoji}</p>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="roles" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-3 block">Come Build With Us</span>
            <h2 className="text-3xl font-black text-slate-900">Open Positions</h2>
          </div>
          <div className="space-y-4">
            {openRoles.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Briefcase className="w-3 h-3" />{job.team}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{job.type}</span>
                    </div>
                  </div>
                  {openJob === job.id ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {openJob === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-slate-600 text-sm leading-relaxed mt-4 mb-4">{job.description}</p>
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Requirements</h4>
                    <ul className="space-y-2 mb-6">
                      {job.requirements.map(req => (
                        <li key={req} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="mailto:careers@kazify.com"
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-full transition text-sm"
                    >
                      Apply for this role <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-10">
            Don't see your role? Email us at{' '}
            <a href="mailto:careers@kazify.com" className="text-primary-600 hover:underline font-medium">careers@kazify.com</a>
          </p>
        </div>
      </section>

    </div>
  );
};
