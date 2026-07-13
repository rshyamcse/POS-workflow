'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  Utensils,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePOS } from '@/context/POSContext';

export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { orders } = usePOS();

  // Real-time Order Counts
  const counts = {
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    ready: orders.filter(o => o.status === 'READY').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    total: orders.filter(o => o.status !== 'DELIVERED').length // Active total
  };

  // Toggle Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-xl shadow-sm shrink-0">

      {/* LEFT: Live POS Status & Mobile Toggle */}
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

        <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wide text-green-600 dark:text-green-400 uppercase">
            Live Offline POS
          </span>
        </div>
      </div>

      {/* CENTER: Global Search Bar */}
      <div className="flex flex-1 items-center justify-center px-4 max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search Orders, Customers, Menu (Ctrl + K)..."
            className="w-full bg-secondary/50 pl-10 pr-16 h-10 border-border/60 rounded-full focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-sm placeholder:text-muted-foreground/80 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-background/80 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-sm">
            <span>Ctrl</span>K
          </div>
        </div>
      </div>

      {/* RIGHT: Operational Summary, Orders, Notifications, Theme Toggle */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">

        {/* Status Summary (Desktop Only) */}
        <div className="hidden xl:flex items-center gap-4 bg-secondary/40 px-4 py-1.5 rounded-full border border-border/60 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-1.5 text-orange-500 font-semibold" title="Preparing Orders">
            <Utensils className="h-4 w-4" />
            <span className="text-xs uppercase text-muted-foreground">Preparing:</span>
            <span className="text-sm font-bold">{counts.preparing}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5 text-green-500 font-semibold" title="Ready Orders">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs uppercase text-muted-foreground">Ready:</span>
            <span className="text-sm font-bold">{counts.ready}</span>
          </div>
        </div>

        {/* Orders Button + Badge */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="relative rounded-full h-10 px-4 gap-2 border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary font-semibold transition-all shadow-sm">
              <ShoppingBag className="h-4 w-4" />
              <span>Active Orders ({counts.total})</span>
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-2xl border-border/80 p-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Live Order Summary
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between rounded-lg py-2.5 px-3 font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Preparing
              </span>
              <span className="rounded-full bg-orange-500/10 text-orange-500 font-bold px-2 py-0.5 text-xs">{counts.preparing}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between rounded-lg py-2.5 px-3 font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Ready for Pickup
              </span>
              <span className="rounded-full bg-green-500/10 text-green-500 font-bold px-2 py-0.5 text-xs">{counts.ready}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between rounded-lg py-2.5 px-3 font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-500" />
                Delivered Today
              </span>
              <span className="rounded-full bg-secondary text-foreground font-bold px-2 py-0.5 text-xs">{counts.delivered}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={
              <Link href="/dashboard/orders" className="flex items-center justify-center gap-1 w-full rounded-lg font-semibold text-primary py-2 mt-1">
                View All Orders <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            } />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="h-10 w-10 rounded-full hover:bg-secondary/80 border border-transparent hover:border-border/50 transition-all text-foreground shrink-0"
          title="Toggle Dark/Light Theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
