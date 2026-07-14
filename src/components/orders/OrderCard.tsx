'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/context/POSContext';
import { formatDistanceToNow, format } from 'date-fns';
import { Utensils, CheckCircle2, Bike, User, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  mode: 'orders' | 'kitchen' | 'waiting' | 'delivered' | 'dashboard';
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
  className?: string;
}

export function OrderCard({ order, mode, onUpdateStatus, className = '' }: OrderCardProps) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const updateElapsed = () => {
      const diffMs = Math.max(0, Date.now() - order.createdAt);
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      if (mode === 'waiting') {
        setElapsed(`${String(diffMins).padStart(2, '0')} min`);
      } else {
        setElapsed(`${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`);
      }
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt, mode]);

  // Premium Status Color System across all pages
  const getColors = () => {
    switch (order.status) {
      case 'NEW':
        return {
          cardBorder: 'border-blue-500/25 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(59,130,246,0.14)]',
          leftBorder: 'border-l-[6px] border-l-blue-500',
          badgeBg: 'bg-blue-500/15 border border-blue-500/30 text-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
          noteBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        };
      case 'PREPARING':
        return {
          cardBorder: 'border-orange-500/25 hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(249,115,22,0.14)]',
          leftBorder: 'border-l-[6px] border-l-orange-500',
          badgeBg: 'bg-orange-500/15 border border-orange-500/30 text-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.15)]',
          noteBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        };
      case 'READY':
        return {
          cardBorder: 'border-green-500/25 hover:border-green-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.14)]',
          leftBorder: 'border-l-[6px] border-l-green-500',
          badgeBg: 'bg-green-500/15 border border-green-500/30 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)]',
          noteBg: 'bg-green-500/10 text-green-400 border border-green-500/20',
        };
      case 'DELIVERED':
        return {
          cardBorder: 'border-border/60 hover:border-border/90 hover:shadow-lg opacity-90 hover:opacity-100 transition-opacity',
          leftBorder: 'border-l-[6px] border-l-gray-400 dark:border-l-gray-500',
          badgeBg: 'bg-secondary border border-border/80 text-muted-foreground',
          noteBg: 'bg-secondary/50 text-muted-foreground border border-border/50',
        };
      default:
        return {
          cardBorder: 'border-border/50 hover:border-border/80 hover:shadow-lg',
          leftBorder: 'border-l-[6px] border-l-border',
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
            className="h-10 sm:h-11 px-5 sm:px-6 text-[14px] sm:text-[15px] bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 text-white font-bold rounded-[12px] transition-all duration-150 shadow-md hover:shadow-orange-500/25 shrink-0"
          >
            <Utensils className="w-4 h-4 mr-2 shrink-0" /> Preparing
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="h-10 sm:h-11 px-5 sm:px-6 text-[14px] sm:text-[15px] bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 text-white font-bold rounded-[12px] transition-all duration-150 shadow-md hover:shadow-green-500/25 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> Ready
          </Button>
        );
      }
      if (order.status === 'READY') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
            className="h-10 sm:h-11 px-5 sm:px-6 text-[14px] sm:text-[15px] bg-primary hover:bg-primary/90 hover:-translate-y-0.5 text-primary-foreground font-bold rounded-[12px] transition-all duration-150 shadow-md hover:shadow-primary/25 shrink-0"
          >
            <Bike className="w-4 h-4 mr-2 shrink-0" /> Delivered
          </Button>
        );
      }
    }

    if (mode === 'kitchen') {
      if (order.status === 'NEW') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            className="h-12 px-7 text-base bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 text-white font-black rounded-[14px] transition-all duration-150 shadow-lg shrink-0"
          >
            <Utensils className="w-5 h-5 mr-2 shrink-0" /> PREPARING
          </Button>
        );
      }
      if (order.status === 'PREPARING') {
        return (
          <Button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="h-12 px-7 text-base bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 text-white font-black rounded-[14px] transition-all duration-150 shadow-lg shrink-0"
          >
            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" /> READY
          </Button>
        );
      }
    }

    if (order.status === 'DELIVERED' && mode !== 'waiting') {
      return (
        <div className="px-4 py-2 text-[12px] sm:text-[13px] font-black uppercase tracking-wider text-muted-foreground bg-secondary/80 rounded-[10px] border border-border/60 flex items-center gap-1.5 shrink-0">
          <Check className="w-4 h-4 text-green-500 shrink-0" /> Completed
        </div>
      );
    }

    return null;
  };

  const hasNotes = order.items.some(item => item.notes && item.notes.trim().length > 0);
  const allNotes = order.items
    .filter(item => item.notes && item.notes.trim().length > 0)
    .map(item => `${item.name}: ${item.notes}`);

  // ==========================================
  // MODE 1: WAITING DISPLAY TV (Horizontal 1 Line = 1 Container, Center Status Text, Compact Waiting + CreatedAt Below)
  // ==========================================
  if (mode === 'waiting') {
    const isReady = order.status === 'READY';
    const waitingTimeStr = elapsed || `${Math.floor(Math.max(0, Date.now() - order.createdAt) / 60000)} min`;

    return (
      <div
        className={cn(
          "h-full w-full min-h-0 min-w-0 rounded-[18px] border-[1px] bg-card text-card-foreground shadow-md transition-all duration-150 p-4 sm:p-6 flex flex-row items-center justify-between gap-4 sm:gap-6 overflow-hidden relative",
          colors.cardBorder,
          colors.leftBorder,
          className
        )}
      >
        {/* Left Section: Order Number ONLY (Status badge removed as requested) */}
        <div className="flex items-center shrink-0">
          <span className="text-[40px] sm:text-[60px] lg:text-[72px] font-black tracking-tight text-foreground leading-none shrink-0">
            {order.orderNumber}
          </span>
        </div>

        {/* Center Section: Status Centered as Bold Text Format (Half Size) */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-4 truncate text-center">
          <span className={cn(
            "text-[14px] sm:text-[20px] lg:text-[26px] font-black tracking-wider uppercase leading-none truncate px-2",
            isReady ? "text-green-500 animate-pulse" : "text-orange-500"
          )}>
            {isReady ? "READY FOR PICKUP" : "PREPARING ORDER"}
          </span>
        </div>

        {/* Right Section: Compact Waiting Time with CreatedAt Right Below It */}
        <div className="flex flex-col items-end justify-center gap-1 shrink-0 ml-auto">
          <span className="bg-secondary/90 text-foreground px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-[14px] border border-border/70 font-black text-[18px] sm:text-[24px] lg:text-[28px] tracking-wide shadow-sm shrink-0 whitespace-nowrap">
            Waiting : <span className={cn(isReady ? "text-green-500" : "text-orange-500")}>{waitingTimeStr}</span>
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground/80 uppercase tracking-wider shrink-0 whitespace-nowrap">
            Created: {format(order.createdAt, 'hh:mm a')}
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 2: KITCHEN DISPLAY TV (Horizontal 1 Line = 1 Order, Center Items, Compact Timer + CreatedAt Below)
  // ==========================================
  if (mode === 'kitchen') {
    const timerStr = elapsed || '00:00';

    return (
      <div
        className={cn(
          "h-full w-full min-h-0 min-w-0 rounded-[18px] border-[1px] bg-card text-card-foreground shadow-md transition-all duration-150 p-4 sm:p-6 flex flex-row items-center justify-between gap-4 sm:gap-6 overflow-hidden relative",
          colors.cardBorder,
          colors.leftBorder,
          className
        )}
      >
        {/* Left Section: Order Number ONLY (Status badge removed as requested) */}
        <div className="flex items-center shrink-0">
          <span className="text-[40px] sm:text-[60px] lg:text-[72px] font-black tracking-tight text-foreground leading-none shrink-0">
            {order.orderNumber}
          </span>
        </div>

        {/* Middle Section: Centered Items & Quantities */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 px-4 sm:px-8 min-w-0 overflow-hidden max-h-full py-1 text-center">
          {order.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="inline-flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <span className="font-black text-foreground tracking-tight text-[22px] sm:text-[30px] lg:text-[36px] whitespace-nowrap leading-none">
                {item.name}
              </span>
              <span className="font-black text-orange-500 tracking-tight text-[22px] sm:text-[30px] lg:text-[36px] shrink-0 whitespace-nowrap leading-none">
                ×{item.quantity}
              </span>
              {idx < order.items.length - 1 && (
                <span className="text-muted-foreground/40 font-black text-[22px] sm:text-[30px] lg:text-[36px] mx-1 sm:mx-2.5 select-none leading-none">
                  •
                </span>
              )}
            </div>
          ))}

          {hasNotes && (
            <div className="inline-flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 text-orange-500 text-[16px] sm:text-[20px] font-extrabold px-3.5 py-1 rounded-xl whitespace-nowrap ml-2 shadow-sm">
              <span>Notes: {allNotes.join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Right Section: Compact Timer with CreatedAt Right Below It */}
        <div className="flex flex-col items-end justify-center gap-1 shrink-0 ml-auto">
          <span className="bg-secondary/90 text-foreground px-4 sm:px-5 py-1.5 sm:py-2 rounded-[12px] border border-border/70 font-black text-[18px] sm:text-[22px] lg:text-[24px] tracking-wide shadow-sm shrink-0 whitespace-nowrap">
            Timer : {timerStr}
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-muted-foreground/80 uppercase tracking-wider shrink-0 whitespace-nowrap">
            Created: {format(order.createdAt, 'hh:mm a')}
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 3: STANDARD HORIZONTAL ORDER CARD
  // (Used across Dashboard, Orders, and Delivered)
  // ==========================================
  return (
    <div
      className={cn(
        "w-full rounded-[18px] border-[1px] bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-150 ease-in-out hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden relative min-h-[140px]",
        colors.cardBorder,
        colors.leftBorder,
        className
      )}
    >
      {/* Top Bar: Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-2xl sm:text-[32px] font-black tracking-tight text-foreground leading-none">
            {order.orderNumber}
          </span>
          <div className={cn(
            "rounded-[10px] font-black uppercase tracking-wider px-3.5 py-1 text-[13px] sm:text-[16px] shrink-0",
            colors.badgeBg
          )}>
            {order.status}
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground font-semibold text-[13px] sm:text-[14px] shrink-0 ml-auto">
          <Clock className="w-4 h-4 text-muted-foreground/80 shrink-0" />
          <span>{format(order.createdAt, 'hh:mm a')}</span>
        </div>
      </div>

      {/* Middle Section: Items, Customer, Notes */}
      <div className="py-3.5 space-y-2.5 flex-1 flex flex-col justify-center">
        {/* Items Horizontal Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {order.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="inline-flex items-center gap-2 bg-secondary/60 hover:bg-secondary/80 border border-border/60 rounded-[12px] px-3 py-1.5 transition-colors"
            >
              <span className="font-bold text-foreground tracking-tight text-[16px] sm:text-[20px]">
                {item.name}
              </span>
              <span className="font-black bg-foreground text-background px-2 py-0.5 rounded-[8px] text-[13px] sm:text-[14px] shrink-0 shadow-sm">
                ×{item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Customer & Notes Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 text-[13px] sm:text-[14px]">
          <div className="flex items-center gap-2 text-muted-foreground font-bold">
            <User className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground">Customer : Walk-in Customer</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded-[6px] border border-border/60">
              Takeaway
            </span>
          </div>

          {hasNotes && (
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-[8px] text-[13px] sm:text-[14px] font-semibold italic border max-w-full break-words",
              colors.noteBg
            )}>
              <span className="font-black not-italic uppercase tracking-wider text-[11px] opacity-85 shrink-0">Notes :</span>
              <span>{allNotes.join(' • ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50 shrink-0 mt-auto text-[13px] sm:text-[14px]">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>
            {order.deliveredAt && order.status === 'DELIVERED'
              ? `Delivered at ${format(order.deliveredAt, 'hh:mm a')}`
              : `Created ${formatDistanceToNow(order.createdAt)} ago`}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {renderActions()}
        </div>
      </div>
    </div>
  );
}

