'use client';

import React from 'react';
import { Order, OrderStatus } from '@/context/POSContext';
import { formatDistanceToNow, format } from 'date-fns';
import { Utensils, CheckCircle2, Bike, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  mode: 'orders' | 'kitchen' | 'waiting' | 'delivered' | 'dashboard';
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
  className?: string;
}

export function OrderCard({ order, mode, onUpdateStatus, className = '' }: OrderCardProps) {
  // Premium Status Color System
  const getColors = () => {
    switch (order.status) {
      case 'NEW':
        return {
          cardBorder: 'border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)]',
          badgeBg: 'bg-blue-500/10 border border-blue-500/30 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
          noteBg: 'bg-blue-500/5 text-blue-500 border border-blue-500/10',
        };
      case 'PREPARING':
        return {
          cardBorder: 'border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(249,115,22,0.12)]',
          badgeBg: 'bg-orange-500/10 border border-orange-500/30 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.15)]',
          noteBg: 'bg-orange-500/5 text-orange-500 border border-orange-500/10',
        };
      case 'READY':
        return {
          cardBorder: 'border-green-500/20 hover:border-green-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.12)]',
          badgeBg: 'bg-green-500/10 border border-green-500/30 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.15)]',
          noteBg: 'bg-green-500/5 text-green-500 border border-green-500/10',
        };
      case 'DELIVERED':
        return {
          cardBorder: 'border-border/40 hover:border-border/80 hover:shadow-xl opacity-80 hover:opacity-100 transition-opacity',
          badgeBg: 'bg-secondary border border-border text-muted-foreground',
          noteBg: 'bg-secondary/40 text-muted-foreground border border-border/40',
        };
      default:
        return {
          cardBorder: 'border-border/40 hover:border-border/80 hover:shadow-xl',
          badgeBg: 'bg-secondary text-muted-foreground',
          noteBg: 'bg-secondary/40 text-muted-foreground',
        };
    }
  };

  const colors = getColors();

  const renderActions = () => {
    if (!onUpdateStatus) return null;

    if (mode === 'orders' || mode === 'dashboard') {
      if (order.status === 'NEW') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="w-full h-[46px] text-[15px] bg-orange-500 hover:bg-orange-600 hover:-translate-y-1 text-white font-bold rounded-[14px] transition-all duration-200 shadow-md hover:shadow-orange-500/25"
          >
            <Utensils className="w-[18px] h-[18px] mr-2" /> Preparing
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full h-[46px] text-[15px] bg-green-500 hover:bg-green-600 hover:-translate-y-1 text-white font-bold rounded-[14px] transition-all duration-200 shadow-md hover:shadow-green-500/25"
          >
            <CheckCircle2 className="w-[18px] h-[18px] mr-2" /> Ready
          </Button>
        );
      }
      if (order.status === 'READY' && mode !== 'kitchen') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
            className="w-full h-[46px] text-[15px] bg-primary hover:bg-primary/90 hover:-translate-y-1 text-primary-foreground font-bold rounded-[14px] transition-all duration-200 shadow-md hover:shadow-primary/25"
          >
            <Bike className="w-[18px] h-[18px] mr-2" /> Delivered
          </Button>
        );
      }
    }

    if (order.status === 'DELIVERED' && mode !== 'waiting') {
      return (
        <div className="w-full text-center py-3.5 text-[12px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/30 rounded-[14px] border border-border/50">
          Completed
        </div>
      );
    }

    return null;
  };

  const timeDisplay = order.deliveredAt && order.status === 'DELIVERED'
    ? `${format(order.deliveredAt, 'hh:mm a')}`
    : `${formatDistanceToNow(order.createdAt)} ago`;

  // Standard modes vs Fullscreen specific logic
  const isFullScreenMode = mode === 'kitchen' || mode === 'waiting';
  
  // Strict Width Rules for Dashboard and Orders (Max 380px, w-full, no overflow)
  const widthClass = isFullScreenMode 
    ? (className || 'w-full') 
    : 'w-full max-w-[380px] shrink-0';

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card rounded-[20px] border-[1.5px] overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1",
        widthClass,
        colors.cardBorder,
        className
      )}
    >
      {/* LINE 1: Header - Flex Wrap for tight spaces */}
      {mode === 'kitchen' ? (
        <div className="p-4 sm:p-5 border-b-2 border-border/60 bg-secondary/20 shrink-0 flex items-center justify-center">
          <span className="text-3xl sm:text-4xl xl:text-5xl font-black text-foreground tracking-tight">
            {order.orderNumber}
          </span>
        </div>
      ) : (
        <div className={cn(
          "flex flex-wrap items-center gap-2 p-4 pb-3 shrink-0",
          mode === 'waiting' && "flex-col justify-center flex-1 h-full p-8"
        )}>
          <span className={cn(
            "font-black leading-none text-foreground tracking-tighter truncate",
            mode === 'waiting' ? "text-6xl sm:text-8xl lg:text-9xl mb-4" : "text-[18px] sm:text-[20px] max-w-[130px]"
          )}>
            {order.orderNumber}
          </span>
          <div className={cn(
            "rounded-[6px] font-black uppercase tracking-wider flex items-center justify-center shrink-0",
            colors.badgeBg,
            mode === 'waiting' ? "px-6 py-3 text-3xl sm:text-5xl lg:text-6xl my-4 rounded-[16px]" : "px-2 py-1 text-[10px]"
          )}>
            {order.status}
          </div>
          <span className={cn(
            "font-semibold text-muted-foreground shrink-0 text-right",
            mode === 'waiting' ? "text-2xl sm:text-4xl mt-auto" : "text-[11px] sm:text-[12px] ml-auto"
          )}>
            {timeDisplay}
          </span>
        </div>
      )}

      {/* LINE 2: Customer Info */}
      {mode !== 'waiting' && mode !== 'kitchen' && (
        <div className="px-4 py-2.5 bg-secondary/20 border-y border-border/40 shrink-0 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary border border-border/60 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-[12px] sm:text-[13px] font-bold text-foreground truncate flex-1">Walk-in</span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-background px-2 py-0.5 rounded-[6px] border border-border/50 shrink-0">
            Takeaway
          </span>
        </div>
      )}

      {/* LINE 3: Items */}
      {mode !== 'waiting' && (
        <div className={cn(
          "flex-1 p-4 flex flex-col gap-4 bg-card overflow-y-auto min-h-0",
          mode === 'kitchen' && "p-5 gap-5"
        )}>
          {order.items.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col pb-4 border-b border-border/40 last:border-0 last:pb-0">
              <div className="flex justify-between items-start gap-3">
                <span className={cn(
                  "font-bold text-foreground leading-tight text-[14px] sm:text-[15px] flex-1 break-words",
                  mode === 'kitchen' ? "text-2xl sm:text-3xl font-black" : (isFullScreenMode && "text-[24px]")
                )}>
                  {item.name}
                </span>
                <span className={cn(
                  "font-black bg-secondary text-foreground px-2.5 py-1 rounded-[8px] border border-border/50 shrink-0 text-[12px] sm:text-[13px] ml-2",
                  mode === 'kitchen' ? "text-xl sm:text-2xl px-3.5 py-1 rounded-xl bg-foreground text-background" : (isFullScreenMode && "text-[20px]")
                )}>
                  ×{item.quantity}
                </span>
              </div>

              {item.notes && (
                <div className={cn(
                  "mt-2.5 text-[12px] font-semibold italic px-3 py-2 rounded-[8px] whitespace-pre-line border-l-2",
                  colors.noteBg,
                  mode === 'kitchen' ? "text-lg sm:text-xl font-bold mt-3 px-4 py-2.5 rounded-xl border-l-4 bg-orange-500/10 text-orange-400 border-orange-500" : (isFullScreenMode && "text-[18px] mt-4 px-4 py-3")
                )}>
                  {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LINE 4: Footer */}
      {renderActions() && (
        <div className="p-4 pt-0 shrink-0 bg-card mt-auto">
          {renderActions()}
        </div>
      )}
    </div>
  );
}
