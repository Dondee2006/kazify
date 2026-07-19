import React, { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, Check, Camera, Upload } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface OnboardingData {
  photo: string;
  title: string;
  skills: string[];
  experience: string;
  portfolio: string;
  hourlyRate: string;
  availability: string;
  paymentMethod: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Photo',          pct: 12.5  },
  { id: 2, label: 'Title',          pct: 25    },
  { id: 3, label: 'Skills',         pct: 37.5  },
  { id: 4, label: 'Experience',     pct: 50    },
  { id: 5, label: 'Portfolio',      pct: 62.5  },
  { id: 6, label: 'Hourly Rate',    pct: 75    },
  { id: 7, label: 'Availability',   pct: 87.5  },
  { id: 8, label: 'Payment',        pct: 100   },
];

const SKILL_OPTIONS = [
  'Web Development', 'Mobile Apps', 'UI/UX Design', 'Graphic Design',
  'Copywriting', 'SEO Writing', 'Video Editing', 'Animation',
  'Photography', 'Data Analysis', 'Digital Marketing', 'Translation',
];

const AVAILABILITY_OPTIONS = [
  'Full-time (40+ hrs/week)',
  'Part-time (20–40 hrs/week)',
  'Weekends only',
  'Flexible / As needed',
];

const PAYMENT_OPTIONS = [
  { id: 'mtn', label: 'MTN Mobile Money', image: '/mtn.png' },
  { id: 'airtel', label: 'Airtel Money', image: '/airtel.png' },
  { id: 'bank', label: 'Bank Transfer', image: '/absa.png' },
  { id: 'paypal', label: 'PayPal', image: 'paypal' },
];

