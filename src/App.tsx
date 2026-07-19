import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { OrderProvider } from './context/OrderContext';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/Navbar';
import { LandingHome } from './pages/LandingHome';
import { GigDetail } from './pages/GigDetail';
import { OrderSimulation } from './pages/OrderSimulation';
import { Join } from './pages/Join';
import { Onboarding } from './pages/Onboarding';
import { AcademyDashboard } from './pages/AcademyDashboard';
import { ClientMarketplace } from './pages/ClientMarketplace';
import { Signup } from './pages/Signup';
import { FreelancerJobs } from './pages/FreelancerJobs';
import { StudentMarketing } from './pages/StudentMarketing';
import { AuthCallback } from './pages/AuthCallback';
import { Inbox } from './pages/Inbox';
import { ProvidersPage } from './pages/ProvidersPage';
import { AboutPage } from './pages/AboutPage';
import { ScrollToTop } from './components/ScrollToTop';
import { RoleGuard } from './components/RoleGuard';
import { CareersPage } from './pages/CareersPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { BlogPage } from './pages/BlogPage';
import {
  Heart, ShieldCheck, Lock, Star, ArrowRight,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
} from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <MarketplaceProvider>
          <OrderProvider>
            <ChatProvider>

              <div className="flex flex-col min-h-screen bg-slate-50">

                {/* ── NAVBAR ───────────────────────────────────────── */}
                <Navbar />

                {/* ── ROUTES ───────────────────────────────────────── */}
                <ScrollToTop />
              <div className="flex-1 flex flex-col">
                  <Routes>
                    {/* Core app routes */}
                    <Route path="/"              element={<LandingHome />} />
                    <Route path="/gig/:id"       element={<GigDetail />} />
                    <Route path="/order/:id"     element={<OrderSimulation />} />
                    <Route path="/join"          element={<Join />} />
                    <Route path="/onboarding"    element={<Onboarding />} />
                    <Route path="/academy"       element={<RoleGuard allow={['student', 'freelancer', 'client']}><AcademyDashboard /></RoleGuard>} />
                    <Route path="/services"      element={<ClientMarketplace />} />
                    <Route path="/signup"        element={<Signup />} />
                    <Route path="/jobs"          element={<RoleGuard allow={['freelancer']} redirectTo="/join"><FreelancerJobs /></RoleGuard>} />
                    <Route path="/student-mode"  element={<StudentMarketing />} />
                    <Route path="/inbox"         element={<RoleGuard allow={['client', 'freelancer', 'student']}><Inbox /></RoleGuard>} />
                    <Route path="/providers"     element={<ProvidersPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    {/* Footer pages */}
                    <Route path="/about"         element={<AboutPage />} />
                    <Route path="/careers"       element={<CareersPage />} />
                    <Route path="/blog"          element={<BlogPage />} />
                    <Route path="/how-it-works"  element={<HowItWorksPage />} />
                    <Route path="/help"          element={<HelpPage />} />
                    <Route path="/privacy"       element={<PrivacyPage />} />
                    <Route path="/terms"         element={<TermsPage />} />
                  </Routes>
                </div>

                {/* ── FOOTER ───────────────────────────────────────── */}
                <footer className="bg-slate-900 text-slate-400">

                  {/* Newsletter strip */}
                  <div className="border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">Stay in the loop</h3>
                        <p className="text-slate-400 text-sm">Latest jobs, gigs, and marketplace news — straight to your inbox.</p>
                      </div>
                      <form className="flex w-full max-w-md gap-2" onSubmit={e => e.preventDefault()}>
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="submit"
                          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition"
                        >
                          Subscribe <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Main 5-column grid */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-left">

                      {/* Brand — spans 2 cols */}
                      <div className="lg:col-span-2 space-y-5">
                        <Link to="/" className="inline-block">
                          <span className="text-2xl font-black tracking-tight text-white">
                            Kazi<span className="text-primary-500">fy</span>
                          </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                          Africa's premium freelance escrow marketplace. Connecting global clients with digital, creative, and professional service specialists across the continent.
                        </p>
                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { icon: <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />, label: 'Secure Escrow Payments' },
                            { icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />,         label: 'SSL Protected' },
                            { icon: <Star className="w-3.5 h-3.5 text-amber-400" />,           label: 'Top Rated Platform' },
                          ].map(({ icon, label }) => (
                            <span key={label} className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
                              {icon} {label}
                            </span>
                          ))}
                        </div>
                        {/* Social links */}
                        <div className="flex items-center gap-3 pt-1">
                          {[
                            { icon: <Facebook className="w-4 h-4" />,  label: 'Facebook' },
                            { icon: <Twitter className="w-4 h-4" />,   label: 'Twitter' },
                            { icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                            { icon: <Linkedin className="w-4 h-4" />,  label: 'LinkedIn' },
                            { icon: <Youtube className="w-4 h-4" />,   label: 'YouTube' },
                          ].map(({ icon, label }) => (
                            <a
                              key={label}
                              href="#"
                              aria-label={label}
                              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 hover:bg-primary-600/20 transition"
                            >
                              {icon}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* For Clients */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">For Clients</h4>
                        <ul className="space-y-2.5 text-sm">
                          {[
                            { label: 'Browse Services',     path: '/services' },
                            { label: 'Browse Providers',    path: '/providers' },
                            { label: 'Post a Job Request',  path: '/services' },
                            { label: 'How It Works',        path: '/how-it-works' },
                            { label: 'Help & Support',      path: '/help' },
                          ].map(({ label, path }) => (
                            <li key={label}>
                              <Link to={path} className="hover:text-white transition-colors duration-150">{label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* For Freelancers */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">For Freelancers</h4>
                        <ul className="space-y-2.5 text-sm">
                          {[
                            { label: 'Join as a Provider',   path: '/join' },
                            { label: 'Find Jobs',            path: '/jobs' },
                            { label: 'Freelancer Dashboard', path: '/jobs' },
                            { label: 'Kazify Academy',       path: '/student-mode' },
                            { label: 'How It Works',         path: '/how-it-works' },
                          ].map(({ label, path }) => (
                            <li key={label}>
                              <Link to={path} className="hover:text-white transition-colors duration-150">{label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Company */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Company</h4>
                        <ul className="space-y-2.5 text-sm">
                          {[
                            { label: 'About Kazify',    path: '/about' },
                            { label: 'Careers',         path: '/careers' },
                            { label: 'Blog',            path: '/blog' },
                            { label: 'Help & Support',  path: '/help' },
                            { label: 'Privacy Policy',  path: '/privacy' },
                            { label: 'Terms of Service',path: '/terms' },
                          ].map(({ label, path }) => (
                            <li key={label}>
                              <Link to={path} className="hover:text-white transition-colors duration-150">{label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                      <p>© {new Date().getFullYear()} Kazify Technologies Ltd. All rights reserved.</p>
                      <p className="flex items-center gap-1.5">
                        Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Africa's skilled workforce.
                      </p>
                      <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
                        <Link to="/terms"   className="hover:text-slate-300 transition">Terms</Link>
                        <Link to="/help"    className="hover:text-slate-300 transition">Cookies</Link>
                      </div>
                    </div>
                  </div>

                </footer>

              </div>
            </ChatProvider>
          </OrderProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
