import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockGigs, mockJobRequests, mockUsers } from '../data/mockData';

export type CategoryType = 'Graphics & Design' | 'Programming & IT' | 'Writing & Translation' | 'Video & Animation';

export interface User {
  id: string;
  name: string;
  avatar: string;
  country: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  freelancerId: string;
  startingPrice: number;
  deliveryTime: number;
  image: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
  createdAt?: string;
}

export interface JobRequest {
  id: string;
  title: string;
  description: string;
  budget: number;
  deliveryTime: number;
  clientId: string;
  category: CategoryType;
  createdAt: string;
}

export interface Bid {
  id: string;
  shoutoutId: string;
  freelancerId: string;
  amount: number;
  deliveryTime: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  gigId: string;
  clientId: string;
  freelancerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  client?: any; // To store joined profile data
}

interface MarketplaceContextType {
  gigs: Gig[];
  shoutouts: JobRequest[];
  bids: Bid[];
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  addShoutout: (title: string, description: string, budget: number, deliveryTime: number, clientId: string, category: string) => Promise<void>;
  addGig: (title: string, description: string, category: string, startingPrice: number, deliveryTime: number, freelancerId: string) => Promise<void>;
  placeBid: (shoutoutId: string, freelancerId: string, amount: number, deliveryTime: number, proposal: string) => Promise<void>;
  acceptBid: (bidId: string) => Promise<void>;
  submitReview: (orderId: string, gigId: string, clientId: string, freelancerId: string, rating: number, comment: string) => Promise<void>;
  getReviewsForGig: (gigId: string) => Promise<Review[]>;
  filteredGigs: Gig[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [shoutouts, setShoutouts] = useState<JobRequest[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchMarketplaceData = async () => {
    if (!isSupabaseConfigured) {
      const storedGigs = localStorage.getItem('kazify_mock_gigs');
      if (storedGigs) {
        setGigs(JSON.parse(storedGigs));
      } else {
        setGigs(mockGigs as any[]);
        localStorage.setItem('kazify_mock_gigs', JSON.stringify(mockGigs));
      }

      const storedShoutouts = localStorage.getItem('kazify_mock_shoutouts');
      if (storedShoutouts) {
        setShoutouts(JSON.parse(storedShoutouts));
      } else {
        setShoutouts(mockJobRequests as any[]);
        localStorage.setItem('kazify_mock_shoutouts', JSON.stringify(mockJobRequests));
      }

      const storedBids = localStorage.getItem('kazify_mock_bids');
      if (storedBids) {
        setBids(JSON.parse(storedBids));
      } else {
        setBids([]);
        localStorage.setItem('kazify_mock_bids', JSON.stringify([]));
      }
      return;
    }

    const { data: gigsData, error: gigsError } = await supabase
      .from('gigs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!gigsError && gigsData) {
      setGigs(gigsData.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        freelancerId: g.freelancer_id,
        startingPrice: g.starting_price,
        deliveryTime: g.delivery_time,
        image: g.image,
        badges: g.badges || [],
        rating: g.rating,
        reviewsCount: g.reviews_count,
        createdAt: g.created_at
      })));
    }

