'use client';

import React, { useEffect, useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { OrderCard } from '@/components/orders/OrderCard';

export default function KitchenDisplayPage() {
  const { orders, updateOrderStatus } = usePOS();
  const [gridClass, setGridClass] = useState('grid-cols-1');

  const kitchenOrders = orders
    .filter(order => order.status === 'NEW' || order.status === 'PREPARING')
    .sort((a, b) => b.createdAt - a.createdAt);

  useEffect(() => {
    const len = kitchenOrders.length;
    if (len <= 1) setGridClass('grid-cols-1 grid-rows-1');
    else if (len === 2) setGridClass('grid-cols-2 grid-rows-1');
    else if (len === 3) setGridClass('grid-cols-3 grid-rows-1');
    else if (len === 4) setGridClass('grid-cols-2 grid-rows-2');
    else if (len <= 6) setGridClass('grid-cols-3 grid-rows-2');
    else if (len <= 8) setGridClass('grid-cols-4 grid-rows-2');
    else if (len <= 9) setGridClass('grid-cols-3 grid-rows-3');
    else if (len <= 12) setGridClass('grid-cols-4 grid-rows-3');
    else setGridClass('grid-cols-5 grid-rows-3');
  }, [kitchenOrders.length]);

  return (
    <div className="h-full w-full bg-background p-4 flex flex-col overflow-hidden">
      {kitchenOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-6xl font-black text-foreground tracking-tight">No Pending Orders</h2>
        </div>
      ) : (
        <div className={`grid ${gridClass} gap-4 w-full h-full`}>
          {kitchenOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              mode="kitchen"
              onUpdateStatus={updateOrderStatus}
              className="w-full h-full max-w-none shadow-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
}
