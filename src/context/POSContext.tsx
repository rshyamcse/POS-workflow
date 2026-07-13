'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERED';

export interface Category {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  deliveredAt?: number;
}

interface POSContextType {
  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  createOrder: (items: Omit<OrderItem, 'id'>[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Burgers' },
  { id: '2', name: 'Sides' },
  { id: '3', name: 'Drinks' },
];

const defaultMenu: MenuItem[] = [
  { id: 'm1', name: 'Chicken Burger', categoryId: '1', price: 10 },
  { id: 'm2', name: 'Beef Burger', categoryId: '1', price: 12 },
  { id: 'm3', name: 'French Fries', categoryId: '2', price: 4 },
  { id: 'm4', name: 'Cold Drink', categoryId: '3', price: 2 },
  { id: 'm5', name: 'Coffee', categoryId: '3', price: 3 },
];

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const savedMenu = localStorage.getItem('qsw_menu');
    const savedCategories = localStorage.getItem('qsw_categories');
    const savedOrders = localStorage.getItem('qsw_orders');

    if (savedMenu) {
      setMenu(JSON.parse(savedMenu));
    } else {
      setMenu(defaultMenu);
      localStorage.setItem('qsw_menu', JSON.stringify(defaultMenu));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('qsw_categories', JSON.stringify(defaultCategories));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    
    setIsLoaded(true);

    // Listen to storage events for cross-tab sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'qsw_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('qsw_orders', JSON.stringify(newOrders));
  };

  const createOrder = (items: Omit<OrderItem, 'id'>[]) => {
    const newOrderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: newOrderNumber,
      status: 'NEW',
      items: items.map((item, index) => ({ ...item, id: `${Date.now()}-${index}` })),
      createdAt: Date.now(),
    };
    saveOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { 
          ...order, 
          status,
          deliveredAt: status === 'DELIVERED' ? Date.now() : order.deliveredAt
        };
      }
      return order;
    });
    saveOrders(updatedOrders);
  };

  if (!isLoaded) return null;

  return (
    <POSContext.Provider value={{ menu, categories, orders, createOrder, updateOrderStatus }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
