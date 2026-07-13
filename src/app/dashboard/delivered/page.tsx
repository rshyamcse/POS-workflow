'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { format } from 'date-fns';
import { CheckCircle2, Bike, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function DeliveredPage() {
  const { orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  
  const deliveredOrders = orders
    .filter(order => order.status === 'DELIVERED')
    .filter(order => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return order.orderNumber.toLowerCase().includes(q) ||
        order.items.some(item => item.name.toLowerCase().includes(q));
    })
    .sort((a, b) => (b.deliveredAt || b.createdAt) - (a.deliveredAt || a.createdAt));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Delivered Orders</h1>
          <p className="text-muted-foreground mt-1 font-medium">History of all completed and delivered takeaway orders.</p>
        </div>

        {/* SEARCH / FILTER INPUT */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order # or item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-background border-border font-medium text-foreground"
          />
        </div>
      </div>

      {deliveredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10 p-8">
          <Bike className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-2xl font-bold text-foreground">No Delivered Orders Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-base">
            {searchQuery ? 'No matching delivered orders for your search.' : 'Completed takeaway orders will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
          {deliveredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/60 shadow-sm opacity-90 hover:opacity-100 transition-opacity rounded-3xl bg-card flex flex-col">
              <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-black text-primary">{order.orderNumber}</CardTitle>
                    <div className="flex items-center text-xs font-semibold text-muted-foreground mt-1 gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Delivered at {order.deliveredAt ? format(order.deliveredAt, 'hh:mm a, MMM d') : 'Unknown time'}
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full border text-xs font-black uppercase bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1.5">
                    <Bike className="w-4 h-4" />
                    DELIVERED
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <ul className="space-y-3">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-start text-sm border-b border-border/30 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        <span className="font-extrabold text-foreground bg-secondary px-2.5 py-0.5 rounded-lg text-xs min-w-6 text-center h-fit shrink-0">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-bold text-foreground text-base">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-orange-400 font-semibold italic mt-0.5 border-l-2 border-orange-400/60 pl-2 whitespace-pre-line">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="bg-secondary/20 p-3.5 border-t border-border/50 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Read Only • Completed Takeaway
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
