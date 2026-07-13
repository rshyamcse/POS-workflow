'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { ShoppingBag } from 'lucide-react';
import { OrderCard } from '@/components/orders/OrderCard';

export default function DashboardPage() {
  const { orders, updateOrderStatus } = usePOS();
  
  // Only active orders (NEW, PREPARING, READY), newest first
  const activeOrders = orders
    .filter(order => order.status !== 'DELIVERED')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/50 shrink-0">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Active Dashboard</h1>
        <p className="text-muted-foreground mt-1 font-medium">Real-time overview of current takeaway orders.</p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-2xl font-bold text-foreground">No Active Orders</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-base">
            There are currently no active orders. Head to the Reception Orders to create a new order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[24px]">
          {activeOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="dashboard"
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
