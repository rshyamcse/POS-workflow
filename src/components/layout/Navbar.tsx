'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  Utensils,
  CheckCircle2,
  ShoppingBag,
  Clock,
  Bike
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { usePOS } from '@/context/POSContext';

export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { orders } = usePOS();

  // Real-time Order Counts for every status
  const counts = {
    new: orders.filter(o => o.status === 'NEW').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    ready: orders.filter(o => o.status === 'READY').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    totalActive: orders.filter(o => o.status !== 'DELIVERED').length,
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-xl shadow-sm shrink-0">

      {/* LEFT: Mobile Toggle & Status Indicator */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-10 w-10 rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-[280px] border-r-0">
            <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wide text-green-600 dark:text-green-400 uppercase">
            Live POS Offline
          </span>
        </div>
      </div>

      {/* CENTER / RIGHT: Status Summary Badges */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
        
        {/* NEW Badge (Blue) */}
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl text-blue-500 font-bold text-xs md:text-sm shadow-sm">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>NEW:</span>
          <span className="bg-blue-500 text-white rounded-md px-1.5 py-0.5 text-xs">{counts.new}</span>
        </div>

        {/* PREPARING Badge (Orange) */}
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-xl text-orange-500 font-bold text-xs md:text-sm shadow-sm">
          <Utensils className="h-3.5 w-3.5 shrink-0" />
          <span>PREPARING:</span>
          <span className="bg-orange-500 text-white rounded-md px-1.5 py-0.5 text-xs">{counts.preparing}</span>
        </div>

        {/* READY Badge (Green) */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-xl text-green-500 font-bold text-xs md:text-sm shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>READY:</span>
          <span className="bg-green-500 text-white rounded-md px-1.5 py-0.5 text-xs">{counts.ready}</span>
        </div>

        {/* DELIVERED Badge (Gray) */}
        <div className="hidden sm:flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 rounded-xl text-muted-foreground font-bold text-xs md:text-sm shadow-sm">
          <Bike className="h-3.5 w-3.5 shrink-0" />
          <span>DELIVERED:</span>
          <span className="bg-muted-foreground/20 text-foreground rounded-md px-1.5 py-0.5 text-xs">{counts.delivered}</span>
        </div>

        <div className="w-px h-6 bg-border/60 hidden sm:block mx-1" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="h-10 w-10 rounded-xl hover:bg-secondary border border-transparent hover:border-border/50 transition-all text-foreground shrink-0"
          title="Toggle Dark/Light Theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
