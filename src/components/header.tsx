"use client";

import { QrCode } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <QrCode className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              My Instant QR
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
