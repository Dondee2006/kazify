export interface User {
  id: string;
  name: string;
  role: 'client' | 'freelancer' | 'student';
  country: string;
  bio: string;
  avatar: string;
  rating: number;
  joinedDate: string;
  skills?: string[];
  xp?: number;
  badges?: { id: string; name: string; icon: string }[];
  onboardingComplete?: boolean;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: 'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation';
  freelancerId: string;
  startingPrice: number;
  deliveryTime: number; // in days
  image: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
}

export interface JobRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  deliveryTime: number; // in days
  clientId: string;
  category: 'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation';
  createdAt: string;
}

export interface Order {
  id: string;
  gigId: string;
  clientId: string;
  freelancerId: string;
  amount: number;
  status: 'escrow_held' | 'in_progress' | 'pending_approval' | 'released';
  deliveryNote?: string;
  deliveryFileUrl?: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation';
  difficulty: 'Novice' | 'Intermediate' | 'Advanced';
  xpReward: number;
  badgeReward?: { id: string; name: string; icon: string };
  sponsor?: string;
  dueDate?: string;
}

// Initial mock users
export const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Koffi Mensah',
    role: 'freelancer',
    country: 'Ghana 🇬🇭',
    bio: 'Full-stack software developer with 5+ years of experience specializing in React, Next.js, Node.js, and TypeScript. Passionate about building performant SaaS solutions for African startups.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 4.9,
    joinedDate: 'Jan 2024',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'APIs']
  },
  {
    id: 'u-2',
    name: 'Chioma Nwachukwu',
    role: 'freelancer',
    country: 'Nigeria 🇳🇬',
    bio: 'Award-winning creative designer focused on brand identity, modern UX/UI design, and typography. I bring brands to life with vibrant and professional visual assets.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 4.8,
    joinedDate: 'Mar 2023',
    skills: ['Brand Identity', 'UI/UX Design', 'Figma', 'Illustrator', 'Logos']
  },
  {
    id: 'u-3',
    name: 'Boubacar Keita',
    role: 'freelancer',
    country: 'Mali 🇲🇱',
    bio: 'Professional video editor and animator. I produce high-engagement explainer videos, cinematic trailers, and social media reels that boost user conversions.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5.0,
    joinedDate: 'Jun 2024',
    skills: ['After Effects', 'Premiere Pro', '3D Animation', 'Motion Graphics']
  },
  {
    id: 'u-4',
    name: 'Amani Yusuf',
    role: 'freelancer',
    country: 'Tanzania 🇹🇿',
    bio: 'Bilingual copywriter, editor, and voiceover artist speaking fluent English and Swahili. Specializing in localization, SEO articles, and educational content.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 4.7,
    joinedDate: 'Oct 2023',
    skills: ['Swahili Translation', 'Copywriting', 'SEO Writing', 'Voiceover']
  },
  {
    id: 'u-5',
    name: 'Sarah Mwangi',
    role: 'client',
    country: 'Uganda 🇺🇬',
    bio: 'Founder of a fast-growing Agritech platform in East Africa. Always looking to collaborate with talented developers, designers, and marketers.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    rating: 4.9,
    joinedDate: 'Feb 2023'
  },
  {
    id: 'u-6',
    name: 'Tariq Osei',
    role: 'client',
    country: 'Ghana 🇬🇭',
    bio: 'Operations manager for a fintech infrastructure provider. Seeking clean, secure development integration services.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150',
    rating: 4.6,
    joinedDate: 'Dec 2023'
  },
  {
    id: 'u-7',
    name: 'David Mwangi',
    role: 'student',
    country: 'Uganda 🇺🇬',
    bio: 'Youth developer passionate about frontend web development and UI/UX design. Eager to learn React and build real-world applications.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    rating: 0,
    joinedDate: 'May 2026',
    xp: 450,
    badges: [
      { id: 'b-1', name: 'Syntax Samurai', icon: 'Code' }
    ]
  },
  {
    id: 'u-8',
    name: 'Aisha Bello',
    role: 'student',
    country: 'Nigeria 🇳🇬',
    bio: 'Aspiring digital artist and graphic designer. I love creating vector art and want to learn how to design professional brand identities.',
    avatar: 'https://images.unsplash.com/photo-1531123414708-c47fa05a2e6f?auto=format&fit=crop&q=80&w=150',
    rating: 0,
    joinedDate: 'May 2026',
    xp: 120,
    badges: []
  }
];

import { africanServices } from './africanServices';

