'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { Utensils, CheckCircle2, ChefHat, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

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
          <h1 className="text-4xl font-black tracking-tight text-primary">KITCHEN DISPLAY</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {kitchenOrders.map(order => (
            <Card 
              key={order.id} 
              className={`overflow-hidden border-2 shadow-xl flex flex-col transition-all rounded-3xl ${
                order.status === 'PREPARING' 
                  ? 'border-orange-500/80 shadow-orange-500/15 bg-card' 
                  : 'border-blue-500/60 shadow-blue-500/10 bg-card'
              }`}
            >
              <CardHeader className={`pb-4 px-6 pt-6 ${
                order.status === 'PREPARING' ? 'bg-orange-500/15' : 'bg-blue-500/15'
              }`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-4xl font-black text-foreground">{order.orderNumber}</CardTitle>
                  <div className="text-right">
                    <div className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${
                      order.status === 'PREPARING' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {order.status}
                    </div>
                    <div className="text-sm font-bold text-muted-foreground mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(order.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 px-6 flex-1 bg-card">
                <ul className="space-y-4">
                  {order.items.map(item => (
                    <li key={item.id} className="flex gap-4 items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="bg-foreground text-background font-black text-2xl rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 shadow-md">
                        {item.quantity}x
                      </div>
                      <div className="pt-1 flex-1">
                        <p className="font-black text-2xl leading-tight text-foreground">{item.name}</p>
                        {item.notes && (
                          <p className="text-base text-orange-400 font-bold italic mt-2 bg-orange-500/10 border-l-4 border-orange-500 pl-3 py-1.5 rounded-r-xl">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="bg-secondary/20 p-5 border-t-2 border-border/60 flex gap-3">
                {order.status === 'NEW' && (
                  <Button 
                    className="flex-1 h-16 text-xl bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-lg"
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  >
                    <Utensils className="w-6 h-6 mr-3" />
                    START PREPARING
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button 
                    className="flex-1 h-16 text-xl bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl shadow-lg animate-pulse"
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    MARK READY
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
