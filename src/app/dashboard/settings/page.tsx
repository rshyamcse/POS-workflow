'use client';

import React, { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { Settings, Check, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RestaurantSettingsPage() {
  const { settings, updateSettings } = usePOS();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <span>Restaurant Settings</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">Configure offline takeaway POS store details and preferences.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <Card className="border-border/60 rounded-3xl bg-card shadow-sm">
        <CardHeader className="bg-secondary/20 border-b border-border/50">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <span>Store Profile & Financials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Restaurant Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Subtitle / Slogan</label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Address</label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Tax Rate (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Currency Symbol</label>
                <Input
                  value={form.currencySymbol}
                  onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                  className="h-11 rounded-xl font-bold"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button type="submit" className="h-12 px-8 rounded-xl font-black text-base shadow-lg">
                Save Restaurant Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
