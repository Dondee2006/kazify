import React, { useState } from 'react';
import { Search, MessageCircle, ShieldCheck, CreditCard, User, Package, ChevronDown, ChevronUp, ArrowRight, Mail, Phone } from 'lucide-react';

const categories = [
  {
    icon: <User className="w-5 h-5 text-primary-500" />,
    title: 'Account & Profile',
    faqs: [
      { q: 'How do I create a Kazify account?', a: 'Click "Get Started" or "Sign Up" in the top navigation. Fill in your name, email, and a secure password. You\'ll receive a verification email — click the link to activate your account.' },
      { q: 'How do I update my profile information?', a: 'Go to your Dashboard → Settings → Profile. You can update your name, bio, profile photo, skills, and portfolio from there.' },
      { q: 'I forgot my password. How do I reset it?', a: 'Click "Sign In" then "Forgot Password?". Enter your registered email and we\'ll send a password reset link within 2 minutes.' },
      { q: 'Can I have both a client and provider account?', a: 'Yes! You can switch roles within the same account. Go to Settings → Account Type to toggle between client and provider modes.' },
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
    title: 'Payments & Escrow',
    faqs: [
      { q: 'How does escrow payment work on Kazify?', a: 'When you place an order, your payment is held securely in our escrow system. The money is only released to the provider after you confirm that the work meets your requirements. This protects both parties.' },
      { q: 'What payment methods are accepted?', a: 'We accept M-Pesa, Airtel Money, card payments (Visa/Mastercard), and bank transfers. More payment methods are added regularly by country.' },
      { q: 'How long does it take to receive a payout?', a: 'Once a client approves delivery, funds are released to your wallet within 24 hours. Withdrawals to mobile money are instant; bank transfers take 1-3 business days.' },
      { q: 'What happens if there\'s a dispute over payment?', a: 'Open a dispute from your Order page within 3 days of delivery. Our Trust & Safety team reviews both sides and mediates a fair resolution within 72 hours.' },
    ],
  },
  {
    icon: <Package className="w-5 h-5 text-violet-500" />,
    title: 'Orders & Delivery',
    faqs: [
      { q: 'How do I place an order?', a: 'Browse the Services marketplace, find a gig you like, click "Order Now", review the package details, and confirm your payment. The provider is notified instantly.' },
      { q: 'What if the provider misses a deadline?', a: 'You can request a revision, extend the deadline, or open a dispute. Kazify\'s system automatically flags late deliveries and notifies our support team.' },
      { q: 'Can I cancel an order?', a: 'Orders can be cancelled before a provider starts work with a full refund. After work begins, cancellations are handled on a case-by-case basis through our dispute process.' },
      { q: 'How many revisions can I request?', a: 'The number of included revisions is specified in each service listing. Additional revisions may be available at an extra fee, as agreed with the provider.' },
    ],
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
    title: 'Trust & Safety',
    faqs: [
      { q: 'How are providers verified on Kazify?', a: 'Every provider goes through an identity verification process including phone number, email, and ID document review. Top-rated providers receive an additional "Verified Pro" badge.' },
      { q: 'How do I report a fraudulent user?', a: 'Go to the user\'s profile and click the "Report" flag icon. You can also email safety@kazify.com. We investigate all reports within 24 hours.' },
      { q: 'Is my personal information safe?', a: 'Yes. Kazify uses industry-standard SSL encryption for all data in transit and at rest. We never sell your personal data to third parties. See our Privacy Policy for full details.' },
      { q: 'What happens to a provider who delivers poor quality work?', a: 'Clients can leave honest reviews and raise disputes. Providers with persistent low ratings or unresolved disputes are suspended or removed from the platform.' },
    ],
  },
];

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredFaqs = categories[activeCategory].faqs.filter(
    faq => !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4f47] to-slate-900 py-20 px-4 text-center text-white">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">How can we help you?</h1>
        <p className="text-white/70 mb-8 text-lg">Search our knowledge base or browse by category below.</p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-full pl-12 pr-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-xl"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map(({ icon, title }, idx) => (
              <button
                key={title}
                onClick={() => { setActiveCategory(idx); setOpenFaq(null); }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition ${
                  activeCategory === idx
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-700 border-gray-200 hover:border-primary-300'
                }`}
              >
                {icon} {title}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-slate-400 py-12">No results found. Try a different search term.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.q} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  >
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                    {openFaq === faq.q ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {openFaq === faq.q && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className="text-sm text-slate-600 leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Still need help?</h2>
          <p className="text-slate-500 mb-10 text-sm">Our support team is available Monday–Friday, 8am–6pm (EAT).</p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <MessageCircle className="w-6 h-6 text-primary-500" />, title: 'Live Chat', sub: 'Chat with us in-app', action: 'Start Chat', href: '#' },
              { icon: <Mail className="w-6 h-6 text-emerald-500" />, title: 'Email Support', sub: 'support@kazify.com', action: 'Send Email', href: 'mailto:support@kazify.com' },
              { icon: <Phone className="w-6 h-6 text-violet-500" />, title: 'Phone Support', sub: '+254 700 000 000', action: 'Call Us', href: 'tel:+254700000000' },
            ].map(({ icon, title, sub, action, href }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center mb-4 mx-auto">{icon}</div>
                <p className="font-bold text-slate-900 mb-1">{title}</p>
                <p className="text-xs text-slate-400 mb-4">{sub}</p>
                <a href={href} className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:underline">
                  {action} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
