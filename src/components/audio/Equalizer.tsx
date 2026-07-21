"use client";

import { useMemo } from "react";

interface EqualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export function Equalizer({ isPlaying, barCount = 5 }: EqualizerProps) {
  const bars = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        id: i,
        speed: 0.3 + Math.random() * 0.4,
        minHeight: 3 + Math.random() * 3,
        maxHeight: 10 + Math.random() * 14,
        delay: Math.random() * 0.3,
      })),
    [barCount]
  );

  return (
    <div className="flex items-end gap-[3px] h-6 px-2 py-1 skeu-inset rounded-lg">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="w-[4px] rounded-full bg-gradient-to-t from-primary-dark to-primary-light shadow-sm"
          style={
            isPlaying
              ? {
                  animation: `eq-bounce ${bar.speed}s ease-in-out ${bar.delay}s infinite alternate`,
                  ["--eq-min" as string]: `${bar.minHeight}px`,
                  ["--eq-max" as string]: `${bar.maxHeight}px`,
                  height: `${bar.maxHeight}px`,
                }
              : {
                  height: `${bar.minHeight}px`,
                  transition: "height 0.3s",
                }
          }
        />
      ))}
    </div>
  );
}
