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

  return (
    <div className="h-full w-full bg-background p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden max-w-[1920px] mx-auto">
      {/* TV Screen Header */}
      <div className="flex items-center justify-between py-4 px-6 gap-4 border-b border-border/80 bg-card/60 backdrop-blur-md rounded-2xl mb-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-foreground">
              Order Waiting Display
            </h1>
            <p className="text-base sm:text-lg font-bold text-muted-foreground tracking-wide mt-0.5">
              Please watch the screen for your order number
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-lg font-black uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-orange-500 inline-block animate-pulse" />
            <span className="text-orange-500">Preparing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block animate-pulse" />
            <span className="text-green-500">Ready for Pickup</span>
          </div>
        </div>
      </div>

      {/* SINGLE COLUMN TV LAYOUT (1 Card per Row strictly, flex flex-col gap-[24px]) */}
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center bg-card/30 rounded-[24px] border border-border/60 border-dashed p-12">
          <Clock className="h-20 w-20 text-muted-foreground/40 mb-6 animate-pulse" />
          <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
            No Orders Currently Waiting
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mt-4 font-bold max-w-2xl">
            We are ready to take your order! Your order status and waiting time will appear on this screen immediately after ordering.
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-[24px] overflow-y-auto flex-1 pr-2 pb-6 scrollbar-thin">
          {activeOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="waiting"
              className="w-full shrink-0 shadow-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}

