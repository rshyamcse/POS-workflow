'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';
import { Utensils } from 'lucide-react';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = usePOS();

  const kitchenOrders = orders
    .filter(order => order.status === 'NEW' || order.status === 'PREPARING')
    .sort((a, b) => b.createdAt - a.createdAt);

  const getGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-1 grid-rows-2';
    if (count === 3) return 'grid-cols-1 grid-rows-3';
    if (count === 4) return 'grid-cols-1 grid-rows-4';
    if (count === 5) return 'grid-cols-1 grid-rows-5';
    if (count === 6) return 'grid-cols-1 grid-rows-6';
    if (count <= 8) return 'grid-cols-2 grid-rows-4';
    if (count <= 10) return 'grid-cols-2 grid-rows-5';
    if (count <= 12) return 'grid-cols-2 grid-rows-6';
    return 'grid-cols-3 grid-rows-5';
  };

  return (
    <div className="h-screen w-screen bg-background p-3 sm:p-4 flex flex-col overflow-hidden select-none">
      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-center bg-card/20 rounded-[24px] border border-border/40 border-dashed p-12">
          <Utensils className="h-24 w-24 text-muted-foreground/30 mb-6 animate-pulse" />
          <h2 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight">
            No Active Kitchen Orders
          </h2>
          <p className="text-2xl sm:text-3xl text-muted-foreground mt-4 font-bold max-w-2xl">
            Kitchen queue is completely clear. New orders will immediately appear here.
          </p>
        </div>
      ) : (
        <div className={`grid ${getGridClass(kitchenOrders.length)} gap-3 sm:gap-4 h-full w-full min-h-0 min-w-0 overflow-hidden`}>
          {kitchenOrders.map(order => (
            <div key={order.id} className="h-full w-full min-h-0 min-w-0 overflow-hidden">
              <OrderCard
                order={order}
                mode="kitchen"
                onUpdateStatus={updateOrderStatus}
                className="h-full w-full min-h-0 min-w-0 shadow-xl border-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


