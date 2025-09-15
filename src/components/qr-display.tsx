"use client";

import { Download, QrCode } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";

type QrDisplayProps = {
  qrDataUrl: string;
  qrValue: string;
};

export function QrDisplay({
  qrDataUrl,
  qrValue,
}: QrDisplayProps) {

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    // Sanitize qrValue to create a safe filename
    const safeFilename =
      qrValue
        .substring(0, 30)
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase() || "qr-code";
    link.download = `${safeFilename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>QR Code Preview</CardTitle>
        <CardDescription>
          Your generated QR code will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {qrDataUrl ? (
              <motion.div
                key={qrDataUrl}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={qrDataUrl}
                  alt={qrValue || "Generated QR Code"}
                  width={512}
                  height={512}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QrCode
                  className="h-24 w-24 text-muted-foreground"
                  strokeWidth={1}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="w-full"
        >
          <Download className="mr-2" />
          Download PNG
        </Button>
      </CardFooter>
    </Card>
  );
}
