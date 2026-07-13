'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';

export default function WaitingDisplayPage() {
  const { orders } = usePOS();

  // Display every active order in a single vertical queue, newest first (createdAt DESC)
  const activeOrders = orders
    .filter(order => order.status === 'PREPARING' || order.status === 'READY')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-100px)] overflow-hidden">
      
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between pb-6 border-b border-border/50 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-foreground">
            Order Status Display
          </h1>
          <p className="text-xl text-muted-foreground mt-1 font-medium">
            Live updates — Please keep your order number ready
          </p>
        </div>
        <div className="flex items-center gap-6 text-lg font-bold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-orange-400">Preparing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400">Ready for Pickup</span>
          </div>
        </div>
      </div>

      {/* ONE VERTICAL LIST */}
      <div className="flex-1 overflow-y-auto py-8 pr-2 scrollbar-thin scrollbar-thumb-border/60">
        {activeOrders.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <h2 className="text-5xl font-black text-foreground tracking-tight">
              No Active Orders
            </h2>
            <p className="text-2xl text-muted-foreground mt-4 font-medium">
              Waiting for new orders...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-[24px]">
            {activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                mode="waiting" 
                className="w-full max-w-[900px]" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
