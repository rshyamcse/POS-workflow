'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { CheckCircle2 } from 'lucide-react';
import { OrderCard } from '@/components/orders/OrderCard';

export default function DashboardPage() {
  const { orders, updateOrderStatus, globalSearchQuery } = usePOS();
  
  // Sort: Newest first -> Status grouped
  const statusWeight: Record<string, number> = { 'NEW': 1, 'PREPARING': 2, 'READY': 3, 'DELIVERED': 4 };
  
  const activeOrders = orders
    .filter(o => 
      o.status !== 'DELIVERED' && 
      o.orderNumber.toLowerCase().includes(globalSearchQuery.trim().toLowerCase())
    )
    .sort((a, b) => {
      // First by Status
      const weightA = statusWeight[a.status] || 99;
      const weightB = statusWeight[b.status] || 99;
      if (weightA !== weightB) return weightA - weightB;
      // Then by Newest First
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto w-full px-2">
      {/* Premium Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-4 sm:px-8 gap-4 border-b border-border/80 bg-card/50 backdrop-blur-md sticky top-0 z-20 shrink-0 shadow-sm rounded-xl sm:rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-foreground">
            Active Dashboard
          </h1>
          <span className="hidden sm:block text-border/60">|</span>
          <p className="text-sm sm:text-base text-muted-foreground font-bold tracking-wide">
            Real-time horizontal order cards overview
          </p>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-card rounded-[24px] border border-border border-dashed shadow-sm">
          <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">No Active Orders</h2>
          <p className="text-muted-foreground mt-2 font-medium">All caught up! Waiting for new orders to arrive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-[24px] pt-2 place-items-start justify-items-start w-full">
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

