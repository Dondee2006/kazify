import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Laptop, Brush, Pencil, Video, Briefcase, GraduationCap } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [industry, setIndustry] = useState('');

  if (!currentUser) {
    return <Navigate to="/join" replace />;
  }

  if (currentUser.onboardingComplete) {
    return <Navigate to={currentUser.role === 'student' ? '/academy' : currentUser.role === 'client' ? '/services' : '/jobs'} replace />;
  }

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'client' && !industry) return;
    if ((currentUser.role === 'freelancer' || currentUser.role === 'student') && selectedSkills.length === 0) return;

    completeOnboarding({
      skills: selectedSkills,
      ...(currentUser.role === 'client' ? { bio: `${currentUser.bio} Industry: ${industry}` } : {})
    });

    navigate(currentUser.role === 'student' ? '/academy' : currentUser.role === 'client' ? '/services' : '/jobs');
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const skillOptions = [
    { id: 'web', name: 'Web Development', icon: <Laptop className="w-4 h-4" /> },
    { id: 'design', name: 'UI/UX Design', icon: <Brush className="w-4 h-4" /> },
    { id: 'writing', name: 'Copywriting', icon: <Pencil className="w-4 h-4" /> },
    { id: 'video', name: 'Video Editing', icon: <Video className="w-4 h-4" /> },
  ];

  const industries = [
    "Technology & SaaS", "E-commerce", "Agriculture", "Finance & Fintech", "Healthcare", "Education"
  ];

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-8 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(22,163,74,0.15)_0%,transparent_60%)]" />
          <Sparkles className="w-8 h-8 text-primary-400 mx-auto mb-3 relative z-10" />
          <h1 className="text-3xl font-black font-display tracking-tight relative z-10">
            Welcome to Kazify, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-300 mt-2 relative z-10 text-sm">
            Let's personalize your experience before you get started.
          </p>
        </div>

        <form onSubmit={handleComplete} className="p-8 space-y-8">
          
          {currentUser.role === 'client' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" /> What industry are you in?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {industries.map(ind => (
                  <button
                    type="button"
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`p-3 text-sm font-semibold rounded-xl border text-left transition ${
                      industry === ind 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentUser.role === 'freelancer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-primary-500" /> What are your primary skills?
              </h3>
              <p className="text-xs text-slate-500">Select the areas you excel in to help us match you with clients.</p>
              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map(skill => (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => toggleSkill(skill.name)}
                    className={`p-4 flex items-center gap-3 rounded-xl border transition ${
                      selectedSkills.includes(skill.name)
                        ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                    }`}
                  >
                    <div className={selectedSkills.includes(skill.name) ? 'text-primary-500' : 'text-slate-400'}>
                      {skill.icon}
                    </div>
                    <span className="text-sm">{skill.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentUser.role === 'student' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" /> What do you want to learn?
              </h3>
              <p className="text-xs text-slate-500">Select the fields you're most interested in mastering at the Academy.</p>
              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map(skill => (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => toggleSkill(skill.name)}
                    className={`p-4 flex items-center gap-3 rounded-xl border transition ${
                      selectedSkills.includes(skill.name)
                        ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 font-semibold hover:bg-slate-50'
                    }`}
                  >
                    <div className={selectedSkills.includes(skill.name) ? 'text-purple-500' : 'text-slate-400'}>
                      {skill.icon}
                    </div>
                    <span className="text-sm">{skill.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={(currentUser.role === 'client' && !industry) || (currentUser.role !== 'client' && selectedSkills.length === 0)}
              className="bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition flex items-center gap-2"
            >
              Complete Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
