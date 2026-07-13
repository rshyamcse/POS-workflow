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
  Bell,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { orders, globalSearchQuery, setGlobalSearchQuery } = usePOS();
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
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border/80 bg-[#FFFFFF]/80 dark:bg-[#111111]/80 backdrop-blur-2xl px-6 shrink-0 shadow-sm">

      {/* Left: Brand / Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Compact Live Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 shadow-sm shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span className="text-[11px] font-black tracking-wider text-foreground uppercase">LIVE</span>
          <span className="text-[11px] font-bold text-muted-foreground hidden sm:block">Online</span>
        </div>

        {/* Responsive Expandable Search */}
        <div className="relative group w-10 overflow-hidden focus-within:w-[150px] sm:focus-within:w-[220px] hover:w-[150px] sm:hover:w-[220px] transition-all duration-300 ease-in-out bg-secondary/40 border border-border/20 focus-within:border-border/60 hover:border-border/60 rounded-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground group-hover:text-foreground transition-colors pointer-events-none" />
          <Input
            placeholder="Search Order ID..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="pl-9 bg-transparent border-0 h-10 w-[150px] sm:w-[220px] focus-visible:ring-0 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer focus:cursor-text"
          />
        </div>
      </div>

      {/* Center: Status Dropdown */}
      <div className="hidden lg:flex items-center justify-center shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center gap-3 px-5 h-[40px] rounded-full bg-secondary/40 border border-border/60 hover:bg-secondary transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
            (pulse.NEW || pulse.PREPARING || pulse.READY || pulse.DELIVERED) && "scale-105 shadow-md shadow-primary/10 border-primary/40 bg-primary/5"
          )}>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <Menu className="w-4 h-4 text-muted-foreground" />
                {(counts.NEW > 0 || pulse.NEW) && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </div>
              <span className="text-[13px] font-bold text-foreground">Order Status</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 rounded-xl border-border/60 shadow-xl bg-background p-2">
            <DropdownMenuItem className="flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer focus:bg-blue-500/10 focus:text-blue-500 transition-colors group">
              <div className="flex items-center gap-3 font-semibold text-foreground group-focus:text-blue-500">
                <Sparkles className="w-4 h-4 text-blue-500" /> New
              </div>
              <span className="font-black text-[15px]">{counts.NEW}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer focus:bg-orange-500/10 focus:text-orange-500 transition-colors group">
              <div className="flex items-center gap-3 font-semibold text-foreground group-focus:text-orange-500">
                <Utensils className="w-4 h-4 text-orange-500" /> Preparing
              </div>
              <span className="font-black text-[15px]">{counts.PREPARING}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer focus:bg-green-500/10 focus:text-green-500 transition-colors group">
              <div className="flex items-center gap-3 font-semibold text-foreground group-focus:text-green-500">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Ready
              </div>
              <span className="font-black text-[15px]">{counts.READY}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1.5 bg-border/50" />
            
            <DropdownMenuItem className="flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer focus:bg-secondary focus:text-foreground transition-colors group">
              <div className="flex items-center gap-3 font-semibold text-muted-foreground group-focus:text-foreground">
                <Bike className="w-4 h-4" /> Delivered
              </div>
              <span className="font-black text-[15px] text-muted-foreground group-focus:text-foreground">{counts.DELIVERED}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