    const { data: shoutoutsData, error: shoutoutsError } = await supabase
      .from('shoutouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!shoutoutsError && shoutoutsData) {
      setShoutouts(shoutoutsData.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        budget: s.budget,
        deliveryTime: s.delivery_time,
        clientId: s.client_id,
        category: s.category,
        createdAt: s.created_at
      })));
    }

    const { data: bidsData, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .order('created_at', { ascending: false });

    if (!bidsError && bidsData) {
      setBids(bidsData.map(b => ({
        id: b.id,
        shoutoutId: b.shoutout_id,
        freelancerId: b.freelancer_id,
        amount: b.amount,
        deliveryTime: b.delivery_time,
        proposal: b.proposal,
        status: b.status,
        createdAt: b.created_at
      })));
    }
  };

  useEffect(() => {
    fetchMarketplaceData();

    // Listen for custom data sync events within the same tab
    const handleCustomUpdate = () => {
      fetchMarketplaceData();
    };
    window.addEventListener('kazify_data_update', handleCustomUpdate);

    if (!isSupabaseConfigured) {
      return () => {
        window.removeEventListener('kazify_data_update', handleCustomUpdate);
      };
    }

    const gigsSubscription = supabase.channel('gigs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, () => {
        fetchMarketplaceData();
      })
      .subscribe();

    const shoutoutsSubscription = supabase.channel('shoutouts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shoutouts' }, () => {
        fetchMarketplaceData();
      })
      .subscribe();

    const bidsSubscription = supabase.channel('bids-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, () => {
        fetchMarketplaceData();
      })
      .subscribe();

    return () => {
      window.removeEventListener('kazify_data_update', handleCustomUpdate);
      supabase.removeChannel(gigsSubscription);
      supabase.removeChannel(shoutoutsSubscription);
      supabase.removeChannel(bidsSubscription);
    };
  }, []);

  const addShoutout = async (
    title: string,
    description: string,
    budget: number,
    deliveryTime: number,
    clientId: string,
    category: string
  ) => {
    if (!isSupabaseConfigured) {
      const newShoutout: JobRequest = {
        id: `jr-${Date.now()}`,
        title,
        description,
        budget,
        deliveryTime,
        clientId,
        category: category as CategoryType,
        createdAt: new Date().toISOString()
      };
      const updated = [newShoutout, ...shoutouts];
      setShoutouts(updated);
      localStorage.setItem('kazify_mock_shoutouts', JSON.stringify(updated));
      window.dispatchEvent(new Event('kazify_data_update'));
      return;
    }

    const { error } = await supabase.from('shoutouts').insert({
      title,
      description,
      budget,
      delivery_time: deliveryTime,
      client_id: clientId,
      category
    });

    if (error) {
      console.error('Error adding shoutout:', error);
    } else {
      fetchMarketplaceData();
    }
  };

  const addGig = async (
    title: string,
    description: string,
    category: string,
    startingPrice: number,
    deliveryTime: number,
    freelancerId: string
  ) => {
    if (!isSupabaseConfigured) {
      const newGig: Gig = {
        id: `g-${Date.now()}`,
        title,
        description,
        category: category as CategoryType,
        freelancerId,
        startingPrice,
        deliveryTime,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
        badges: ['New Talent'],
        rating: 5.0,
        reviewsCount: 0
      };
      const updated = [newGig, ...gigs];
      setGigs(updated);
      localStorage.setItem('kazify_mock_gigs', JSON.stringify(updated));
      window.dispatchEvent(new Event('kazify_data_update'));
      return;
    }

    const { error } = await supabase.from('gigs').insert({
      title,
      description,
      category,
      freelancer_id: freelancerId,
      starting_price: startingPrice,
      delivery_time: deliveryTime,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      badges: ['New Talent'],
      rating: 5.0,
      reviews_count: 0
    });

    if (error) {
      console.error('Error adding gig:', error);
    } else {
      fetchMarketplaceData();
    }
  };

  const placeBid = async (
    shoutoutId: string,
    freelancerId: string,
    amount: number,
    deliveryTime: number,
    proposal: string
  ) => {
    if (!isSupabaseConfigured) {
      const newBid: Bid = {
        id: `b-${Date.now()}`,
        shoutoutId,
        freelancerId,
        amount,
        deliveryTime,
        proposal,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const updated = [newBid, ...bids];
      setBids(updated);
      localStorage.setItem('kazify_mock_bids', JSON.stringify(updated));
      window.dispatchEvent(new Event('kazify_data_update'));
      return;
    }

    const { error } = await supabase.from('bids').insert({
      shoutout_id: shoutoutId,
      freelancer_id: freelancerId,
      amount,
      delivery_time: deliveryTime,
      proposal,
      status: 'pending'
    });

    if (error) {
      console.error('Error placing bid:', error);
    } else {
      fetchMarketplaceData();
    }
  };

  const acceptBid = async (bidId: string) => {
    if (!isSupabaseConfigured) {
      const bid = bids.find(b => b.id === bidId);
      if (!bid) return;
      const shoutout = shoutouts.find(s => s.id === bid.shoutoutId);
      if (!shoutout) return;

      const updatedBids = bids.map(b => {
        if (b.id === bidId) return { ...b, status: 'accepted' as const };
        if (b.shoutoutId === bid.shoutoutId) return { ...b, status: 'rejected' as const };
        return b;
      });
      setBids(updatedBids);
      localStorage.setItem('kazify_mock_bids', JSON.stringify(updatedBids));

      const newOrder = {
        id: `o-${Math.floor(100 + Math.random() * 900)}`,
        shoutout_id: bid.shoutoutId,
        bid_id: bidId,
        client_id: shoutout.clientId,
        freelancer_id: bid.freelancerId,
        amount: bid.amount,
        status: 'escrow_held',
        delivery_note: null,
        delivery_file_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const storedOrders = localStorage.getItem('kazify_mock_orders');
      const orderList = storedOrders ? JSON.parse(storedOrders) : [];
      orderList.unshift(newOrder);
      localStorage.setItem('kazify_mock_orders', JSON.stringify(orderList));
      window.dispatchEvent(new Event('kazify_data_update'));
      return;
    }

    const { data: bid, error: bidErr } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .single();

    if (bidErr || !bid) {
      console.error('Error fetching bid:', bidErr);
      return;
    }

    const { data: shoutout, error: shoutoutErr } = await supabase
      .from('shoutouts')
      .select('*')
      .eq('id', bid.shoutout_id)
      .single();

    if (shoutoutErr || !shoutout) {
      console.error('Error fetching shoutout:', shoutoutErr);
      return;
    }

    // Mark the accepted bid as 'accepted'
    await supabase.from('bids').update({ status: 'accepted' }).eq('id', bidId);

    // Mark all other bids for this shoutout as 'rejected'
    await supabase.from('bids')
      .update({ status: 'rejected' })
      .eq('shoutout_id', bid.shoutout_id)
      .neq('id', bidId);

    // Create a new order in Supabase linking the custom shoutout and bid
    const { error: orderErr } = await supabase.from('orders').insert({
      shoutout_id: bid.shoutout_id,
      bid_id: bidId,
      client_id: shoutout.client_id,
      freelancer_id: bid.freelancer_id,
      amount: bid.amount,
      status: 'escrow_held',
      delivery_note: null,
      delivery_file_url: null
    });

    if (orderErr) {
      console.error('Error creating order from accepted bid:', orderErr);
    } else {
      fetchMarketplaceData();
    }
  };

  const submitReview = async (orderId: string, gigId: string, clientId: string, freelancerId: string, rating: number, comment: string) => {
    if (!isSupabaseConfigured) {
      const newReview: Review = {
        id: `r-${Date.now()}`,
        orderId,
        gigId,
        clientId,
        freelancerId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      const storedReviews = localStorage.getItem('kazify_mock_reviews');
      const reviewsList = storedReviews ? JSON.parse(storedReviews) : [];
      reviewsList.push(newReview);
      localStorage.setItem('kazify_mock_reviews', JSON.stringify(reviewsList));

      // Update gig reviews count and rating
      const updatedGigs = gigs.map(g => {
        if (g.id === gigId) {
          const newCount = g.reviewsCount + 1;
          const newRating = ((g.rating * g.reviewsCount) + rating) / newCount;
          return { ...g, reviewsCount: newCount, rating: newRating };
        }
        return g;
      });
      setGigs(updatedGigs);
      localStorage.setItem('kazify_mock_gigs', JSON.stringify(updatedGigs));

      window.dispatchEvent(new Event('kazify_data_update'));
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      order_id: orderId,
      gig_id: gigId,
      client_id: clientId,
      freelancer_id: freelancerId,
      rating,
      comment
    });

    if (error) {
      console.error('Error submitting review:', error);
    } else {
      // Increment gig reviews count and update average
      const gigToUpdate = gigs.find(g => g.id === gigId);
      if (gigToUpdate) {
        const newCount = gigToUpdate.reviewsCount + 1;
        const newRating = ((gigToUpdate.rating * gigToUpdate.reviewsCount) + rating) / newCount;
        await supabase.from('gigs').update({
          reviews_count: newCount,
          rating: newRating
        }).eq('id', gigId);
      }
      fetchMarketplaceData();
    }
  };

  const getReviewsForGig = async (gigId: string): Promise<Review[]> => {
    if (!isSupabaseConfigured) {
      const storedReviews = localStorage.getItem('kazify_mock_reviews');
      const reviewsList: Review[] = storedReviews ? JSON.parse(storedReviews) : [];
      
      const storedUsers = localStorage.getItem('kazify_mock_users');
      const usersList: any[] = storedUsers ? JSON.parse(storedUsers) : mockUsers;

      return reviewsList
        .filter(r => r.gigId === gigId)
        .map(r => {
          const client = usersList.find(u => u.id === r.clientId);
          return {
            id: r.id,
            orderId: r.orderId,
            gigId: r.gigId,
            clientId: r.clientId,
            freelancerId: r.freelancerId,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            client: client ? { name: client.name, avatar: client.avatar } : undefined
          };
        });
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles!reviews_client_id_fkey(name, avatar)')
      .eq('gig_id', gigId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      orderId: r.order_id,
      gigId: r.gig_id,
      clientId: r.client_id,
      freelancerId: r.freelancer_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      client: r.profiles
    }));
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesCategory = !selectedCategory || gig.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MarketplaceContext.Provider value={{
      gigs,
      shoutouts,
      bids,
      searchQuery,
      selectedCategory,
      setSearchQuery,
      setSelectedCategory,
      addShoutout,
      addGig,
      placeBid,
      acceptBid,
      submitReview,
      getReviewsForGig,
      filteredGigs
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
