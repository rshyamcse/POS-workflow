'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';
import { MonitorPlay } from 'lucide-react';

export default function WaitingDisplayPage() {
  const { orders } = usePOS();

  // Display every active order in a single vertical queue, newest first (createdAt DESC)
  const activeOrders = orders
    .filter(order => order.status === 'PREPARING' || order.status === 'READY')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background pb-8">
      
      {/* CUSTOMER DISPLAY HEADER */}
      <div className="flex items-center justify-between p-8 px-10 border-b-2 border-border/80 bg-card/50 backdrop-blur-md sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-5xl font-black tracking-tighter uppercase text-foreground">
            Order Status Display
          </h1>
          <p className="text-2xl text-muted-foreground mt-2 font-bold tracking-wide">
            Live updates — Please keep your order number ready
          </p>
        </div>
        
        <div className="flex items-center gap-8 text-2xl font-black bg-secondary/30 p-4 rounded-3xl border border-border/50">
          <div className="flex items-center gap-3 bg-orange-500/10 px-6 py-3 rounded-2xl border border-orange-500/20">
            <span className="w-5 h-5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
            <span className="text-orange-500">Preparing</span>
          </div>
          <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-2xl border border-green-500/20">
            <span className="w-5 h-5 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            <span className="text-green-500">Ready for Pickup</span>
          </div>
        </div>
      </div>

      {/* ONE VERTICAL LIST */}
      <div className="flex-1 overflow-y-auto p-10 max-w-7xl w-full mx-auto">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-card rounded-[32px] border-2 border-border border-dashed shadow-sm">
            <MonitorPlay className="h-24 w-24 text-muted-foreground/30 mb-8" />
            <h2 className="text-6xl font-black text-foreground tracking-tight">
              No Active Orders
            </h2>
            <p className="text-3xl text-muted-foreground mt-6 font-bold">
              Waiting for new orders...
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            {activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                mode="waiting" 
                className="w-full max-w-none shadow-2xl" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
