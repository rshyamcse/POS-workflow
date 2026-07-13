'use client';

import React from 'react';
import { usePOS } from '@/context/POSContext';
import { Utensils, CheckCircle2, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = usePOS();
  
  // Kitchen only cares about NEW and PREPARING orders
  const kitchenOrders = orders
    .filter(order => order.status === 'NEW' || order.status === 'PREPARING')
    .sort((a, b) => a.createdAt - b.createdAt); // Oldest first in kitchen!

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">KITCHEN DISPLAY</h1>
          <p className="text-xl text-muted-foreground mt-1 font-medium">Orders pending preparation</p>
        </div>
        <div className="bg-primary/10 text-primary border border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-3">
          <ChefHat className="h-8 w-8" />
          <span className="text-2xl font-black">{kitchenOrders.length} ORDERS</span>
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-border/60 rounded-3xl bg-secondary/10">
          <ChefHat className="h-20 w-20 text-muted-foreground mb-6 opacity-20" />
          <h3 className="text-3xl font-black text-foreground">Kitchen is Clear</h3>
          <p className="text-xl text-muted-foreground mt-2 max-w-md">
            No orders are currently waiting for preparation. Great job!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kitchenOrders.map(order => (
            <Card 
              key={order.id} 
              className={`overflow-hidden border-2 shadow-lg flex flex-col transition-all ${
                order.status === 'PREPARING' ? 'border-orange-500/50 shadow-orange-500/10' : 'border-border'
              }`}
            >
              <CardHeader className={`pb-4 ${order.status === 'PREPARING' ? 'bg-orange-500/10' : 'bg-secondary/30'}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-4xl font-black">{order.orderNumber}</CardTitle>
                  <div className="text-right">
                    <div className="text-sm font-bold text-muted-foreground">WAITING</div>
                    <div className="text-lg font-black text-foreground">
                      {formatDistanceToNow(order.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-1 bg-card">
                <ul className="space-y-4">
                  {order.items.map(item => (
                    <li key={item.id} className="flex gap-4 items-start border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="bg-foreground text-background font-black text-xl rounded-xl w-12 h-12 flex items-center justify-center shrink-0">
                        {item.quantity}
                      </div>
                      <div className="pt-1">
                        <p className="font-black text-2xl leading-none text-foreground">{item.name}</p>
                        {item.notes && (
                          <p className="text-lg text-orange-500 font-bold italic mt-2 bg-orange-500/10 border-l-4 border-orange-500 pl-3 py-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-secondary/20 p-4 border-t-2 border-border/50 flex gap-3">
                {order.status === 'NEW' && (
                  <Button 
                    className="flex-1 h-16 text-xl bg-orange-500 hover:bg-orange-600 text-white font-black"
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  >
                    <Utensils className="w-6 h-6 mr-3" />
                    START PREPARING
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button 
                    className="flex-1 h-16 text-xl bg-green-500 hover:bg-green-600 text-white font-black"
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
