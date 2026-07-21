"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

// Offline Banner
export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-error px-4 py-3 shadow-md flex items-center justify-center gap-3"
    >
      <WifiOff className="w-4 h-4 text-white" />
      <span className="text-white text-sm font-inter font-medium">
        You&apos;re offline. Your progress is saved locally and will sync when reconnected.
      </span>
    </motion.div>
  );
}

// Back Online Banner
export function BackOnlineBanner({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-success px-4 py-3 shadow-md flex items-center justify-center gap-3"
    >
      <Wifi className="w-4 h-4 text-white" />
      <span className="text-white text-sm font-inter font-medium">
        Back online! Your audio loading is restored.
      </span>
    </motion.div>
  );
}

// Audio Load Error
export function AudioLoadError({
  onRetry,
  onSkip,
}: {
  onRetry: () => void;
  onSkip?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="skeu-raised p-6 text-center space-y-4 max-w-md mx-auto"
    >
      <div className="w-12 h-12 rounded-full skeu-inset flex items-center justify-center mx-auto text-warning">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-outfit font-bold text-lg text-text">
          Audio couldn&apos;t load
        </h3>
        <p className="text-sm text-text-secondary font-inter mt-1">
          We had trouble fetching this variation. Check your connection or tap retry.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="skeu-btn-primary px-5 py-2.5 font-outfit font-semibold text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="skeu-btn px-5 py-2.5 font-outfit font-semibold text-sm text-text-secondary"
          >
            Skip
          </button>
        )}
      </div>
    </motion.div>
  );
}

// Slow Connection Indicator
export function SlowConnectionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="skeu-inset px-4 py-3 flex items-center gap-3 text-sm rounded-xl border border-warning/30"
    >
      <Loader2 className="w-4 h-4 text-warning animate-spin shrink-0" />
      <span className="text-text-secondary font-inter">
        Slow connection detected. Audio might take a moment longer to buffer...
      </span>
    </motion.div>
  );
}

// Loading Skeleton for Segment Card
export function SegmentCardSkeleton() {
  return (
    <div className="skeu-raised p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full shimmer shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-5 w-32 rounded-lg shimmer" />
          <div className="h-3.5 w-24 rounded-md shimmer" />
        </div>
      </div>
    </div>
  );
}

// Page Loading Skeleton
export function PollPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <header className="flex items-center justify-between px-6 py-4 skeu-flat">
        <div className="h-5 w-16 rounded shimmer" />
        <div className="h-5 w-28 rounded shimmer" />
        <div className="w-16" />
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center space-y-3 w-full">
          <div className="w-12 h-12 rounded-2xl shimmer mx-auto" />
          <div className="h-8 w-56 rounded-lg shimmer mx-auto" />
          <div className="h-4 w-40 rounded-md shimmer mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <SegmentCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
