'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CategoriesManagementPage() {
  const { categories, menu, addCategory, deleteCategory } = usePOS();
  const [name, setName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name.trim());
    setName('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          <span>Category Management</span>
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">Create and organize categories for your takeaway menu items.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ADD FORM */}
        <Card className="md:col-span-1 h-fit border-border/60 rounded-3xl bg-card shadow-sm">
          <CardHeader className="bg-secondary/20 border-b border-border/50">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>New Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Category Name</label>
                <Input
                  placeholder="e.g. Desserts or Combos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-black text-base shadow-md">
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LIST */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
          {categories.map(cat => {
            const itemCount = menu.filter(m => m.categoryId === cat.id).length;
            return (
              <Card key={cat.id} className="p-5 border-border/60 rounded-3xl bg-card shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-foreground">{cat.name}</h3>
                  <p className="text-xs font-bold text-muted-foreground mt-1 bg-secondary px-2.5 py-1 rounded-lg w-fit">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(cat.id)}
                  disabled={categories.length <= 1}
                  className="h-9 w-9 text-destructive hover:bg-destructive/15 rounded-xl disabled:opacity-30"
                  title="Remove Category"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
