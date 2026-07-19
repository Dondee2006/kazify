import React from 'react';
import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    id: 'collection',
    title: '1. Information We Collect',
    content: [
      'When you register on Kazify, we collect your name, email address, phone number, and payment details necessary to operate your account.',
      'When you use our services, we automatically collect usage data including pages visited, gigs viewed, search queries, device type, IP address, browser type, and session duration.',
      'If you verify your identity as a provider, we collect government-issued ID documents. These are stored securely, encrypted at rest, and never shared with other users.',
      'We may collect location data (country/city level) to match you with local service providers and to comply with regional regulations.',
    ],
  },
  {
    id: 'use',
    title: '2. How We Use Your Information',
    content: [
      'To create and manage your Kazify account and provide you with our marketplace services.',
      'To process orders and payments securely through our escrow system.',
      'To personalise your experience — recommending relevant services, providers, and jobs based on your activity.',
      'To communicate with you: order updates, support replies, platform announcements, and (if you opt in) marketing emails.',
      'To detect, prevent, and investigate fraud, abuse, and violations of our Terms of Service.',
      'To improve our platform through analytics, A/B testing, and user research (using anonymised or aggregated data).',
    ],
  },
  {
    id: 'sharing',
    title: '3. How We Share Your Information',
    content: [
      'We do NOT sell your personal data to third parties.',
      'We share only the information necessary to fulfil a service: your display name, country, and avatar are visible to other users. Your contact details are only shared with providers once an order is placed.',
      'We use trusted third-party service providers (e.g., payment processors, cloud hosting, analytics tools) who are bound by strict data processing agreements.',
      'We may disclose information if required by law, court order, or to protect the rights, safety, and property of Kazify or its users.',
    ],
  },
  {
    id: 'escrow',
    title: '4. Payment & Escrow Data',
    content: [
      'Payment card details are processed by our PCI-DSS compliant payment partner. Kazify never stores your raw card numbers.',
      'Mobile money transactions (M-Pesa, Airtel Money, etc.) are processed through licensed payment aggregators in each operating country.',
      'Escrow transaction records are retained for 7 years to meet financial regulatory requirements.',
    ],
  },
  {
    id: 'retention',
    title: '5. Data Retention',
    content: [
      'We retain your account data for as long as your account is active, plus 2 years after account deletion (to comply with legal obligations).',
      'Order records and transaction history are retained for 7 years.',
      'You may request deletion of your personal data at any time by contacting privacy@kazify.com. Certain data may be retained if required by law.',
    ],
  },
  {
    id: 'rights',
    title: '6. Your Rights',
    content: [
      'Access: You may request a copy of all personal data we hold about you.',
      'Correction: You may request that we correct any inaccurate data.',
      'Deletion: You may request that we delete your data (subject to legal retention obligations).',
      'Portability: You may request your data in a machine-readable format.',
      'Opt-out: You may opt out of marketing communications at any time via the unsubscribe link in emails or under Account Settings.',
      'To exercise any of these rights, email privacy@kazify.com. We respond within 30 days.',
    ],
  },
  {
    id: 'cookies',
    title: '7. Cookies & Tracking',
    content: [
      'We use essential cookies to keep you logged in and remember your preferences.',
      'We use analytics cookies (e.g., Google Analytics) to understand how users navigate the platform. This data is anonymised.',
      'You can manage cookie preferences from your browser settings or by clicking "Cookie Settings" in the footer.',
    ],
  },
  {
    id: 'security',
    title: '8. Security',
    content: [
      'All data in transit is protected by TLS 1.3 encryption (HTTPS).',
      'Data at rest is encrypted using AES-256.',
      'We conduct regular security audits and penetration tests.',
      'In the event of a data breach that affects your personal data, we will notify you within 72 hours as required by applicable data protection laws.',
    ],
  },
  {
    id: 'children',
    title: '9. Children\'s Privacy',
    content: [
      'Kazify is not intended for users under the age of 18. We do not knowingly collect personal data from minors.',
      'If you believe a minor has created an account on our platform, please contact support@kazify.com and we will promptly delete the account.',
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page.',
      'For material changes, we will notify you via email or an in-app notification at least 14 days before the change takes effect.',
      'Continued use of Kazify after the effective date constitutes your acceptance of the updated policy.',
    ],
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: [
      'If you have any questions about this Privacy Policy or how we handle your data, please contact our Data Protection Officer:',
      'Email: privacy@kazify.com',
      'Kazify Technologies Ltd, P.O. Box 12345, Kampala, Uganda.',
    ],
  },
];

export const PrivacyPage: React.FC = () => (
  <div className="flex-1 bg-white">

    {/* Header */}
    <section className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-7 h-7 text-primary-400" />
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">Your Privacy Matters</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Privacy Policy</h1>
        <p className="text-white/60 text-sm">Last updated: 1 July 2025 · Effective: 1 July 2025</p>
        <p className="text-white/75 mt-4 text-base leading-relaxed max-w-xl">
          Kazify Technologies Ltd ("Kazify", "we", "us") is committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.
        </p>
      </div>
    </section>

    {/* Body */}
    <section className="py-14 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Quick nav */}
        <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Contents</p>
          <ul className="space-y-1.5">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-primary-600 hover:underline">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map(s => (
            <div key={s.id} id={s.id}>
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-2 border-b border-gray-100">{s.title}</h2>
              <ul className="space-y-3">
                {s.content.map((line, i) => (
                  <li key={i} className="text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-slate-100">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

  </div>
);
