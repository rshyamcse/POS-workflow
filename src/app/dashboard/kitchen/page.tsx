'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';
import { ChefHat } from 'lucide-react';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = usePOS();

  // Show only NEW and PREPARING, oldest first for kitchen (wait, prompt says "Always show newest order first").
  // So Newest first:
  const kitchenOrders = orders
    .filter(order => order.status === 'NEW' || order.status === 'PREPARING')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background pb-8">
      
      {/* KDS Header */}
      <div className="flex items-center justify-between p-6 px-8 border-b border-border/80 bg-card/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ChefHat className="h-7 w-7 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Kitchen Display</h1>
            <p className="text-lg text-muted-foreground mt-0.5 font-bold tracking-wide">Takeaway orders pending preparation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-secondary/50 border border-border/60">
            <span className="text-xl font-black text-foreground">{kitchenOrders.length} ORDERS</span>
          </div>
        </div>
      </div>

      {/* SINGLE COLUMN KDS LIST */}
      <div className="flex-1 overflow-y-auto p-8 max-w-6xl w-full mx-auto">
        {kitchenOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-card rounded-[24px] border border-border border-dashed">
            <ChefHat className="h-20 w-20 text-muted-foreground/30 mb-6" />
            <h2 className="text-4xl font-black text-foreground tracking-tight">No Pending Orders</h2>
            <p className="text-xl text-muted-foreground mt-3 font-semibold">Kitchen is completely clear.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-8">
            {kitchenOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                mode="kitchen"
                onUpdateStatus={updateOrderStatus}
                className="w-full max-w-none shadow-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
