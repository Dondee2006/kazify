import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockChallenges } from '../data/mockData';
import { ChallengeCard } from '../components/ChallengeCard';
import { Award, Trophy, Zap, Code, Bug, PenTool, LayoutTemplate, Star } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const getLevelFromXp = (xp: number) => {
  if (xp >= 1000) return { level: 5, nextLevelAt: 2500, title: 'Master' };
  if (xp >= 500) return { level: 4, nextLevelAt: 1000, title: 'Expert' };
  if (xp >= 250) return { level: 3, nextLevelAt: 500, title: 'Apprentice' };
  if (xp >= 100) return { level: 2, nextLevelAt: 250, title: 'Beginner' };
  return { level: 1, nextLevelAt: 100, title: 'Novice' };
};

const getBadgeIcon = (iconName: string, className: string = "w-8 h-8") => {
  switch (iconName) {
    case 'Bug': return <Bug className={className} />;
    case 'Code': return <Code className={className} />;
    case 'PenTool': return <PenTool className={className} />;
    default: return <Trophy className={className} />;
  }
};

export const AcademyDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Route protection - redirect to home if not a student
  if (currentUser?.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  const xp = currentUser.xp || 0;
  const badges = currentUser.badges || [];
  const levelInfo = getLevelFromXp(xp);
  const progressPercent = Math.min(100, (xp / levelInfo.nextLevelAt) * 100);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      {/* Academy Header */}
      <div className="bg-emerald-950 text-white border-b border-emerald-900 py-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #4ade80 0%, transparent 40%)' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            {/* Greeting */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold tracking-wider uppercase text-sm mb-2">
                <Award className="w-5 h-5" /> Kazify Academy
              </div>
              <h1 className="text-4xl font-black font-display tracking-tight">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-emerald-200 text-lg max-w-xl">
                Complete challenges, earn experience points, and build your verified portfolio before graduating to a full Freelancer.
              </p>
            </div>

            {/* Level & XP Widget */}
            <div className="bg-emerald-900/50 border border-emerald-800 rounded-2xl p-6 w-full md:w-80 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Current Status</div>
                  <div className="text-2xl font-black font-display text-white">Level {levelInfo.level}: <span className="text-amber-400">{levelInfo.title}</span></div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-100 font-bold flex items-center gap-1 justify-end">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {xp} XP
                  </div>
                  <div className="text-emerald-400/80 text-[10px] uppercase font-bold tracking-wider">
                    / {levelInfo.nextLevelAt} to Next
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-emerald-950 rounded-full h-3 mb-2 border border-emerald-800/50">
                <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-xs text-emerald-300 text-center font-medium mt-3">
                {levelInfo.nextLevelAt - xp} XP needed for Level {levelInfo.level + 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content: Challenges */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              <h2 className="text-2xl font-bold font-display text-slate-900">Active Challenges</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>

          {/* Right Sidebar: Badges & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-500" />
                Trophy Cabinet
              </h3>
              
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-center hover:bg-emerald-50 hover:border-emerald-100 transition cursor-help" title={badge.name}>
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-primary-500 border border-slate-100">
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{badge.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No badges yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Complete challenges to earn them!</p>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
              <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2 text-sm">
                <LayoutTemplate className="w-4 h-4 text-emerald-600" />
                Ready to Graduate?
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                Reach Level 5 to unlock the ability to convert your Student profile into a full Freelancer profile. You'll keep all your badges as "Verified Skills"!
              </p>
              <div className="w-full bg-emerald-200/50 rounded-full h-2 mb-1">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(levelInfo.level / 5) * 100}%` }}></div>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold text-right">{levelInfo.level} / 5</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
