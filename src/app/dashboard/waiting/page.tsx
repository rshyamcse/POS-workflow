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
    <div className="h-screen w-screen bg-[#0F1115] text-white p-3 sm:p-4 flex flex-col overflow-hidden select-none font-sans">
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full text-center bg-[#181A20] rounded-[24px] border border-zinc-800 p-12 shadow-2xl">
          <Clock className="h-24 w-24 text-zinc-600 mb-6 animate-pulse" />
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tight">
            No Orders Currently Waiting
          </h2>
          <p className="text-2xl sm:text-3xl text-zinc-400 mt-4 font-bold max-w-2xl">
            All orders have been picked up or completed.
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


