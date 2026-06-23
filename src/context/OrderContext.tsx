import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockOrders } from '../data/mockData';

export interface Order {
  id: string;
  gigId?: string | null;
  clientId: string;
  freelancerId: string;
  amount: number;
  status: 'escrow_held' | 'pending_approval' | 'released';
  deliveryNote?: string;
  deliveryFileUrl?: string;
  updatedAt: string;
  shoutoutId?: string | null;
  bidId?: string | null;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (gigId: string, clientId: string, freelancerId: string, amount: number) => Promise<Order | null>;
  submitDelivery: (orderId: string, note: string, fileUrl?: string) => Promise<void>;
  approveDelivery: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    if (!isSupabaseConfigured) {
      const storedOrders = localStorage.getItem('kazify_mock_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders).map((d: any) => ({
          id: d.id,
          gigId: d.gig_id !== undefined ? d.gig_id : d.gigId,
          clientId: d.client_id !== undefined ? d.client_id : d.clientId,
          freelancerId: d.freelancer_id !== undefined ? d.freelancer_id : d.freelancerId,
          amount: d.amount,
          status: d.status,
          deliveryNote: d.delivery_note !== undefined ? d.delivery_note : d.deliveryNote,
          deliveryFileUrl: d.delivery_file_url !== undefined ? d.delivery_file_url : d.deliveryFileUrl,
          updatedAt: d.updated_at || d.created_at || d.updatedAt,
          shoutoutId: d.shoutout_id !== undefined ? d.shoutout_id : d.shoutoutId,
          bidId: d.bid_id !== undefined ? d.bid_id : d.bidId
        })));
      } else {
        const orderList = mockOrders.map(o => ({
          id: o.id,
          gigId: o.gigId,
          clientId: o.clientId,
          freelancerId: o.freelancerId,
          amount: o.amount,
          status: o.status === 'in_progress' ? 'escrow_held' : o.status,
          deliveryNote: o.deliveryNote,
          deliveryFileUrl: o.deliveryFileUrl,
          updatedAt: o.updatedAt,
          shoutoutId: null,
          bidId: null
        }));
        setOrders(orderList as any[]);
        localStorage.setItem('kazify_mock_orders', JSON.stringify(orderList));
      }
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data.map(d => ({
        id: d.id,
        gigId: d.gig_id,
        clientId: d.client_id,
        freelancerId: d.freelancer_id,
        amount: d.amount,
        status: d.status,
        deliveryNote: d.delivery_note,
        deliveryFileUrl: d.delivery_file_url,
        updatedAt: d.updated_at || d.created_at,
        shoutoutId: d.shoutout_id,
        bidId: d.bid_id
      })));
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleCustomUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('kazify_data_update', handleCustomUpdate);

    if (!isSupabaseConfigured) {
      return () => {
        window.removeEventListener('kazify_data_update', handleCustomUpdate);
      };
    }

    const ordersSubscription = supabase.channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      window.removeEventListener('kazify_data_update', handleCustomUpdate);
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const createOrder = async (gigId: string, clientId: string, freelancerId: string, amount: number) => {
    if (!isSupabaseConfigured) {
      const newOrder = {
        id: `o-${Math.floor(100 + Math.random() * 900)}`,
        gigId,
        clientId,
        freelancerId,
        amount,
        status: 'escrow_held' as const,
        updatedAt: new Date().toISOString()
      };

      const storedOrders = localStorage.getItem('kazify_mock_orders');
      const orderList = storedOrders ? JSON.parse(storedOrders) : [];
      orderList.unshift(newOrder);
      localStorage.setItem('kazify_mock_orders', JSON.stringify(orderList));
      
      window.dispatchEvent(new Event('kazify_data_update'));

      return {
        id: newOrder.id,
        gigId: newOrder.gigId,
        clientId: newOrder.clientId,
        freelancerId: newOrder.freelancerId,
        amount: newOrder.amount,
        status: newOrder.status,
        updatedAt: newOrder.updatedAt
      };
    }

    const { data, error } = await supabase.from('orders').insert({
      gig_id: gigId,
      client_id: clientId,
      freelancer_id: freelancerId,
      amount,
      status: 'escrow_held'
    }).select().single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    } else {
      await fetchOrders();
      return {
        id: data.id,
        gigId: data.gig_id,
        clientId: data.client_id,
        freelancerId: data.freelancer_id,
        amount: data.amount,
        status: data.status,
        updatedAt: data.updated_at || data.created_at
      };
    }
  };

  const submitDelivery = async (orderId: string, note: string, fileUrl?: string) => {
    const defaultUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400';
    
    if (!isSupabaseConfigured) {
      const storedOrders = localStorage.getItem('kazify_mock_orders');
      if (storedOrders) {
        const orderList = JSON.parse(storedOrders);
        const updated = orderList.map((o: any) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'pending_approval',
              deliveryNote: note,
              delivery_note: note,
              deliveryFileUrl: fileUrl || defaultUrl,
              delivery_file_url: fileUrl || defaultUrl,
              updatedAt: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          return o;
        });
        localStorage.setItem('kazify_mock_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('kazify_data_update'));
      }
      return;
    }

    const { error } = await supabase.from('orders').update({
      status: 'pending_approval',
      delivery_note: note,
      delivery_file_url: fileUrl || defaultUrl,
      updated_at: new Date().toISOString()
    }).eq('id', orderId);

    if (error) {
      console.error('Error submitting delivery:', error);
    } else {
      fetchOrders();
    }
  };

  const approveDelivery = async (orderId: string) => {
    if (!isSupabaseConfigured) {
      const storedOrders = localStorage.getItem('kazify_mock_orders');
      if (storedOrders) {
        const orderList = JSON.parse(storedOrders);
        const updated = orderList.map((o: any) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'released',
              updatedAt: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          return o;
        });
        localStorage.setItem('kazify_mock_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('kazify_data_update'));
      }
      return;
    }

    const { error } = await supabase.from('orders').update({
      status: 'released',
      updated_at: new Date().toISOString()
    }).eq('id', orderId);

    if (error) {
      console.error('Error approving delivery:', error);
    } else {
      fetchOrders();
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      submitDelivery,
      approveDelivery,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
