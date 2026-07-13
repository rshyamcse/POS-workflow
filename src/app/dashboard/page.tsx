'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Utensils, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { orders } = usePOS();
  
  // Only active orders (NEW, PREPARING, READY), newest first
  const activeOrders = orders
    .filter(order => order.status !== 'DELIVERED')
    .sort((a, b) => b.createdAt - a.createdAt);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PREPARING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'READY': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-secondary text-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return <ShoppingBag className="w-4 h-4" />;
      case 'PREPARING': return <Utensils className="w-4 h-4" />;
      case 'READY': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of current restaurant orders.</p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold text-foreground">No Active Orders</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            There are currently no active orders. Head to the POS to create a new order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">{order.orderNumber}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
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
