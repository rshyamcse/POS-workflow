'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Search, History, Bike } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/components/orders/OrderCard';

export default function DeliveredOrdersPage() {
  const { orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter delivered orders and sort newest first
  const deliveredOrders = orders
    .filter(order => order.status === 'DELIVERED')
    .sort((a, b) => {
      const timeA = a.deliveredAt || a.createdAt;
      const timeB = b.deliveredAt || b.createdAt;
      return timeB - timeA;
    });

  // Apply search query
  const searchResults = deliveredOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto w-full px-2">
      {/* PREMIUM HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-4 sm:px-8 gap-4 border-b border-border/80 bg-card/50 backdrop-blur-md sticky top-0 z-20 shrink-0 shadow-sm rounded-xl sm:rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-foreground">
              Order History
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5 font-bold tracking-wide">
              Timeline of delivered horizontal order cards
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-auto sm:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 w-full bg-secondary/50 border-border/80 rounded-xl text-foreground font-bold shadow-sm transition-colors focus:bg-background"
          />
        </div>
      </div>

      {/* HORIZONTAL CARDS GRID VIEW */}
      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-card rounded-[24px] border border-border border-dashed shadow-sm">
          <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <Bike className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">No History Found</h2>
          <p className="text-muted-foreground mt-2 font-medium">There are no delivered orders matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-[24px] pt-2 place-items-start justify-items-start w-full">
          {searchResults.map((order) => (
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

