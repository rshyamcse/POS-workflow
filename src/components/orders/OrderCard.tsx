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
  className?: string; // Allow overriding width for Waiting Display
}

export function OrderCard({ order, mode, onUpdateStatus, className = '' }: OrderCardProps) {
  // Status Color System
  const getColors = () => {
    switch (order.status) {
      case 'NEW':
        return {
          border: 'border-blue-500/50',
          headerBg: 'bg-blue-500/15',
          badgeBg: 'bg-blue-500',
          badgeText: 'text-white',
          noteContainer: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
        };
      case 'PREPARING':
        return {
          border: 'border-orange-500/60 shadow-[0_8px_30px_rgb(249,115,22,0.15)]',
          headerBg: 'bg-orange-500/15',
          badgeBg: 'bg-orange-500',
          badgeText: 'text-white',
          noteContainer: 'bg-orange-500/10 border-orange-500/40 text-orange-400',
        };
      case 'READY':
        return {
          border: 'border-green-500/60 shadow-[0_8px_30px_rgb(34,197,94,0.15)]',
          headerBg: 'bg-green-500/15',
          badgeBg: 'bg-green-500',
          badgeText: 'text-white',
          noteContainer: 'bg-green-500/10 border-green-500/40 text-green-400',
        };
      case 'DELIVERED':
        return {
          border: 'border-border',
          headerBg: 'bg-secondary/30',
          badgeBg: 'bg-secondary text-muted-foreground border border-border',
          badgeText: '',
          noteContainer: 'bg-secondary/50 border-border text-muted-foreground',
        };
    }
  };

  const colors = getColors();

  // Action Buttons Logic
  const renderActions = () => {
    if (!onUpdateStatus) return null;

    if (mode === 'orders' || mode === 'dashboard') {
      if (order.status === 'NEW') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all"
          >
            <Utensils className="w-5 h-5 mr-2" /> Preparing
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white font-black rounded-xl transition-all"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" /> Ready
          </Button>
        );
      }
      if (order.status === 'READY') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
            className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl transition-all"
          >
            <Bike className="w-5 h-5 mr-2" /> Delivered
          </Button>
        );
      }
    }

    if (mode === 'kitchen') {
      if (order.status === 'NEW') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="w-full h-16 text-xl bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl"
          >
            <Utensils className="w-6 h-6 mr-3" /> START PREPARING
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-16 text-xl bg-green-500 hover:bg-green-600 text-white font-black rounded-xl animate-pulse"
          >
            <CheckCircle2 className="w-6 h-6 mr-3" /> MARK READY
          </Button>
        );
      }
    }

    // Waiting and Delivered modes have no buttons.
    // Delivered mode in orders/dashboard page
    if (order.status === 'DELIVERED') {
      return (
        <div className="w-full text-center py-3 text-[15px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/50 rounded-xl">
          Read Only
        </div>
      );
    }

    return null;
  };

  const actionContent = renderActions();

  return (
    <div
      className={`flex flex-col bg-card rounded-[24px] border-2 overflow-hidden transition-all duration-300 min-h-[260px] ${colors.border} ${className}`}
    >
      {/* HEADER: 80px height, border bottom */}
      <div className={`flex items-center justify-between px-[24px] h-[80px] border-b border-border/50 shrink-0 ${colors.headerBg}`}>
        <div className="flex flex-col justify-center">
          <span className="text-[48px] font-black leading-none text-foreground tracking-tighter">
            {order.orderNumber}
          </span>
          <span className="text-[14px] font-semibold text-muted-foreground mt-1">
            {order.deliveredAt && order.status === 'DELIVERED'
              ? `Delivered at ${format(order.deliveredAt, 'hh:mm a')}`
              : `${formatDistanceToNow(order.createdAt)} ago`}
          </span>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full text-[16px] font-black uppercase tracking-wider shrink-0 ${colors.badgeBg} ${colors.badgeText}`}
        >
          {order.status}
        </div>
      </div>

      {/* BODY: Items List */}
      <div className="flex-1 p-[24px] flex flex-col gap-4 bg-card">
        {order.items.map((item, idx) => (
          <div key={item.id || idx} className="flex flex-col border-b border-border/30 pb-4 last:border-0 last:pb-0">
            {/* Row: Item Name and Quantity (Space Between) */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-[22px] font-bold text-foreground leading-tight">
                {item.name}
              </span>
              <span className="text-[18px] font-black bg-secondary/60 text-foreground px-3 py-0.5 rounded-lg shrink-0">
                x{item.quantity}
              </span>
            </div>

            {/* Extra Notes Container (if exists) */}
            {item.notes && (
              <div
                className={`mt-2 text-[15px] font-bold italic px-3 py-2 rounded-xl border-l-4 w-fit max-w-full whitespace-pre-line ${colors.noteContainer}`}
              >
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER: Actions */}
      {actionContent && (
        <div className="p-[24px] pt-0 shrink-0 bg-card">
          {actionContent}
        </div>
      )}
    </div>
  );
}
