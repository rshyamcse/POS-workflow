'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { format } from 'date-fns';
import { CheckCircle2, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeliveredPage() {
  const { orders } = usePOS();
  
  // Show only delivered orders
  const deliveredOrders = orders
    .filter(order => order.status === 'DELIVERED')
    .sort((a, b) => (b.deliveredAt || b.createdAt) - (a.deliveredAt || a.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivered Orders</h1>
        <p className="text-muted-foreground mt-1">History of all completed and delivered orders.</p>
      </div>

      {deliveredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10">
          <Bike className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold text-foreground">No Delivered Orders</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            There are no completed orders yet today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">{order.orderNumber}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Delivered at {order.deliveredAt ? format(order.deliveredAt, 'hh:mm a') : 'Unknown time'}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1.5`}>
                    <Bike className="w-4 h-4" />
                    DELIVERED
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex gap-2">
                        <span className="font-semibold text-foreground bg-secondary/80 px-2 py-0.5 rounded text-xs min-w-6 text-center h-fit">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-orange-400 font-medium italic mt-0.5 border-l-2 border-orange-400/50 pl-2">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
