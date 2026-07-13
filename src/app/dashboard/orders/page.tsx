'use client';

import React, { useState, useEffect } from 'react';
import { usePOS, OrderItem, MenuItem } from '@/context/POSContext';
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
  RefreshCcw,
  MenuSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';

export default function OrdersPage() {
  const { orders, menu, categories, createOrder, updateOrderStatus } = usePOS();

  // Drawer & Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewOrderNumber, setPreviewOrderNumber] = useState<string>('');
  const [currentOrderItems, setCurrentOrderItems] = useState<Omit<OrderItem, 'id'>[]>([]);

  // Individual Item Form State inside Drawer
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Show active orders for the Reception screen
  const activeOrders = orders
    .filter(order => order.status !== 'DELIVERED')
    .sort((a, b) => b.createdAt - a.createdAt);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PREPARING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'READY': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-secondary text-foreground border-border';
    }
  };

  const handleOpenDrawer = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setPreviewOrderNumber(`#${randomNum}`);
    setCurrentOrderItems([]);
    setSelectedCategoryId('');
    setSelectedMenuItemId('');
    setQuantity(1);
    setNotes('');
    setIsDrawerOpen(true);
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

    // Reset item form
    setSelectedMenuItemId('');
    setQuantity(1);
    setNotes('');
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...currentOrderItems];
    updated.splice(index, 1);
    setCurrentOrderItems(updated);
  };

  const handleResetForm = () => {
    setCurrentOrderItems([]);
    setSelectedCategoryId('');
    setSelectedMenuItemId('');
    setQuantity(1);
    setNotes('');
  };

  const handleCreateOrderSubmit = () => {
    if (currentOrderItems.length === 0) return;

    // Save inside Local Storage via Context
    createOrder(currentOrderItems);

    // Close Drawer & Show Toast
    setIsDrawerOpen(false);
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

      {/* HEADER (Sticky) */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/95 backdrop-blur-md py-4 border-b border-border/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reception Orders</h1>
          <p className="text-muted-foreground mt-1">Manage active takeaway orders.</p>
        </div>

        <Button
          onClick={handleOpenDrawer}
          className="bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black font-bold h-12 px-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-2.5 shrink-0 w-auto text-base"
        >
          <Plus className="h-5 w-5" />
          <span>New Order</span>
        </Button>
      </div>

      {/* ORDERS LIST OR EMPTY STATE */}
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-2xl font-bold text-foreground">No Active Orders</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-base">
            Click &quot;New Order&quot; to create your first order.
          </p>
          <Button
            onClick={handleOpenDrawer}
            className="mt-6 bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black font-bold h-12 px-6 rounded-xl shadow-md flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span>+ New Order</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {activeOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all flex flex-col rounded-2xl bg-card">
              <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">{order.orderNumber}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 flex-1">
                <ul className="space-y-3">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-start text-sm border-b border-border/30 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex gap-2.5">
                        <span className="font-bold text-foreground bg-secondary/80 px-2 py-0.5 rounded text-xs min-w-6 text-center h-fit">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-semibold text-foreground text-base">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-orange-400 font-medium italic mt-0.5 border-l-2 border-orange-400/60 pl-2">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="bg-secondary/10 p-4 border-t border-border/50 flex gap-2 justify-end">
                {order.status === 'NEW' && (
                  <Button
                    variant="outline"
                    className="w-full text-orange-500 border-orange-500/30 hover:bg-orange-500/10 font-bold h-11"
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Preparing
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button
                    variant="outline"
                    className="w-full text-green-500 border-green-500/30 hover:bg-green-500/10 font-bold h-11"
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Ready
                  </Button>
                )}
                {order.status === 'READY' && (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11"
                    onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                  >
                    <Bike className="w-4 h-4 mr-2" />
                    Delivered
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* RIGHT SLIDE DRAWER: MANUAL ORDER FORM */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] p-0 flex flex-col bg-background border-l border-border/60 shadow-2xl">

          {/* DRAWER HEADER */}
          <div className="p-6 border-b border-border/50 bg-secondary/10 shrink-0">
            <SheetTitle className="text-2xl font-black text-foreground flex items-center justify-between">
              <span>Create New Order</span>
              <span className="text-primary font-mono text-xl">{previewOrderNumber}</span>
            </SheetTitle>
            <SheetDescription className="text-muted-foreground mt-1">
              Select items, customize notes, and add to current order basket.
            </SheetDescription>
          </div>

          {/* DRAWER BODY (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">

            {/* ITEM SELECTION CARD */}
            <div className="space-y-4 bg-secondary/20 p-4 rounded-2xl border border-border/50">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Add Item to Order</h4>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium text-foreground"
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
                <label className="text-xs font-semibold text-muted-foreground">Menu Item</label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium text-foreground disabled:opacity-50"
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

              {/* Quantity Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl font-bold border-border"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex-1 text-center font-bold text-lg bg-background border border-border rounded-xl h-10 flex items-center justify-center">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl font-bold border-border"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Extra Notes Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Extra Notes</label>
                <textarea
                  rows={3}
                  placeholder={`Extra Cheese\nNo Onion\nExtra Crispy\nNo Ice`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground/60 text-foreground font-medium"
                />
              </div>

              {/* Action Buttons for Form */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  className="flex-1 rounded-xl h-11 text-muted-foreground hover:text-foreground font-semibold"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedMenuItemId}
                  className="flex-[2] rounded-xl h-11 bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* CURRENT ORDER BASKET */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <h4 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  Current Order Basket
                </h4>
                <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
                  <span>{totalItems} items</span>
                  <span>•</span>
                  <span>{totalQuantity} qty</span>
                </div>
              </div>

              {currentOrderItems.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed border-border/50">
                  <p className="text-sm font-medium">No items added to current order yet.</p>
                </div>
              ) : (
                <ul className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                  {currentOrderItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start p-3 bg-secondary/30 rounded-xl border border-border/40">
                      <div className="flex gap-3">
                        <span className="bg-primary/10 text-primary font-bold rounded-lg px-2.5 py-1 text-xs h-fit shrink-0">
                          Qty x{item.quantity}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-foreground">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-orange-400 font-medium italic mt-1 border-l-2 border-orange-400/60 pl-2 whitespace-pre-line">
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
                        className="h-7 w-7 text-destructive hover:bg-destructive/15 shrink-0 rounded-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          {/* DRAWER FOOTER */}
          <div className="p-6 border-t border-border/50 bg-secondary/10 flex gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 rounded-xl h-12 font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateOrderSubmit}
              disabled={currentOrderItems.length === 0}
              className="flex-[2] rounded-xl h-12 bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black font-extrabold shadow-lg disabled:opacity-40"
            >
              Create Order ({totalQuantity})
            </Button>
          </div>

        </SheetContent>
      </Sheet>

    </div>
  );
}
