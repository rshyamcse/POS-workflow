'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { ChefHat } from 'lucide-react';
import { OrderCard } from '@/components/orders/OrderCard';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = usePOS();
  
  // Kitchen only cares about NEW and PREPARING orders
  const kitchenOrders = orders
    .filter(order => order.status === 'NEW' || order.status === 'PREPARING')
    .sort((a, b) => a.createdAt - b.createdAt); // Oldest first in kitchen queue

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-3xl border border-border/60 shadow-md">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">KITCHEN DISPLAY</h1>
          <p className="text-xl text-muted-foreground mt-1 font-semibold">Takeaway orders pending preparation</p>
        </div>
        <div className="bg-primary/15 text-primary border border-primary/30 px-6 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <ChefHat className="h-8 w-8" />
          <span className="text-3xl font-black">{kitchenOrders.length} ORDERS</span>
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[65vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10">
          <ChefHat className="h-24 w-24 text-muted-foreground mb-6 opacity-20" />
          <h3 className="text-4xl font-black text-foreground">Kitchen is Clear</h3>
          <p className="text-2xl text-muted-foreground mt-3 max-w-lg font-medium">
            No active takeaway orders waiting for preparation right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-[24px]">
          {kitchenOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="kitchen"
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
