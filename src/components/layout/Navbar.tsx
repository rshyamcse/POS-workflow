'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '@/context/POSContext';
import {
  Search,
  Utensils,
  CheckCircle2,
  Bike,
  Sparkles,
  Clock,
  Menu,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { orders } = usePOS();
  const [time, setTime] = useState<Date | null>(null);

  // Status Counts
  const counts = {
    NEW: orders.filter(o => o.status === 'NEW').length,
    PREPARING: orders.filter(o => o.status === 'PREPARING').length,
    READY: orders.filter(o => o.status === 'READY').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
  };

  // Refs for animation triggers
  const prevCounts = useRef(counts);
  const [pulse, setPulse] = useState<Record<string, boolean>>({
    NEW: false, PREPARING: false, READY: false, DELIVERED: false
  });

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger pulse animations on change
  useEffect(() => {
    const newPulse = { ...pulse };
    let changed = false;
    (Object.keys(counts) as Array<keyof typeof counts>).forEach(key => {
      if (counts[key] !== prevCounts.current[key]) {
        newPulse[key] = true;
        changed = true;
      }
    });

    if (changed) {
      setPulse(newPulse);
      setTimeout(() => setPulse({ NEW: false, PREPARING: false, READY: false, DELIVERED: false }), 1000);
      prevCounts.current = counts;
    }
  }, [counts, pulse]);

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/80 bg-background/80 backdrop-blur-2xl px-6 shrink-0 shadow-sm">

      {/* Left: Brand / Search */}
      <div className="flex items-center gap-6 flex-1">
        {/* Compact Live Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 shadow-sm shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[11px] font-black tracking-wider text-foreground uppercase">LIVE</span>
          <span className="text-[11px] font-bold text-muted-foreground hidden sm:block">Online</span>
        </div>

        {/* Hover-Expand Search */}
        <div className="relative group w-10 overflow-hidden hover:w-[220px] transition-all duration-300 ease-in-out bg-secondary/40 border-border/60 rounded-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-transparent border-0 h-10 w-[220px] focus-visible:ring-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Center: Condensed Premium Status Pills */}
      <div className="hidden lg:flex items-center gap-2 justify-center shrink-0">
        <StatusPill
          label="New"
          count={counts.NEW}
          icon={Sparkles}
          colorClass="text-blue-500"
          bgClass="bg-blue-500/5 hover:bg-blue-500/10"
          borderClass="border-blue-500/20 hover:border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0)] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          isPulsing={pulse.NEW}
        />
        <StatusPill
          label="Preparing"
          count={counts.PREPARING}
          icon={Utensils}
          colorClass="text-orange-500"
          bgClass="bg-orange-500/5 hover:bg-orange-500/10"
          borderClass="border-orange-500/20 hover:border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0)] hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]"
          isPulsing={pulse.PREPARING}
        />
        <StatusPill
          label="Ready"
          count={counts.READY}
          icon={CheckCircle2}
          colorClass="text-green-500"
          bgClass="bg-green-500/5 hover:bg-green-500/10"
          borderClass="border-green-500/20 hover:border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0)] hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
          isPulsing={pulse.READY}
        />
        <StatusPill
          label="Delivered"
          count={counts.DELIVERED}
          icon={Bike}
          colorClass="text-muted-foreground"
          bgClass="bg-secondary/40 hover:bg-secondary"
          borderClass="border-border/40 hover:border-border/80 shadow-none"
          isPulsing={pulse.DELIVERED}
        />
      </div>

      {/* Right: Tools & Profile */}
      <div className="flex items-center justify-end gap-4 flex-1 shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-bold tracking-wide">
            {time ? format(time, 'hh:mm:ss a') : '00:00:00'}
          </span>
        </div>

        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full relative border-border/50 bg-secondary/20 hover:bg-secondary">
          <Bell className="h-4 w-4 text-foreground" />
          {counts.NEW > 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>

        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary/60 border-2 border-background shadow-sm shrink-0 cursor-pointer overflow-hidden flex items-center justify-center text-primary-foreground font-bold text-xs">
          JD
        </div>
      </div>
    </header>
  );
}

// Condensed Sub-component for Status Pills
function StatusPill({ label, count, icon: Icon, colorClass, bgClass, borderClass, isPulsing }: any) {
  return (
    <button className={cn(
      "flex items-center gap-2 px-4 h-[40px] rounded-full border transition-all duration-200 ease-in-out cursor-pointer",
      bgClass, borderClass,
      isPulsing && "scale-105 shadow-md"
    )}>
      <Icon className={cn("w-[16px] h-[16px]", colorClass)} />
      <span className={cn("text-[13px] font-bold tracking-wide", colorClass)}>
        {label}
      </span>
      <span className="text-[16px] font-black text-foreground ml-1">
        {count}
      </span>
    </button>
  );
}
