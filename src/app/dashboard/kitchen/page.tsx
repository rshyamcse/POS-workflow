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

  return (
    <div className="h-full w-full bg-background p-4 sm:p-6 flex flex-col overflow-hidden max-w-[1920px] mx-auto">
      {/* TV Header */}
      <div className="flex items-center justify-between py-4 px-6 gap-4 border-b border-border/80 bg-card/60 backdrop-blur-md rounded-2xl mb-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Utensils className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-foreground">
              Kitchen Display System (KDS)
            </h1>
            <p className="text-base sm:text-lg font-bold text-muted-foreground tracking-wide mt-0.5">
              Live preparation queue • Wide horizontal TV cards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-lg font-black uppercase tracking-wider">
          <span className="bg-blue-500/15 text-blue-500 border border-blue-500/30 px-4 py-1.5 rounded-xl">
            New: {kitchenOrders.filter(o => o.status === 'NEW').length}
          </span>
          <span className="bg-orange-500/15 text-orange-500 border border-orange-500/30 px-4 py-1.5 rounded-xl">
            Preparing: {kitchenOrders.filter(o => o.status === 'PREPARING').length}
          </span>
        </div>
      </div>

      {/* KITCHEN TV AUTO GRID */}
      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center bg-card/30 rounded-[24px] border border-border/60 border-dashed p-12">
          <Utensils className="h-20 w-20 text-muted-foreground/40 mb-6" />
          <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
            No Pending Kitchen Orders
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mt-4 font-bold max-w-xl">
            Kitchen queue is completely clear! New orders will immediately appear on this screen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full flex-1 overflow-y-auto auto-rows-min pr-2 pb-6 scrollbar-thin">
          {kitchenOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="kitchen"
              onUpdateStatus={updateOrderStatus}
              className="w-full shrink-0 shadow-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

