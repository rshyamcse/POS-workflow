'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Utensils, Plus, Trash2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MenuManagementPage() {
  const { menu, categories, addMenuItem, deleteMenuItem } = usePOS();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [price, setPrice] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId) return;
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) return;

    addMenuItem({
      name: name.trim(),
      categoryId,
      price: parsedPrice,
    });
    setName('');
    setPrice('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <Utensils className="h-8 w-8 text-primary" />
          <span>Menu Management</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Add, manage, and remove takeaway menu items stored in your local POS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ADD ITEM FORM */}
        <Card className="lg:col-span-1 h-fit border-border/60 rounded-3xl bg-card shadow-sm">
          <CardHeader className="bg-secondary/20 border-b border-border/50">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Add New Menu Item</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Item Name</label>
                <Input
                  placeholder="e.g. Crispy Chicken Burger"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-foreground"
                  required
                >
                  <option value="" disabled>Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-10 h-11 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-black text-base shadow-md mt-2">
                Save Menu Item
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* MENU LIST */}
        <div className="lg:col-span-2 space-y-4">
          {categories.map(cat => {
            const catItems = menu.filter(m => m.categoryId === cat.id);
            if (catItems.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3 bg-card p-6 rounded-3xl border border-border/60 shadow-sm">
                <h3 className="text-xl font-black text-foreground border-b border-border/50 pb-2 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">{catItems.length} items</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {catItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/40">
                      <div>
                        <p className="font-bold text-foreground text-base">{item.name}</p>
                        <p className="text-sm font-black text-primary mt-0.5">${item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMenuItem(item.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/15 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
