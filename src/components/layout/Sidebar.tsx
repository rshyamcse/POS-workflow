'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePOS } from '@/context/POSContext';
import {
  LayoutDashboard,
  Store,
  ChefHat,
  MonitorPlay,
  Bike,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Moon,
  Sun,
  User,
  Circle,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: Store },
  { href: '/dashboard/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { href: '/dashboard/waiting', label: 'Waiting Display', icon: MonitorPlay },
  { href: '/dashboard/delivered', label: 'Delivered', icon: Bike },
];

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = usePOS();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen flex-col border-r border-border/80 bg-background transition-all duration-300 ease-in-out shrink-0 select-none shadow-sm",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Store Information Profile Section */}
      <div className="p-6 border-b border-border/50 flex flex-col shrink-0 relative group">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/50 border border-border shadow-inner group-hover:shadow-md transition-shadow">
            <Store className="h-7 w-7 text-primary" />
            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-lg font-black text-foreground truncate">
                QSW CAFE
              </span>
              <div className="flex items-center text-xs font-semibold text-muted-foreground mt-0.5 gap-1.5">
                <span className="text-green-500 flex items-center gap-1"><Circle className="w-2 h-2 fill-green-500" /> Online</span>
                <span>•</span>
                <span>Morning Shift</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Collapse Button (Desktop Only) */}
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-40 h-7 w-7 rounded-full border border-border bg-card shadow-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-transform duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-[18px] px-4 scrollbar-thin scrollbar-thumb-border/50">
        {!collapsed && (
          <div className="px-2 pb-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
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
                "group relative flex items-center gap-4 rounded-[16px] p-2 pr-4 text-[15px] font-semibold transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-white text-black shadow-lg shadow-black/5"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center pr-2"
              )}
            >
              {/* Animated Left Indicator */}
              {!isActive && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 rounded-r-md bg-foreground opacity-0 group-hover:h-5 group-hover:opacity-100 transition-all duration-300" />
              )}

              {/* Rounded Square Icon */}
              <div className={cn(
                "flex items-center justify-center h-[44px] w-[44px] shrink-0 rounded-[12px] transition-colors duration-300",
                isActive ? "bg-transparent text-black" : "bg-background border border-border/50 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20"
              )}>
                <item.icon className="h-5 w-5" />
              </div>

              {!collapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={LinkContent} />
                <TooltipContent side="right" className="font-semibold px-4 py-2 shadow-xl border-border/80 text-[13px] rounded-xl bg-card text-foreground">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{LinkContent}</div>;
        })}
      </nav>

      {/* Bottom Actions Section */}
      <div className="p-4 border-t border-border/50 bg-secondary/10 shrink-0 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-card rounded-[14px] border border-border/40 shadow-sm">
            <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-foreground">Jane Doe</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Cashier</span>
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className={cn("flex items-center gap-2", collapsed ? "flex-col" : "")}>
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon" className="h-12 flex-1 rounded-[12px] bg-secondary/50 hover:bg-secondary text-foreground hover:shadow-sm">
                <Settings className="h-5 w-5" />
              </Button>
            } />
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={
              <Button onClick={toggleTheme} variant="ghost" size="icon" className="h-12 flex-1 rounded-[12px] bg-secondary/50 hover:bg-secondary text-foreground hover:shadow-sm">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            } />
            <TooltipContent>Toggle Theme</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon" className="h-12 flex-1 rounded-[12px] bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors">
                <LogOut className="h-5 w-5" />
              </Button>
            } />
            <TooltipContent>Sign Out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
