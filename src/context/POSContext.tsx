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

export interface RestaurantSettings {
  name: string;
  subtitle: string;
  address: string;
  phone: string;
  taxRate: number;
  currencySymbol: string;
}

interface POSContextType {
  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  settings: RestaurantSettings;
  createOrder: (items: Omit<OrderItem, 'id'>[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Burgers' },
  { id: '2', name: 'Sides' },
  { id: '3', name: 'Drinks' },
];

const defaultMenu: MenuItem[] = [
  { id: 'm1', name: 'Chicken Burger', categoryId: '1', price: 10 },
  { id: 'm2', name: 'classic Burger', categoryId: '1', price: 12 },
  { id: 'm3', name: 'French Fries', categoryId: '2', price: 4 },
  { id: 'm4', name: 'Cold Drink', categoryId: '3', price: 2 },
  { id: 'm5', name: 'Coffee', categoryId: '3', price: 3 },
];

const defaultSettings: RestaurantSettings = {
  name: 'Bloom CAFE & RESTAURANT',
  subtitle: 'Modern Takeaway Management',
  address: '123 Enterprise Avenue, Suite 100',
  phone: '+1 (555) 234-5678',
  taxRate: 5,
  currencySymbol: '$',
};

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedMenu = localStorage.getItem('qsw_menu');
    const savedCategories = localStorage.getItem('qsw_categories');
    const savedOrders = localStorage.getItem('qsw_orders');
    const savedSettings = localStorage.getItem('qsw_settings');
    const savedTheme = localStorage.getItem('qsw_theme') as 'dark' | 'light' | null;

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

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(defaultSettings);
      localStorage.setItem('qsw_settings', JSON.stringify(defaultSettings));
    }

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      localStorage.setItem('qsw_theme', 'light');
    }

    setIsLoaded(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'qsw_orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'qsw_menu' && e.newValue) {
        setMenu(JSON.parse(e.newValue));
      }
      if (e.key === 'qsw_categories' && e.newValue) {
        setCategories(JSON.parse(e.newValue));
      }
      if (e.key === 'qsw_settings' && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      }
      if (e.key === 'qsw_theme' && e.newValue) {
        setTheme(e.newValue as 'light' | 'dark');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('qsw_theme', newTheme);
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('qsw_orders', JSON.stringify(newOrders));
  };

  const saveMenu = (newMenu: MenuItem[]) => {
    setMenu(newMenu);
    localStorage.setItem('qsw_menu', JSON.stringify(newMenu));
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem('qsw_categories', JSON.stringify(newCategories));
  };

  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('qsw_settings', JSON.stringify(updated));
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
          deliveredAt: status === 'DELIVERED' ? Date.now() : order.deliveredAt,
        };
      }
      return order;
    });
    saveOrders(updatedOrders);
  };

  const addCategory = (name: string) => {
    const newCat: Category = { id: Date.now().toString(), name: name.trim() };
    saveCategories([...categories, newCat]);
  };

  const deleteCategory = (id: string) => {
    saveCategories(categories.filter(c => c.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: Date.now().toString() };
    saveMenu([...menu, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    saveMenu(menu.filter(m => m.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <POSContext.Provider
      value={{
        menu,
        categories,
        orders,
        settings,
        createOrder,
        updateOrderStatus,
        addCategory,
        deleteCategory,
        addMenuItem,
        deleteMenuItem,
        updateSettings,
        theme,
        toggleTheme,
        globalSearchQuery,
        setGlobalSearchQuery,
      }}
    >
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
