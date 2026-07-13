'use client';

import React, { useState, useEffect } from 'react';
import { usePOS, OrderItem, OrderStatus } from '@/context/POSContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  Utensils,
  CheckCircle2,
  ShoppingBag,
  Bike,
  Plus,
  Minus,
  Trash2,
  Check,
  Search,
  X,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/components/orders/OrderCard';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { orders, menu, categories, createOrder, updateOrderStatus, globalSearchQuery } = usePOS();

  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');

  // Centered New Order Modal State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [previewOrderNumber, setPreviewOrderNumber] = useState<string>('');
  const [currentOrderItems, setCurrentOrderItems] = useState<Omit<OrderItem, 'id'>[]>([]);

  // Menu Search inside New Order
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  
  // Form Fields inside New Order Modal
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Search Dialog State
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('ALL');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Tab Counts
  const counts = {
    ALL: orders.length,
    NEW: orders.filter(o => o.status === 'NEW').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY: orders.filter(o => o.status === 'READY').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
  };

  // Filter Orders for Grid
  const filteredOrders = orders
    .filter(order => {
      if (activeTab === 'ALL') return true;
      const matchesTab = activeTab === 'ALL' || order.status === activeTab;
      const matchesGlobalSearch = !globalSearchQuery.trim() || 
        order.orderNumber.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        order.items.some(i => i.name.toLowerCase().includes(globalSearchQuery.toLowerCase()));
      return matchesTab && matchesGlobalSearch;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  // Filter Orders inside Search Dialog
  const searchResults = orders.filter(order => {
    const matchesStatus = searchStatus === 'ALL' || order.status === searchStatus;
    const matchesQuery = !searchQuery.trim() ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'PREPARING': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'READY': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'DELIVERED': return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const handleOpenNewOrderModal = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setPreviewOrderNumber(`#${randomNum}`);
    setCurrentOrderItems([]);
    setSelectedCategoryId('');
    setSelectedMenuItemId('');
    setMenuSearchQuery('');
    setQuantity(1);
    setNotes('');
    setIsNewOrderModalOpen(true);
  };

  // Live filter menu
  const filteredMenuItems = menu.filter(m => {
    const matchesCat = selectedCategoryId === '' || m.categoryId === selectedCategoryId;
    const matchesSearch = !menuSearchQuery.trim() || m.name.toLowerCase().includes(menuSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddItem = () => {
    const selectedMenuObj = menu.find(m => m.id === selectedMenuItemId);
    if (!selectedMenuObj) return;

    setCurrentOrderItems([
      ...currentOrderItems,
      {
        menuItemId: selectedMenuObj.id,
        name: selectedMenuObj.name,
        quantity,
        notes: notes.trim(),
      }
    ]);

    setSelectedMenuItemId('');
    setQuantity(1);
    setNotes('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...currentOrderItems];
    updated.splice(index, 1);
    setCurrentOrderItems(updated);
  };

  const handleCreateOrderSubmit = () => {
    if (currentOrderItems.length === 0) return;
    createOrder(currentOrderItems);
    setIsNewOrderModalOpen(false);
    setCurrentOrderItems([]);
    setToastMessage('Order Created Successfully');
  };

  const totalItems = currentOrderItems.length;
  const totalQuantity = currentOrderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6 relative pb-12 max-w-[1600px] mx-auto w-full px-2">

      {/* FLOATING SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] animate-in fade-in slide-in-from-top-5 duration-300 font-bold border border-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PREMIUM PAGE HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60 shrink-0 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Reception Orders</h1>
          <span className="hidden sm:block text-border/60">|</span>
          <p className="text-sm font-bold text-muted-foreground">Manage takeaway orders</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => {
              setSearchQuery('');
              setSearchStatus('ALL');
              setIsSearchDialogOpen(true);
            }}
            variant="outline"
            className="h-11 px-5 rounded-[14px] border-border/80 bg-secondary/30 hover:bg-secondary font-bold flex items-center gap-2 text-foreground shadow-sm transition-all"
          >
            <Search className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Search</span>
          </Button>

          <Button
            onClick={handleOpenNewOrderModal}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-black h-11 px-6 rounded-[14px] shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">New Order</span>
          </Button>
        </div>
      </div>

      {/* ORDER STATUS FILTER TABS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {(['ALL', 'NEW', 'PREPARING', 'READY', 'DELIVERED'] as const).map(tab => {
          const isActive = activeTab === tab;
          const count = counts[tab];
          const label = tab === 'ALL' ? 'All' : tab === 'NEW' ? 'New' : tab === 'PREPARING' ? 'Preparing' : tab === 'READY' ? 'Ready' : 'Delivered';
          
          let colorTheme = '';
          if (isActive) {
            if (tab === 'ALL') colorTheme = 'bg-primary text-primary-foreground border-primary shadow-primary/20';
            else if (tab === 'NEW') colorTheme = 'bg-blue-500 text-white border-blue-500 shadow-blue-500/20';
            else if (tab === 'PREPARING') colorTheme = 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20';
            else if (tab === 'READY') colorTheme = 'bg-green-500 text-white border-green-500 shadow-green-500/20';
            else if (tab === 'DELIVERED') colorTheme = 'bg-secondary text-foreground border-border shadow-none';
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-[14px] font-bold text-[13px] transition-all whitespace-nowrap border uppercase tracking-wider",
                isActive
                  ? cn(colorTheme, "shadow-md scale-[1.02]")
                  : "bg-card text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground"
              )}
            >
              <span>{label}</span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-[8px] text-[11px] font-black leading-none flex items-center justify-center", 
                isActive ? "bg-background/20 text-current" : "bg-background text-foreground border border-border/50"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ORDERS GRID */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center border border-dashed border-border/80 rounded-[24px] bg-card p-8 shadow-sm">
          <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">No Orders Found</h3>
          <p className="text-muted-foreground mt-2 font-medium max-w-sm">
            Click &quot;New Order&quot; to create a new takeaway order right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-[24px] pt-2 place-items-start justify-items-center sm:justify-items-start w-full">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="orders"
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>
      )}

      {/* 900PX 2-COLUMN NEW ORDER MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[950px] bg-card border border-border rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-6 border-b border-border/60 bg-secondary/10 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-foreground flex items-center gap-3 tracking-tight">
                  <span>Create New Order</span>
                  <span className="text-primary font-mono text-[17px] bg-primary/10 px-3 py-1 rounded-xl border border-primary/20 tracking-widest">
                    {previewOrderNumber}
                  </span>
                </h2>
                <p className="text-sm font-semibold text-muted-foreground mt-1">Select items from the menu to build the order.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="h-10 w-10 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Split Pane Body */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              
              {/* LEFT PANE: Menu & Search */}
              <div className="w-full md:w-[60%] border-r border-border/60 flex flex-col bg-card shrink-0">
                <div className="p-5 space-y-5 flex-1 overflow-y-auto scrollbar-thin">
                  
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search menu items instantly..."
                      value={menuSearchQuery}
                      onChange={(e) => {
                        setMenuSearchQuery(e.target.value);
                        setSelectedMenuItemId('');
                      }}
                      className="pl-10 bg-secondary/30 border-border/80 h-12 rounded-xl text-foreground font-bold shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Category Chips</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategoryId('');
                          setSelectedMenuItemId('');
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[13px] font-bold transition-all border",
                          selectedCategoryId === '' ? "bg-foreground text-background shadow-md border-foreground" : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
                        )}
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setSelectedMenuItemId('');
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[13px] font-bold transition-all border",
                            selectedCategoryId === cat.id ? "bg-foreground text-background shadow-md border-foreground" : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Menu Selection</label>
                    <select
                      size={6}
                      className="flex w-full rounded-[14px] border border-border/80 bg-secondary/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-foreground overflow-y-auto scrollbar-thin"
                      value={selectedMenuItemId}
                      onChange={(e) => setSelectedMenuItemId(e.target.value)}
                    >
                      {filteredMenuItems.length === 0 && (
                        <option disabled>No items found.</option>
                      )}
                      {filteredMenuItems.map(item => (
                        <option key={item.id} value={item.id} className="py-2.5 px-3 rounded-lg hover:bg-primary hover:text-primary-foreground mb-1">
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedMenuItemId && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4 pt-2 border-t border-border/50">
                      <div className="grid grid-cols-[120px_1fr] gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Qty</label>
                          <div className="flex items-center gap-1.5">
                            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-[10px] border-border bg-secondary/30 font-black hover:bg-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center font-black text-lg bg-card border border-border/50 rounded-[10px] h-10 flex items-center justify-center">
                              {quantity}
                            </span>
                            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-[10px] border-border bg-secondary/30 font-black hover:bg-secondary" onClick={() => setQuantity(quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Notes</label>
                          <Input
                            placeholder="Optional notes (e.g. Extra Crispy)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-card border-border/80 h-10 rounded-[10px] font-semibold placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full rounded-[14px] h-12 bg-primary text-primary-foreground font-black hover:bg-primary/90 text-[15px] shadow-lg shadow-primary/20"
                      >
                        <Plus className="h-5 w-5 mr-2" /> Add Item
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANE: Basket Summary */}
              <div className="w-full md:w-[40%] bg-secondary/5 flex flex-col shrink-0">
                <div className="p-5 border-b border-border/60 bg-secondary/10 flex justify-between items-center shrink-0">
                  <h4 className="font-black text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" /> Current Basket
                  </h4>
                  <span className="bg-primary/10 text-primary px-3 py-1 text-[11px] font-black rounded-full border border-primary/20">{totalItems} Items</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                  {currentOrderItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      <p className="text-sm font-bold text-muted-foreground">Basket is empty.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {currentOrderItems.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-start p-4 bg-card rounded-[16px] border border-border/60 shadow-sm relative group">
                          <div className="flex gap-3">
                            <span className="bg-secondary text-foreground font-black rounded-[10px] px-2.5 py-1 text-xs h-fit shrink-0 border border-border/50">
                              ×{item.quantity}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-black text-sm text-foreground leading-tight">{item.name}</span>
                              {item.notes && (
                                <span className="text-[11px] font-bold text-primary italic mt-1.5 bg-primary/10 px-2 py-1 rounded-md w-fit border border-primary/20">
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(idx)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Sticky Footer */}
                <div className="p-5 border-t border-border/60 bg-secondary/10 shrink-0">
                  <Button
                    type="button"
                    onClick={handleCreateOrderSubmit}
                    disabled={currentOrderItems.length === 0}
                    className="w-full rounded-[16px] h-14 bg-foreground text-background hover:bg-foreground/90 font-black text-lg shadow-xl disabled:opacity-40 transition-all duration-300"
                  >
                    Confirm Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal remains untouched or simple update below */}
    </div>
  );
}
