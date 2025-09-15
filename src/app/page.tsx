"use client";

import { useState } from "react";
import { AppHeader } from "@/components/header";
import { QrGenerator } from "@/components/qr-generator";
import { QrDisplay } from "@/components/qr-display";

export default function Home() {
  const [qrValue, setQrValue] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const handleQrGenerated = (value: string, dataUrl: string) => {
    setQrValue(value);
    setQrDataUrl(dataUrl);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/40">
      <AppHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground/90 to-foreground/60">
            Create Your QR Code Instantly
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Generate QR codes simple, fast, and free.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-[1fr_400px] items-start">
          <QrGenerator onQrGenerated={handleQrGenerated} />
          <div className="sticky top-24 h-min">
            <QrDisplay qrDataUrl={qrDataUrl} qrValue={qrValue} />
          </div>
        </div>
      </main>
    </div>
  );
}
