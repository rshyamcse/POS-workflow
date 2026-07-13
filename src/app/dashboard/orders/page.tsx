'use client';

import React from 'react';
import { usePOS, OrderStatus } from '@/context/POSContext';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Utensils, CheckCircle2, ShoppingBag, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { orders, updateOrderStatus } = usePOS();
  
  // Show active orders for the Reception screen
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reception Orders</h1>
        <p className="text-muted-foreground mt-1">Manage all active orders and update their status.</p>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10">
          <MenuSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold text-foreground">No Active Orders</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            There are no orders to manage at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => (
            <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm flex flex-col">
              <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary">{order.orderNumber}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
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
              <CardFooter className="bg-secondary/10 p-4 border-t border-border/50 flex gap-2 justify-end">
                {order.status === 'NEW' && (
                  <Button 
                    variant="outline" 
                    className="w-full text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Preparing
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button 
                    variant="outline" 
                    className="w-full text-green-500 border-green-500/30 hover:bg-green-500/10"
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Ready
                  </Button>
                )}
                {order.status === 'READY' && (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                  >
                    <Bike className="w-4 h-4 mr-2" />
                    Delivered
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

// Just adding an empty component for the missing MenuSquare icon import above
function MenuSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
    </svg>
  );
}
