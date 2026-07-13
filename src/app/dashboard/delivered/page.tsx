'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { format } from 'date-fns';
import { CheckCircle2, Bike, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/components/orders/OrderCard';

export default function DeliveredPage() {
  const { orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  
  const deliveredOrders = orders
    .filter(order => order.status === 'DELIVERED')
    .filter(order => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return order.orderNumber.toLowerCase().includes(q) ||
        order.items.some(item => item.name.toLowerCase().includes(q));
    })
    .sort((a, b) => (b.deliveredAt || b.createdAt) - (a.deliveredAt || a.createdAt));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Delivered Orders</h1>
          <p className="text-muted-foreground mt-1 font-medium">History of all completed and delivered takeaway orders.</p>
        </div>

        {/* SEARCH / FILTER INPUT */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order # or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-background border-border font-medium text-foreground"
          />
        </div>
      </div>

      {deliveredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 p-8">
          <Bike className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-2xl font-bold text-foreground">No Delivered Orders Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-base">
            {searchQuery ? 'No matching delivered orders for your search.' : 'Completed takeaway orders will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[24px] pt-2">
          {deliveredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="delivered"
            />
          ))}
        </div>
      )}
    </div>
  );
}
