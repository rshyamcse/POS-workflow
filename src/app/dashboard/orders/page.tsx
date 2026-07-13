'use client';

import React, { useState, useEffect } from 'react';
import { usePOS, OrderItem, OrderStatus, Order } from '@/context/POSContext';
import { formatDistanceToNow, format } from 'date-fns';
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
  RefreshCcw,
  Search,
  X,
  Filter,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/components/orders/OrderCard';

export default function OrdersPage() {
  const { orders, menu, categories, createOrder, updateOrderStatus } = usePOS();

  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');

  // Centered New Order Modal State
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [previewOrderNumber, setPreviewOrderNumber] = useState<string>('');
  const [currentOrderItems, setCurrentOrderItems] = useState<Omit<OrderItem, 'id'>[]>([]);

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
      return order.status === activeTab;
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
    setQuantity(1);
    setNotes('');
    setIsNewOrderModalOpen(true);
  };

  const filteredMenuItems = selectedCategoryId
    ? menu.filter(m => m.categoryId === selectedCategoryId)
    : menu;

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

  const handleResetModalForm = () => {
    setCurrentOrderItems([]);
    setSelectedCategoryId('');
    setSelectedMenuItemId('');
    setQuantity(1);
    setNotes('');
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
    <div className="space-y-6 relative pb-12">

      {/* FLOATING SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-5 duration-300 font-bold border border-green-400">
          <Check className="h-5 w-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/50 shrink-0 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Reception Orders</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage takeaway orders</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* COMPACT SEARCH BUTTON */}
          <Button
            onClick={() => {
              setSearchQuery('');
              setSearchStatus('ALL');
              setIsSearchDialogOpen(true);
            }}
            variant="outline"
            className="h-12 px-5 rounded-xl border-border bg-secondary/50 hover:bg-secondary font-bold flex items-center gap-2 text-foreground"
          >
            <Search className="h-4 w-4 text-primary" />
            <span>Search</span>
          </Button>

          {/* + NEW ORDER BUTTON */}
          <Button
            onClick={handleOpenNewOrderModal}
            className="bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black font-black h-12 px-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-2 text-base"
          >
            <Plus className="h-5 w-5" />
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {/* ORDER STATUS FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['ALL', 'NEW', 'PREPARING', 'READY', 'DELIVERED'] as const).map(tab => {
          const isActive = activeTab === tab;
          const count = counts[tab];
          const label = tab === 'ALL' ? 'All' : tab === 'NEW' ? 'New' : tab === 'PREPARING' ? 'Preparing' : tab === 'READY' ? 'Ready' : 'Delivered';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border ${isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-card text-muted-foreground border-border/60 hover:bg-secondary/60 hover:text-foreground'
                }`}
            >
              <span>{label}</span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-mono ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-foreground'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ORDERS GRID */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-2xl font-bold text-foreground">No Orders in this Status</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-base">
            Click &quot;+ New Order&quot; to create a new takeaway order right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[24px] pt-2">
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

      {/* COMPACT SEARCH DIALOG MODAL */}
      {isSearchDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[550px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

            {/* Search Header */}
            <div className="p-6 border-b border-border/60 flex items-center justify-between bg-secondary/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black text-foreground">Search Orders</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Inputs */}
            <div className="p-6 space-y-4 border-b border-border/40 bg-secondary/10 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Type Order Number (#102...) or Item Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background border-border text-foreground font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {(['ALL', 'NEW', 'PREPARING', 'READY', 'DELIVERED'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setSearchStatus(status)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${searchStatus === status
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:text-foreground'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
              {searchResults.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground font-medium">
                  No matching orders found.
                </div>
              ) : (
                searchResults.map(order => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/30 border border-border/50 rounded-2xl hover:border-primary/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-lg text-primary">{order.orderNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {formatDistanceToNow(order.createdAt, { addSuffix: true })} • {order.items.length} items
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs font-semibold bg-background px-2 py-0.5 rounded-md border border-border/40 text-foreground">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      {order.status === 'NEW' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                          className="h-9 font-bold text-orange-400 border-orange-500/30 hover:bg-orange-500/10 rounded-xl"
                        >
                          Preparing
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'READY')}
                          className="h-9 font-bold text-green-400 border-green-500/30 hover:bg-green-500/10 rounded-xl"
                        >
                          Ready
                        </Button>
                      )}
                      {order.status === 'READY' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          className="h-9 font-bold bg-primary text-primary-foreground rounded-xl"
                        >
                          Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* CENTERED NEW ORDER POPUP DIALOG (NOT RIGHT DRAWER) */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[700px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

            {/* Modal Header */}
            <div className="p-6 border-b border-border/60 bg-secondary/20 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <span>Create New Order</span>
                  <span className="text-primary font-mono text-xl bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">
                    {previewOrderNumber}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Select category, menu item, adjust quantity, and add to current order.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="h-9 w-9 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">

              {/* ITEM SELECTION CONTROLS */}
              <div className="bg-secondary/20 p-5 rounded-2xl border border-border/60 space-y-4">
                <h4 className="font-black text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Plus className="h-4 w-4 text-primary" />
                  Add Item to Basket
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-foreground"
                      value={selectedCategoryId}
                      onChange={(e) => {
                        setSelectedCategoryId(e.target.value);
                        setSelectedMenuItemId('');
                      }}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Menu Item Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Menu Item</label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-foreground disabled:opacity-50"
                      value={selectedMenuItemId}
                      onChange={(e) => setSelectedMenuItemId(e.target.value)}
                    >
                      <option value="" disabled>Select Menu Item...</option>
                      {filteredMenuItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ${item.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl font-black border-border bg-background"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center font-black text-xl bg-background border border-border rounded-xl h-11 flex items-center justify-center">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl font-black border-border bg-background"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Extra Notes */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Extra Notes</label>
                    <textarea
                      rows={2}
                      placeholder={`Extra Cheese, No Onion...`}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="flex w-full rounded-xl border border-input bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground/60 text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategoryId('');
                      setSelectedMenuItemId('');
                      setQuantity(1);
                      setNotes('');
                    }}
                    className="flex-1 rounded-xl h-11 text-muted-foreground hover:text-foreground font-bold"
                  >
                    Clear Item
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedMenuItemId}
                    className="flex-[2] rounded-xl h-11 bg-primary text-primary-foreground font-black hover:bg-primary/90 text-base"
                  >
                    <Plus className="h-5 w-5 mr-1.5" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* CURRENT ORDER BASKET */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <h4 className="font-black text-base text-foreground uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Current Order Basket
                  </h4>
                  <div className="flex gap-2 text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-xl">
                    <span>{totalItems} Items</span>
                    <span>•</span>
                    <span>{totalQuantity} Qty</span>
                  </div>
                </div>

                {currentOrderItems.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed border-border/60">
                    <p className="text-sm font-semibold">No items added yet. Choose menu item above and click &quot;Add Item&quot;.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                    {currentOrderItems.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-start p-3.5 bg-secondary/30 rounded-2xl border border-border/50">
                        <div className="flex gap-3.5">
                          <span className="bg-primary/15 text-primary font-black rounded-xl px-3 py-1 text-sm h-fit shrink-0">
                            Qty x{item.quantity}
                          </span>
                          <div>
                            <p className="font-black text-base text-foreground">{item.name}</p>
                            {item.notes && (
                              <p className="text-xs text-orange-400 font-bold italic mt-1 border-l-2 border-orange-400/60 pl-2 whitespace-pre-line">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(idx)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/15 shrink-0 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border/60 bg-secondary/20 flex gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetModalForm}
                className="flex-1 rounded-xl h-12 font-bold text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewOrderModalOpen(false)}
                className="flex-1 rounded-xl h-12 font-bold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateOrderSubmit}
                disabled={currentOrderItems.length === 0}
                className="flex-[2] rounded-xl h-12 bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black font-black text-lg shadow-xl disabled:opacity-40"
              >
                Create Order ({totalQuantity})
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