// Initial mock gigs
export const mockGigs: Gig[] = [
  ...africanServices,
  {
    id: 'g-1',
    title: 'Modern Brand Identity & Logo Design Packages',
    description: 'Establish a memorable corporate presence with a tailored brand identity package. This gig includes logo variations, color palettes, font pairings, and a detailed 15-page brand style guide to maintain consistency. Delivered in high-resolution vector and web-ready formats.',
    category: 'Graphics & Design',
    freelancerId: 'u-2', // Chioma
    startingPrice: 500000,
    deliveryTime: 3,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    badges: ['Top Rated', 'Fast Turnaround'],
    rating: 4.8,
    reviewsCount: 34
  },
  {
    id: 'g-2',
    title: 'Custom Next.js Web Application & SaaS Development',
    description: 'Get a clean, modern, and production-ready web application built using Next.js 14, TypeScript, and Tailwind CSS. I will wire up responsive frontends, implement robust server-side data loading, and integrate APIs with smooth visual transitions. Full SEO audit included.',
    category: 'Programming & IT',
    freelancerId: 'u-1', // Koffi
    startingPrice: 1000000,
    deliveryTime: 7,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    badges: ['Verified Pro', 'Secure Architecture'],
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: 'g-3',
    title: 'Cinematic Explainer Video & 2D Motion Graphics',
    description: 'Looking to boost your conversions? I will create a compelling, professionally animated explainer video from script to final output. Includes professional voiceover sync, background sound effects, custom character illustrations, and storyboards for approval.',
    category: 'Video & Animation',
    freelancerId: 'u-3', // Boubacar
    startingPrice: 250000,
    deliveryTime: 5,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    badges: ['Animation Expert', 'High Conversion'],
    rating: 5.0,
    reviewsCount: 12
  },
  {
    id: 'g-4',
    title: 'English to Swahili Professional Localization & Translation',
    description: 'Reach millions of Swahili speakers in East Africa with fully localized copy. I provide context-aware, manual translation for web copy, mobile application strings, legal documents, and marketing campaigns. No machine translation guarantee.',
    category: 'Writing & Translation',
    freelancerId: 'u-4', // Amani
    startingPrice: 10000,
    deliveryTime: 2,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    badges: ['Native Swahili', 'SEO Optimized'],
    rating: 4.7,
    reviewsCount: 42
  },
  {
    id: 'g-5',
    title: 'RESTful API Integration & Backend Scripting (Python / Node.js)',
    description: 'Secure, clean, and well-commented server scripts to automate your data flows. I will integrate standard RESTful APIs (Stripe, Paypal, Paystack, Twilio, Salesforce), implement webhook endpoints, and orchestrate server tasks on AWS or digitalocean.',
    category: 'Programming & IT',
    freelancerId: 'u-1', // Koffi
    startingPrice: 750000,
    deliveryTime: 4,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    badges: ['API Specialist'],
    rating: 4.9,
    reviewsCount: 8
  }
];

// Initial mock job requests/shoutouts
export const mockJobRequests: JobRequest[] = [
  {
    id: 'jr-1',
    title: 'Agritech App Logo & Visual Assets Needed',
    description: 'We need an modern, organic, and tech-forward logo for our digital farming co-op platform. Needs to look clean in both mobile headers and printed canvas sacks. Deliverables include Figma layout files, SVG outputs, and primary brand assets.',
    budget: 350000,
    deliveryTime: 4,
    clientId: 'u-5', // Sarah Mwangi
    category: 'Graphics & Design',
    createdAt: '2026-05-26T15:30:00Z'
  },
  {
    id: 'jr-2',
    title: 'Setup Webhooks & Payment Gateway for Fintech Platform',
    description: 'Looking for a backend developer to integrate Paystack webhooks with our subscription flow. Must write clean TypeScript middleware to securely verify hook signatures and update user tokens in a PostgreSQL database. Urgent task!',
    budget: 150000,
    deliveryTime: 2,
    clientId: 'u-6', // Tariq Osei
    category: 'Programming & IT',
    createdAt: '2026-05-27T08:15:00Z'
  }
];

// Initial mock escrow orders
export const mockOrders: Order[] = [
  {
    id: 'o-101',
    gigId: 'g-1',
    clientId: 'u-5',
    freelancerId: 'u-2',
    amount: 500000,
    status: 'escrow_held',
    updatedAt: '2026-05-27T10:00:00Z'
  }
];

// Initial mock challenges for Academy
export const mockChallenges: Challenge[] = [
  {
    id: 'c-1',
    title: 'Fix React State Bug',
    description: 'A component is not re-rendering when the user clicks a button. Identify the issue with how useState is being used and submit the fixed code snippet.',
    category: 'Programming & IT',
    difficulty: 'Novice',
    xpReward: 100,
    badgeReward: { id: 'b-2', name: 'Bug Squasher', icon: 'Bug' },
    sponsor: 'Kazify Engineering'
  },
  {
    id: 'c-2',
    title: 'Design a Local Bakery Logo',
    description: 'Create a modern, scalable vector logo for "Sunrise Bakery". Deliverables should include an SVG file and a mock-up on a paper bag.',
    category: 'Graphics & Design',
    difficulty: 'Intermediate',
    xpReward: 250,
    badgeReward: { id: 'b-3', name: 'Pixel Perfect', icon: 'PenTool' },
    sponsor: 'Sunrise Bakery (Community Client)',
    dueDate: '2026-06-15T00:00:00Z'
  },
  {
    id: 'c-3',
    title: 'Write a SEO Blog Post intro',
    description: 'Draft a 150-word introduction for a blog post about "The Future of Remote Work in Africa" targeting keyword density and reader engagement.',
    category: 'Writing & Translation',
    difficulty: 'Novice',
    xpReward: 50
  }
];
