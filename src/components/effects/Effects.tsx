"use client";

import { useMemo, useEffect, useState } from "react";

// Floating particle background effect — soft golden/warm dust motes for day theme
export function ParticleField({ count = 25 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 12,
        size: 3 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle rounded-full bg-primary-dark/20 blur-[1px]"
          style={{
            position: "absolute",
            top: "-20px",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Confetti explosion effect
export function ConfettiExplosion({ duration = 4500 }: { duration?: number }) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        animDuration: 2.5 + Math.random() * 2,
        color: [
          "#6366f1", "#f59e0b", "#22c55e", "#ec4899",
          "#3b82f6", "#f43f5e", "#818cf8", "#fbbf24",
        ][Math.floor(Math.random() * 8)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
        shape: Math.random() > 0.5 ? "circle" : "rect",
      })),
    []
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece shadow-sm"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.animDuration}s`,
            width: p.shape === "circle" ? `${p.size}px` : `${p.size * 0.6}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "3px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Skeuomorphic Embossed Border wrapper
export function GlowBorder({
  children,
  className = "",
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {active && (
        <div className="absolute -inset-[3px] rounded-[22px] bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-sm animate-pulse" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

// Pulse dot indicator
export function PulseDot({
  color = "bg-success",
  size = "w-2.5 h-2.5",
}: {
  color?: string;
  size?: string;
}) {
  return (
    <span className="relative flex items-center justify-center">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
      />
      <span className={`relative inline-flex rounded-full ${size} ${color} shadow-sm`} />
    </span>
  );
}
