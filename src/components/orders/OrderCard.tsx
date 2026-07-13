'use client';

import React from 'react';
import { Order, OrderStatus } from '@/context/POSContext';
import { formatDistanceToNow, format } from 'date-fns';
import { Utensils, CheckCircle2, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: Order;
  mode: 'orders' | 'kitchen' | 'waiting' | 'delivered' | 'dashboard';
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
  className?: string;
}

export function OrderCard({ order, mode, onUpdateStatus, className = '' }: OrderCardProps) {
  // Status Color System
  const getColors = () => {
    switch (order.status) {
      case 'NEW':
        return {
          border: 'border-blue-500/40 hover:border-blue-500/60 shadow-[0_4px_20px_rgb(59,130,246,0.1)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.25)]',
          headerBg: 'bg-blue-500/10 border-blue-500/20',
          badgeBg: 'bg-blue-500',
          badgeText: 'text-white',
          noteContainer: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        };
      case 'PREPARING':
        return {
          border: 'border-orange-500/40 hover:border-orange-500/60 shadow-[0_4px_20px_rgb(249,115,22,0.1)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.25)]',
          headerBg: 'bg-orange-500/10 border-orange-500/20',
          badgeBg: 'bg-orange-500',
          badgeText: 'text-white',
          noteContainer: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
        };
      case 'READY':
        return {
          border: 'border-green-500/40 hover:border-green-500/60 shadow-[0_4px_20px_rgb(34,197,94,0.1)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.25)]',
          headerBg: 'bg-green-500/10 border-green-500/20',
          badgeBg: 'bg-green-500',
          badgeText: 'text-white',
          noteContainer: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
        };
      case 'DELIVERED':
        return {
          border: 'border-border hover:shadow-lg',
          headerBg: 'bg-secondary/40 border-border/50',
          badgeBg: 'bg-secondary text-muted-foreground border border-border',
          badgeText: '',
          noteContainer: 'bg-secondary/60 border-border text-muted-foreground',
        };
    }
  };

  const colors = getColors();

  const renderActions = () => {
    if (!onUpdateStatus) return null;

    if (mode === 'orders' || mode === 'dashboard' || mode === 'kitchen') {
      if (order.status === 'NEW') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="w-full h-11 text-base bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
          >
            <Utensils className="w-4 h-4 mr-2" /> Preparing
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-11 text-base bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all animate-pulse"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Ready
          </Button>
        );
      }
      // Kitchen doesn't have delivered button
      if (order.status === 'READY' && mode !== 'kitchen') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
            className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all"
          >
            <Bike className="w-4 h-4 mr-2" /> Delivered
          </Button>
        );
      }
    }

    if (order.status === 'DELIVERED' && mode !== 'waiting') {
      return (
        <div className="w-full text-center py-2 text-[13px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 rounded-xl">
          Read Only
        </div>
      );
    }

    return null;
  };

  const actionContent = renderActions();
  const widthClass = className.includes('max-w-') ? '' : 'max-w-[420px] w-full mx-auto';
  
  const timeDisplay = order.deliveredAt && order.status === 'DELIVERED'
    ? `Delivered ${format(order.deliveredAt, 'hh:mm a')}`
    : `${formatDistanceToNow(order.createdAt)} ago`;

  return (
    <div
      className={`flex flex-col bg-card/95 backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] ${widthClass} ${colors.border} ${className}`}
    >
      {/* LINE 1 (HEADER) - Compact, Single Line */}
      <div className={`flex items-center justify-between px-5 py-3 border-b shrink-0 ${colors.headerBg}`}>
        <div className="flex items-center gap-3 truncate">
          <span className="text-xl font-black leading-none text-foreground tracking-tight">
            {order.orderNumber}
          </span>
          <span className="text-xs font-semibold text-muted-foreground truncate">
            {timeDisplay}
          </span>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shrink-0 ml-2 ${colors.badgeBg} ${colors.badgeText}`}
        >
          {order.status}
        </div>
      </div>

      {/* LINE 2 (BODY) - Items List */}
      <div className="flex-1 p-5 flex flex-col gap-4 bg-card">
        {order.items.map((item, idx) => (
          <div key={item.id || idx} className="flex flex-col border-b border-border/30 pb-4 last:border-0 last:pb-0">
            {/* Row: Item Name and Quantity (Space Between) */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-base font-bold text-foreground leading-tight">
                {item.name}
              </span>
              <span className="text-[13px] font-black bg-secondary text-foreground px-2 py-0.5 rounded-md shrink-0">
                ×{item.quantity}
              </span>
            </div>

            {/* Extra Notes Container (if exists) */}
            {item.notes && (
              <div
                className={`mt-2 text-[13px] font-semibold italic px-3 py-2 rounded-lg border w-fit whitespace-pre-line ${colors.noteContainer}`}
              >
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LINE 3 (FOOTER) - Actions */}
      {actionContent && (
        <div className="p-5 pt-0 shrink-0 bg-card">
          {actionContent}
        </div>
      )}
    </div>
  );
}
