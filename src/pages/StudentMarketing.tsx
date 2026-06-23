import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Trophy, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export const StudentMarketing: React.FC = () => {
  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* ── HERO SECTION ── */}
      <section className="relative bg-slate-50 pt-20 pb-24 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-bold border border-purple-200 shadow-sm mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Kazify Academy is now open</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.1]">
                Turn your free time into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">freelance career.</span>
              </h1>
              
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
                  href="#how-it-works"
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
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
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

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-24 bg-white">
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
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Learn the Skills</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Access curated tutorials covering high-demand digital skills like web design, coding, video editing, and copywriting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center hover:shadow-lg transition">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Complete Challenges</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter the Arena and tackle mock job requests. Earn XP, level up your profile, and collect skill badges to prove your worth.
              </p>
            </div>

            {/* Step 3 */}
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

      {/* ── BENEFITS/WHY JOIN ── */}
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

    </div>
  );
};
