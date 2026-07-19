import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';

interface Post {
  id: string;
  category: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    id: '1',
    category: 'Platform News',
    tag: 'Announcement',
    title: 'Kazify Academy Launches Free Courses for Africa\'s Youth',
    excerpt: 'We\'re opening the doors to Kazify Academy — a free skills platform designed to help young Africans break into the professional services economy and earn on their own terms.',
    author: 'Amara Diallo',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'July 15, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    category: 'Tips & Guides',
    tag: 'For Providers',
    title: '10 Things Top-Rated Providers Do Differently on Kazify',
    excerpt: 'We analysed thousands of orders and reviews to find out what separates the 5-star sellers from the rest. Here\'s what they all have in common.',
    author: 'Kofi Mensah',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'July 10, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
  },
  {
    id: '3',
    category: 'Tips & Guides',
    tag: 'For Clients',
    title: 'How to Write a Great Job Brief That Gets Amazing Proposals',
    excerpt: 'A vague brief gets vague results. Here\'s a step-by-step guide to writing a job description that attracts the best providers on the platform.',
    author: 'Fatima Osei',
    authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: 'July 5, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },
  {
    id: '4',
    category: 'Success Stories',
    tag: 'Provider Story',
    title: 'From Odd Jobs to KSh 200K/Month: Grace\'s Kazify Journey',
    excerpt: 'Grace Wanjiru started offering basic data entry services on Kazify two years ago. Today she runs a 3-person virtual assistant agency and bills over KSh 200,000 a month.',
    author: 'Tariq Nkosi',
    authorAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    date: 'June 28, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  },
  {
    id: '5',
    category: 'Platform News',
    tag: 'Update',
    title: 'New: Instant Mobile Money Withdrawals Now Live in 12 Countries',
    excerpt: 'We\'ve expanded our instant payout feature to 12 African countries, including Tanzania, Uganda, Rwanda, Côte d\'Ivoire, and Zambia. Here\'s how to activate it.',
    author: 'Amara Diallo',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'June 20, 2025',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  },
  {
    id: '6',
    category: 'Industry Insights',
    tag: 'Research',
    title: 'The State of African Freelancing in 2025: Key Trends & Data',
    excerpt: 'Our annual report is here. We surveyed over 5,000 providers and clients to understand how the African gig economy is evolving — and what it means for you.',
    author: 'Fatima Osei',
    authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: 'June 12, 2025',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
];

const categoryColors: Record<string, string> = {
  'Platform News':     'bg-blue-100 text-blue-700',
  'Tips & Guides':     'bg-emerald-100 text-emerald-700',
  'Success Stories':   'bg-amber-100 text-amber-700',
  'Industry Insights': 'bg-violet-100 text-violet-700',
};

const allCategories = ['All', 'Platform News', 'Tips & Guides', 'Success Stories', 'Industry Insights'];

export const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = posts.find(p => p.featured);
  const filtered  = posts
    .filter(p => !p.featured)
    .filter(p => activeCategory === 'All' || p.category === activeCategory);

  return (
    <div className="flex-1 bg-white">

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0d4f47] to-slate-900 text-white py-20 px-4 text-center">
        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          📖 Kazify Blog
        </span>
        <h1 className="text-5xl font-black mb-4">Insights, Stories &amp; Guides</h1>
        <p className="text-white/70 max-w-xl mx-auto text-base">
          Tips for freelancers, stories from providers, platform updates, and the latest from Africa's fastest-growing services marketplace.
        </p>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-5">Featured Article</p>
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg flex flex-col lg:flex-row">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full lg:w-1/2 h-64 lg:h-auto object-cover"
              />
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-slate-100 text-slate-600'}`}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4 leading-tight">{featured.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={featured.authorAvatar} alt={featured.author} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{featured.author}</p>
                      <p className="text-xs text-slate-400">{featured.date}</p>
                    </div>
                  </div>
                  <Link to="/" className="inline-flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:underline">
                    Read more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog grid */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-600 border-gray-200 hover:border-primary-300'
                }`}
              >
                {cat !== 'All' && <Tag className="w-3 h-3" />}
                {cat}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map(post => (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-slate-100 text-slate-600'}`}>
                    {post.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">{post.readTime}</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-tight mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-5">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{post.author}</p>
                        <p className="text-[10px] text-slate-400">{post.date}</p>
                      </div>
                    </div>
                    <Link to="/" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-16 text-sm">No articles in this category yet. Check back soon!</p>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#0d4f47] py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-black mb-3">Never miss an article</h2>
        <p className="text-white/70 mb-8 max-w-sm mx-auto text-sm">Subscribe to the Kazify newsletter and get weekly insights delivered to your inbox.</p>
        <form className="flex max-w-md mx-auto gap-2" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2.5 rounded-full transition text-sm">
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
};
