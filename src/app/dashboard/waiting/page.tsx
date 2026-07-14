'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';
import { Clock } from 'lucide-react';

export default function WaitingDisplayPage() {
  const { orders } = usePOS();

  const activeOrders = orders
    .filter(order => order.status === 'PREPARING' || order.status === 'READY')
    .sort((a, b) => {
      // Show READY orders at the top first, then PREPARING by newest
      if (a.status === 'READY' && b.status !== 'READY') return -1;
      if (a.status !== 'READY' && b.status === 'READY') return 1;
      return b.createdAt - a.createdAt;
    });

  const getGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1';
    if (count === 3) return 'grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1';
    if (count === 4) return 'grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2';
    if (count <= 8) return 'grid-cols-2 grid-rows-4 lg:grid-cols-4 lg:grid-rows-2';
    if (count <= 9) return 'grid-cols-3 grid-rows-3';
    if (count <= 12) return 'grid-cols-3 grid-rows-4 lg:grid-cols-4 lg:grid-rows-3';
    if (count <= 16) return 'grid-cols-4 grid-rows-4';
    return 'grid-cols-5 grid-rows-4';
  };

  return (
    <div className="h-screen w-screen bg-background p-3 sm:p-4 flex flex-col overflow-hidden select-none">
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-center bg-card/20 rounded-[24px] border border-border/40 border-dashed p-12">
          <Clock className="h-24 w-24 text-muted-foreground/30 mb-6 animate-pulse" />
          <h2 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight">
            No Orders Currently Waiting
          </h2>
          <p className="text-2xl sm:text-3xl text-muted-foreground mt-4 font-bold max-w-2xl">
            We are ready to take your order! Your order status and waiting time will appear right here.
          </p>
        </div>
      ) : (
        <div className={`grid ${getGridClass(activeOrders.length)} gap-3 sm:gap-4 h-full w-full min-h-0 min-w-0 overflow-hidden`}>
          {activeOrders.map(order => (
            <div key={order.id} className="h-full w-full min-h-0 min-w-0 overflow-hidden">
              <OrderCard
                order={order}
                mode="waiting"
                className="h-full w-full min-h-0 min-w-0 shadow-xl border-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


