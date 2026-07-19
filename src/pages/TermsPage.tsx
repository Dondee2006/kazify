import React from 'react';
import { FileText } from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using Kazify ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Platform.',
      'These Terms constitute a legally binding agreement between you and Kazify Technologies Ltd, a company registered in Uganda.',
      'We reserve the right to update these Terms at any time. Continued use of the Platform after any changes constitutes your acceptance of the new Terms.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: [
      'You must be at least 18 years old to use Kazify. By using our Platform, you represent that you meet this requirement.',
      'You must provide accurate and complete information when creating your account. Impersonation or providing false information is prohibited and may result in immediate account suspension.',
      'Kazify reserves the right to refuse service to anyone for any reason at its sole discretion.',
    ],
  },
  {
    id: 'accounts',
    title: '3. Accounts & Profiles',
    content: [
      'You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.',
      'You must notify Kazify immediately of any unauthorised use of your account by emailing support@kazify.com.',
      'Each person may maintain only one account. Duplicate accounts may be suspended without notice.',
      'Kazify may suspend or terminate accounts that violate these Terms, are inactive for more than 12 months, or engage in fraudulent activity.',
    ],
  },
  {
    id: 'marketplace',
    title: '4. Marketplace Rules',
    content: [
      'Providers may offer services ("gigs") in any lawful category. Kazify reserves the right to remove any service listing that violates these Terms or applicable law.',
      'Clients may search for, browse, and order services. By placing an order, you agree to pay the listed price plus any applicable platform fee.',
      'All communication between clients and providers must happen through Kazify\'s messaging system. Attempting to take transactions off-platform is prohibited.',
      'Prohibited services include: illegal content, adult content, counterfeit goods, services that facilitate fraud, spam, or any form of harassment.',
      'Kazify is not responsible for the quality, legality, or delivery of services offered by providers. However, we do provide a dispute resolution process.',
    ],
  },
  {
    id: 'escrow',
    title: '5. Escrow & Payments',
    content: [
      'When a client places an order, payment is held in Kazify\'s escrow account. Funds are released to the provider only after the client approves the delivery.',
      'Kazify charges a platform service fee of 10% on each transaction, deducted from the provider\'s payout. This fee is non-refundable once the order is completed.',
      'If a client does not respond to a delivery within 3 days of submission, the order is automatically marked as complete and funds are released.',
      'Refunds are issued at Kazify\'s discretion following a dispute review process. Approved refunds are processed within 5-10 business days.',
    ],
  },
  {
    id: 'disputes',
    title: '6. Disputes & Resolution',
    content: [
      'Either party may open a dispute within 3 days of a delivery being submitted. Disputes must be raised through the Order page — not via email.',
      'Kazify\'s Trust & Safety team will review the case, request evidence from both parties, and issue a decision within 72 hours.',
      'Kazify\'s decision is final. By using the Platform, you agree to be bound by the outcome of our dispute resolution process.',
      'Repeated frivolous disputes may result in account suspension.',
    ],
  },
  {
    id: 'ip',
    title: '7. Intellectual Property',
    content: [
      'Providers retain ownership of all work created until full payment is released from escrow. Upon payment release, all intellectual property rights transfer to the client, unless otherwise agreed in writing.',
      'The Kazify brand, logo, platform code, and all associated intellectual property belong exclusively to Kazify Technologies Ltd.',
      'Users may not copy, reproduce, or redistribute any content from the Platform without written permission.',
    ],
  },
  {
    id: 'conduct',
    title: '8. Prohibited Conduct',
    content: [
      'Harassing, threatening, or abusing other users in any way.',
      'Posting false or misleading reviews.',
      'Spamming other users with unsolicited messages.',
      'Attempting to circumvent Kazify\'s payment system or take transactions off-platform.',
      'Using automated bots or scrapers on the Platform.',
      'Engaging in any activity that disrupts or interferes with the Platform\'s normal operation.',
    ],
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: [
      'Kazify provides the Platform "as is" without warranties of any kind, express or implied.',
      'To the maximum extent permitted by law, Kazify shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.',
      'Our total liability in any dispute shall not exceed the total fees paid by you to Kazify in the 3 months preceding the claim.',
    ],
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: [
      'You may delete your account at any time from Account Settings. Pending escrow funds will be released or refunded according to their respective order status.',
      'Kazify may suspend or terminate your account immediately, without notice, for any violation of these Terms.',
      'Upon termination, your right to access the Platform ceases immediately. Provisions relating to intellectual property, disputes, and limitation of liability survive termination.',
    ],
  },
  {
    id: 'governing',
    title: '11. Governing Law',
    content: [
      'These Terms are governed by the laws of Uganda. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Kampala, Uganda.',
      'If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.',
    ],
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: [
      'For any questions regarding these Terms, please contact: legal@kazify.com',
      'Kazify Technologies Ltd, P.O. Box 12345, Kampala, Uganda.',
    ],
  },
];

export const TermsPage: React.FC = () => (
  <div className="flex-1 bg-white">

    {/* Header */}
    <section className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-7 h-7 text-primary-400" />
          <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest">Legal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Terms of Service</h1>
        <p className="text-white/60 text-sm">Last updated: 1 July 2025 · Effective: 1 July 2025</p>
        <p className="text-white/75 mt-4 text-base leading-relaxed max-w-xl">
          Please read these Terms carefully before using Kazify. They govern your access to and use of our marketplace platform.
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