// ── Component ────────────────────────────────────────────────────────────────
export const Onboarding: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    photo: '', title: '', skills: [], experience: '',
    portfolio: '', hourlyRate: '', availability: '', paymentMethod: '',
  });
  const [error, setError] = useState('');

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!currentUser) return <Navigate to="/join" replace />;
  if (currentUser.onboardingComplete) {
    return <Navigate to={currentUser.role === 'client' ? '/services' : '/jobs'} replace />;
  }

  // For non-freelancer roles, do a simple redirect after quick complete
  if (currentUser.role !== 'freelancer') {
    completeOnboarding({ skills: [] });
    return <Navigate to={currentUser.role === 'client' ? '/services' : '/jobs'} replace />;
  }

  // ── Progress ───────────────────────────────────────────────────────────────
  const progress = STEPS[step - 1].pct;

  // ── Navigation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    setError('');
    if (step === 1 && !data.photo)         { setError('Please upload a profile photo.'); return false; }
    if (step === 2 && !data.title.trim())  { setError('Please enter a professional title.'); return false; }
    if (step === 3 && data.skills.length === 0) { setError('Select at least one skill.'); return false; }
    if (step === 4 && !data.experience)    { setError('Please select your experience level.'); return false; }
    if (step === 6 && !data.hourlyRate)    { setError('Please enter your hourly rate.'); return false; }
    if (step === 7 && !data.availability)  { setError('Please choose your availability.'); return false; }
    if (step === 8 && !data.paymentMethod) { setError('Please choose a payment method.'); return false; }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 8) { setStep(s => s + 1); }
    else { finish(); }
  };

  const back = () => { setError(''); setStep(s => s - 1); };

  const finish = () => {
    completeOnboarding({ skills: data.skills });
    navigate('/jobs');
  };

  // ── Photo upload (preview only — no real upload in sandbox) ─────────────────
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData(d => ({ ...d, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill: string) =>
    setData(d => ({
      ...d,
      skills: d.skills.includes(skill)
        ? d.skills.filter(s => s !== skill)
        : [...d.skills, skill],
    }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen py-10 px-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Kazi<span className="text-[#0d4f47]">fy</span>
          </span>
          <p className="text-sm text-slate-500 mt-1 font-medium">Freelancer Onboarding</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
            <span>Step {step} of 8 — {STEPS[step - 1].label}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d4f47] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots at 20 / 40 / 60 / 80 / 100 */}
          <div className="flex justify-between mt-2 px-0.5">
            {[20, 40, 60, 80, 100].map(p => (
              <div key={p} className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${progress >= p ? 'bg-[#0d4f47]' : 'bg-gray-300'}`} />
                <span className="text-[9px] text-slate-400 mt-0.5">{p}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* ── STEP 1: Photo ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Profile Photo</h2>
              <p className="text-sm text-slate-500 mb-6">A clear photo helps clients trust you.</p>
              <div className="flex flex-col items-center gap-5">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-gray-200 hover:border-[#0d4f47] flex items-center justify-center cursor-pointer overflow-hidden transition group bg-gray-50"
                >
                  {data.photo
                    ? <img src={data.photo} alt="preview" className="w-full h-full object-cover" />
                    : <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#0d4f47]">
                        <Camera className="w-8 h-8" />
                        <span className="text-xs font-medium">Upload photo</span>
                      </div>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border border-gray-200 hover:border-[#0d4f47] text-slate-600 hover:text-[#0d4f47] text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  <Upload className="w-4 h-4" /> Choose Photo
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Title ─────────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Professional Title</h2>
              <p className="text-sm text-slate-500 mb-6">This is the first thing clients see about you.</p>
              <input
                type="text"
                value={data.title}
                onChange={e => setData(d => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Full-Stack Developer & UI Designer"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 focus:border-[#0d4f47] transition"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {['Full-Stack Developer', 'UI/UX Designer', 'Video Editor', 'Copywriter', 'Photographer'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => setData(d => ({ ...d, title: t }))}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-slate-600 hover:border-[#0d4f47] hover:text-[#0d4f47] transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Skills ────────────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Your Skills</h2>
              <p className="text-sm text-slate-500 mb-6">Select all that apply — you can update these later.</p>
              <div className="grid grid-cols-2 gap-2.5">
                {SKILL_OPTIONS.map(skill => {
                  const active = data.skills.includes(skill);
                  return (
                    <button
                      key={skill} type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium text-left transition ${
                        active
                          ? 'border-[#0d4f47] bg-[#0d4f47]/5 text-[#0d4f47]'
                          : 'border-gray-200 text-slate-600 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                        active ? 'bg-[#0d4f47] border-[#0d4f47]' : 'border-gray-300'
                      }`}>
                        {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: Experience ────────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Experience Level</h2>
              <p className="text-sm text-slate-500 mb-6">Be honest — clients appreciate transparency.</p>
              <div className="space-y-3">
                {[
                  { id: 'entry',  label: 'Entry Level',    sub: 'Less than 1 year of experience' },
                  { id: 'mid',    label: 'Intermediate',   sub: '1–3 years of experience' },
                  { id: 'senior', label: 'Senior',         sub: '3–5 years of experience' },
                  { id: 'expert', label: 'Expert',         sub: '5+ years of experience' },
                ].map(lvl => (
                  <button
                    key={lvl.id} type="button"
                    onClick={() => setData(d => ({ ...d, experience: lvl.id }))}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition ${
                      data.experience === lvl.id
                        ? 'border-[#0d4f47] bg-[#0d4f47]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.experience === lvl.id ? 'border-[#0d4f47]' : 'border-gray-300'
                    }`}>
                      {data.experience === lvl.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0d4f47]" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${data.experience === lvl.id ? 'text-[#0d4f47]' : 'text-slate-800'}`}>{lvl.label}</p>
                      <p className="text-xs text-slate-500">{lvl.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: Portfolio ─────────────────────────────────────────── */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Portfolio</h2>
              <p className="text-sm text-slate-500 mb-6">Link to your best work — website, Behance, GitHub, etc.</p>
              <input
                type="url"
                value={data.portfolio}
                onChange={e => setData(d => ({ ...d, portfolio: e.target.value }))}
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 focus:border-[#0d4f47] transition"
              />
              <p className="text-xs text-slate-400 mt-3">
                Don't have one yet?{' '}
                <button
                  type="button"
                  onClick={() => { setData(d => ({ ...d, portfolio: 'skip' })); setStep(s => s + 1); }}
                  className="text-[#0d4f47] font-semibold hover:underline"
                >
                  Skip for now
                </button>
              </p>
            </div>
          )}

          {/* ── STEP 6: Hourly Rate ───────────────────────────────────────── */}
          {step === 6 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Hourly Rate</h2>
              <p className="text-sm text-slate-500 mb-6">Set your starting rate in USD. You can adjust per project.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  value={data.hourlyRate}
                  onChange={e => setData(d => ({ ...d, hourlyRate: e.target.value }))}
                  placeholder="0"
                  className="w-full pl-8 pr-16 py-3.5 border border-gray-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d4f47]/30 focus:border-[#0d4f47] transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">/ hr</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['$10', '$15', '$25', '$35', '$50', '$75'].map(r => (
                  <button
                    key={r} type="button"
                    onClick={() => setData(d => ({ ...d, hourlyRate: r.replace('$', '') }))}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-slate-600 hover:border-[#0d4f47] hover:text-[#0d4f47] transition"
                  >
                    {r}/hr
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 7: Availability ──────────────────────────────────────── */}
          {step === 7 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Availability</h2>
              <p className="text-sm text-slate-500 mb-6">How many hours per week can you commit?</p>
              <div className="space-y-3">
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button
                    key={opt} type="button"
                    onClick={() => setData(d => ({ ...d, availability: opt }))}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition ${
                      data.availability === opt
                        ? 'border-[#0d4f47] bg-[#0d4f47]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      data.availability === opt ? 'border-[#0d4f47]' : 'border-gray-300'
                    }`}>
                      {data.availability === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#0d4f47]" />}
                    </div>
                    <span className={`text-sm font-semibold ${data.availability === opt ? 'text-[#0d4f47]' : 'text-slate-700'}`}>
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 8: Payment Method ────────────────────────────────────── */}
          {step === 8 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Payment Method</h2>
              <p className="text-sm text-slate-500 mb-6">How would you like to receive your earnings?</p>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_OPTIONS.map(pm => (
                  <button
                    key={pm.id} type="button"
                    onClick={() => setData(d => ({ ...d, paymentMethod: pm.id }))}
                    className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border-2 transition ${
                      data.paymentMethod === pm.id
                        ? 'border-[#0d4f47] bg-[#0d4f47]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-10 flex items-center justify-center">
                      {pm.image === 'paypal' ? (
                        <svg role="img" viewBox="0 0 24 24" className="h-8 w-8 text-[#003087]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <title>PayPal</title>
                          <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" />
                        </svg>
                      ) : (
                        <img src={pm.image} alt={pm.label} className="h-8 w-auto object-contain" />
                      )}
                    </div>
                    <span className={`text-xs font-bold text-center ${data.paymentMethod === pm.id ? 'text-[#0d4f47]' : 'text-slate-700'}`}>
                      {pm.label}
                    </span>
                    {data.paymentMethod === pm.id && (
                      <div className="w-5 h-5 rounded-full bg-[#0d4f47] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Navigation buttons ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-0 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 bg-[#0d4f47] hover:bg-[#0a3d37] text-white font-bold py-3 px-8 rounded-xl text-sm transition"
            >
              {step === 8 ? (
                <>Finish <Check className="w-4 h-4" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mt-5">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === step ? 'w-6 bg-[#0d4f47]' : s.id < step ? 'w-3 bg-[#0d4f47]/40' : 'w-3 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
