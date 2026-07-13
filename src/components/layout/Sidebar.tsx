'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Store,
  ChefHat,
  MonitorPlay,
  Bike,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Layers,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: Store },
  { href: '/dashboard/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { href: '/dashboard/waiting', label: 'Waiting Display', icon: MonitorPlay },
  { href: '/dashboard/delivered', label: 'Delivered Orders', icon: Bike },
];

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen flex-col border-r border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 select-none shadow-sm",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Top Section: Logo & Subtitle */}
      <div className="relative flex h-[72px] items-center justify-between border-b border-border/50 px-4 shrink-0">
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className={cn("flex items-center gap-3 overflow-hidden group py-1", collapsed && "mx-auto")}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Store className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap tracking-wider uppercase">
                QSW CAFE...
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Button (Desktop Only) */}
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute -right-3.5 top-6 z-40 h-7 w-7 rounded-full border border-border bg-background shadow-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-transform duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3 scrollbar-thin scrollbar-thumb-border/50">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const LinkContent = (
            <Link
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                collapsed && "justify-center px-0 py-3.5"
              )}
            >
              {/* Active Left Indicator Pill when expanded */}
              {isActive && !collapsed && (
                <span className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-primary-foreground/80" />
              )}

              <item.icon className={cn(
                "shrink-0 transition-transform duration-200 group-hover:scale-110",
                collapsed ? "h-6 w-6" : "h-5 w-5",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={LinkContent} />
                <TooltipContent side="right" className="font-semibold px-3 py-1.5 shadow-xl border-border/80">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{LinkContent}</div>;
        })}
      </nav>
    </aside>
  );
}
