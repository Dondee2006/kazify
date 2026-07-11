import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { HelpCircle, ShieldCheck, Heart } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <MarketplaceProvider>
          <OrderProvider>
            <ChatProvider>
              
              {/* Main Flex App Container */}
              <div className="flex flex-col min-h-screen bg-slate-50">
                
                {/* Header Navigation */}
                <Navbar />

                {/* Main Routing Screen */}
                <div className="flex-1 flex flex-col">
                  <Routes>
                    <Route path="/" element={<LandingHome />} />
                    <Route path="/gig/:id" element={<GigDetail />} />
                    <Route path="/order/:id" element={<OrderSimulation />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/academy" element={<AcademyDashboard />} />
                    <Route path="/services" element={<ClientMarketplace />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/jobs" element={<FreelancerJobs />} />
                    <Route path="/student-mode" element={<StudentMarketing />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/providers" element={<ProvidersPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                  </Routes>
                </div>

              {/* Shared Site Footer */}
              <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {/* Brand column */}
                    <div className="space-y-3">
                      <span className="text-xl font-black font-display tracking-tight text-white">
                        Kazi<span className="text-primary-500">fy</span>
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                        Scaffolded baseline architecture representing Upkazi's premium freelance escrow marketplace. Connecting global clients with African tech and creative specialists.
                      </p>
                    </div>

                    {/* Quick navigation */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Simulated Entities</h4>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <span className="hover:text-white transition cursor-help flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" /> Vetted Freelancers
                          </span>
                        </li>
                        <li>
                          <span className="hover:text-white transition cursor-help flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" /> Escrow Protections
                          </span>
                        </li>
                        <li>
                          <span className="hover:text-white transition cursor-help flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-primary-400" /> Multi-Persona Switcher
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Developer note */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Architecture Mode</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        This is a client-side sandbox clone. All databases, order status changes, and user switches are stored in <span className="font-semibold text-slate-300">localStorage</span> and run entirely in-browser.
                      </p>
                    </div>
                  </div>

                  {/* Copyright & credit */}
                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-left">
                    <p>© 2026 Kazify Freelance Marketplace. Created as a clean architecture baseline.</p>
                    <p className="flex items-center gap-1">
                      Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Africa's tech workforce.
                    </p>
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
