import React from 'react';
import { Challenge } from '../data/mockData';
import { Target, Trophy, Clock, Star, Flame, Code, PenTool, Bug } from 'lucide-react';

interface Props {
  challenge: Challenge;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Novice': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'Intermediate': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'Advanced': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
  }
};

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Bug': return <Bug className="w-5 h-5 text-amber-500" />;
    case 'Code': return <Code className="w-5 h-5 text-blue-500" />;
    case 'PenTool': return <PenTool className="w-5 h-5 text-rose-500" />;
    default: return <Trophy className="w-5 h-5 text-emerald-500" />;
  }
};

export const ChallengeCard: React.FC<Props> = ({ challenge }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col h-full">
      {/* Top row: Category & Difficulty */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {challenge.category}
        </span>
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      {/* Title & Description */}
      <div className="mb-6 flex-1">
        <h3 className="text-xl font-bold font-display text-slate-900 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
          {challenge.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {challenge.description}
        </p>
      </div>

      {/* Rewards & Action */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary-600 font-bold text-sm bg-primary-50 px-2.5 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-current" />
            +{challenge.xpReward} XP
          </div>
          
          {challenge.badgeReward && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200" title={`Rewards badge: ${challenge.badgeReward.name}`}>
              {getBadgeIcon(challenge.badgeReward.icon)}
              <span className="truncate max-w-[100px]">{challenge.badgeReward.name}</span>
            </div>
          )}
        </div>

        {/* Sponsor/Due Date Context */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          {challenge.sponsor ? (
            <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Sponsored</span>
          ) : (
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> Core Skill</span>
          )}
          {challenge.dueDate && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Ends soon</span>
          )}
        </div>

        <button className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition">
          Start Challenge
        </button>
      </div>
    </div>
  );
};
