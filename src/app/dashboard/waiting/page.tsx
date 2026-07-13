'use client';

import React from 'react';
import { usePOS, Order } from '@/context/POSContext';
import { Card, CardContent } from '@/components/ui/card';

export default function WaitingDisplayPage() {
  const { orders } = usePOS();

  // Display every active order in a single vertical queue, newest first (createdAt DESC)
  const activeOrders = orders
    .filter(order => order.status !== 'DELIVERED')
    .sort((a, b) => b.createdAt - a.createdAt);

  // Helper for status-based color system
  const getCardStyle = (status: Order['status']) => {
    switch (status) {
      case 'PREPARING':
        return {
          border: 'border-4 border-orange-500 shadow-orange-500/10',
          headerBg: 'bg-orange-500/15 border-b-2 border-orange-500/30 text-orange-400',
          badge: 'bg-orange-500 text-white',
          noteColor: 'text-orange-400 border-orange-500',
        };
      case 'READY':
        return {
          border: 'border-4 border-green-500 shadow-green-500/20',
          headerBg: 'bg-green-500/15 border-b-2 border-green-500/30 text-green-400',
          badge: 'bg-green-500 text-white animate-pulse',
          noteColor: 'text-green-400 border-green-500',
        };
      default:
        // For NEW status before Kitchen clicks Preparing
        return {
          border: 'border-4 border-blue-500 shadow-blue-500/10',
          headerBg: 'bg-blue-500/15 border-b-2 border-blue-500/30 text-blue-400',
          badge: 'bg-blue-500 text-white',
          noteColor: 'text-blue-400 border-blue-500',
        };
    }
  };

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

      {/* ONE VERTICAL ORDER QUEUE */}
      <div className="flex-1 overflow-y-auto py-8 pr-2 space-y-8 scrollbar-thin scrollbar-thumb-border/60">
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
          <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
            {activeOrders.map(order => {
              const style = getCardStyle(order.status);
              const hasAnyNotes = order.items.some(item => Boolean(item.notes));

              return (
                <Card
                  key={order.id}
                  className={`${style.border} rounded-3xl bg-card shadow-2xl overflow-hidden transition-all duration-500 ease-in-out animate-in fade-in zoom-in-95`}
                >
                  {/* CARD HEADER */}
                  <div className={`${style.headerBg} px-8 py-6 flex items-center justify-between transition-colors duration-500`}>
                    <span className="text-6xl md:text-7xl font-black tracking-tighter">
                      {order.orderNumber}
                    </span>
                    <span className={`${style.badge} px-6 py-2.5 rounded-2xl text-2xl font-black uppercase tracking-wider shadow-md transition-all duration-500`}>
                      {order.status}
                    </span>
                  </div>

                  {/* CARD BODY */}
                  <CardContent className="p-8 space-y-6">
                    <ul className="space-y-4">
                      {order.items.map(item => (
                        <li key={item.id} className="space-y-2">
                          <div className="flex justify-between items-center text-3xl md:text-4xl font-black text-foreground">
                            <span className="truncate pr-4">{item.name}</span>
                            <span className="font-mono shrink-0 bg-secondary/80 px-4 py-1 rounded-xl text-foreground">
                              x{item.quantity}
                            </span>
                          </div>
                          {item.notes && (
                            <div className={`text-2xl font-bold italic pl-4 border-l-4 ${style.noteColor}`}>
                              {item.notes}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Extra notes section summary if any items have notes */}
                    {hasAnyNotes && (
                      <div className="pt-4 border-t border-border/40 flex items-center gap-2 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                        <span>Special preparation instructions included above</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
