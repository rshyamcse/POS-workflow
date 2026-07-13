'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { format } from 'date-fns';
import { Search, History, Bike, ChevronDown, CheckCircle2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function DeliveredOrdersPage() {
  const { orders } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter delivered orders and sort newest first
  const deliveredOrders = orders
    .filter(order => order.status === 'DELIVERED')
    .sort((a, b) => {
      const timeA = a.deliveredAt || a.createdAt;
      const timeB = b.deliveredAt || b.createdAt;
      return timeB - timeA;
    });

  // Apply search query
  const searchResults = deliveredOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto w-full">
      {/* PREMIUM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/60 shrink-0 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <History className="h-7 w-7 text-primary" />
            Order History
          </h1>
          <p className="text-muted-foreground mt-1.5 font-semibold">Complete timeline of all delivered takeaway orders.</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order # or Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-secondary/30 border-border/80 rounded-xl text-foreground font-bold"
          />
        </div>
      </div>

      {/* TIMELINE VIEW */}
      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-card rounded-[24px] border border-border border-dashed shadow-sm">
          <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <Bike className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">No History Found</h2>
          <p className="text-muted-foreground mt-2 font-medium">There are no delivered orders matching your criteria.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-border/60 ml-6 pl-8 space-y-8 pt-4">
          
          {/* Timeline Node Decorator */}
          <div className="absolute top-0 -left-[11px] h-5 w-5 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-sm">
            <div className="h-1.5 w-1.5 bg-background rounded-full" />
          </div>

          {searchResults.map((order) => {
            const isExpanded = expandedOrders[order.id];
            const deliveryTime = order.deliveredAt ? format(order.deliveredAt, "MMM d, yyyy • hh:mm a") : 'Unknown Time';

            return (
              <div key={order.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[43px] top-4 h-4 w-4 rounded-full bg-secondary border-2 border-border/80 group-hover:bg-primary group-hover:border-primary transition-colors duration-300" />
                
                {/* Collapsible Card */}
                <div 
                  className={cn(
                    "bg-card rounded-[20px] border border-border/60 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-border cursor-pointer overflow-hidden",
                    isExpanded ? "shadow-md border-border" : ""
                  )}
                  onClick={() => toggleExpand(order.id)}
                >
                  {/* Card Header Always Visible */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground">{order.orderNumber}</span>
                        <span className="text-xs font-semibold text-muted-foreground mt-1">{deliveryTime}</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border/50 text-xs font-bold text-muted-foreground ml-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        Delivered
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm text-foreground bg-secondary px-3 py-1 rounded-[10px]">{order.items.length} Items</span>
                      <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out bg-secondary/10",
                    isExpanded ? "grid-rows-[1fr] opacity-100 border-t border-border/40" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <div className="p-5 flex flex-col sm:flex-row gap-6">
                        
                        {/* Customer Summary */}
                        <div className="w-full sm:w-[30%] border-r border-border/40 pr-4 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/60">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">Walk-in</span>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Takeaway</span>
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-muted-foreground mt-2 space-y-1">
                            <p>Created: {format(order.createdAt, "hh:mm a")}</p>
                            <p>Prep Time: ~{order.deliveredAt ? Math.round((order.deliveredAt - order.createdAt) / 60000) : '?'} mins</p>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="flex-1 space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ordered Items</h4>
                          <ul className="space-y-2">
                            {order.items.map((item, i) => (
                              <li key={i} className="flex justify-between items-start bg-card p-3 rounded-xl border border-border/50">
                                <div className="flex gap-3">
                                  <span className="bg-secondary text-foreground font-black rounded-lg px-2 py-0.5 text-xs border border-border/60 h-fit">×{item.quantity}</span>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-sm text-foreground">{item.name}</span>
                                    {item.notes && (
                                      <span className="text-[11px] font-bold text-muted-foreground italic mt-1">{item.notes}</span>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
