"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Trophy, Share2, Sparkles, ShieldCheck } from "lucide-react";
import { usePollStore, generateReceiptId } from "@/store/usePollStore";
import { TOTAL_SONGS } from "@/lib/songs";
import type { Badge } from "@/types";
import { ConfettiExplosion } from "@/components/effects/Effects";
import { VoterBadge } from "@/components/engagement/Engagement";

export default function ThankYouPage() {
  const { voterName, startTime, listenDurations, votes } =
    usePollStore();
  const [receiptId] = useState(() => generateReceiptId());
  const [showConfetti, setShowConfetti] = useState(true);

  const songsVoted = Object.keys(votes).length;
  const totalListenTime = Object.values(listenDurations).reduce(
    (sum, ms) => sum + ms,
    0
  );
  const totalTimeMinutes = startTime
    ? Math.max(1, Math.round((Date.now() - startTime) / 60000))
    : 8;

  // Calculate badges
  const badges = useMemo(() => {
    const earned: Badge[] = [];

    if (totalTimeMinutes <= 9) {
      earned.push({
        type: "speed_listener",
        label: "Intuitive Listener",
        emoji: "⚡",
        description: `Made genuine heart choices in ${totalTimeMinutes}m!`,
      });
    }

    if (totalListenTime > 150000) {
      earned.push({
        type: "careful_listener",
        label: "Deep Audiophile",
        emoji: "🎧",
        description: `Spent ${Math.round(totalListenTime / 60000)}+ minutes comparing audio nuance`,
      });
    }

    earned.push({
      type: "early_bird",
      label: "Blind Audition Pioneer",
      emoji: "🌟",
      description: "Among the first unbiased worship judges!",
    });

    return earned;
  }, [totalTimeMinutes, totalListenTime]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const displayName = voterName || "Voter";

  const handleShare = () => {
    const text = `I just completed the Worship Music Blind Audition! 🎵 Cast your blind vote too and pick the best arrangements: ${window.location.origin}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative bg-base text-text">
      {showConfetti && <ConfettiExplosion />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full text-center space-y-8"
      >
        {/* Success Tactile Emblem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, delay: 0.2 }}
          className="mx-auto w-24 h-24 rounded-3xl skeu-raised p-3 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-2xl skeu-circle-primary flex items-center justify-center bg-gradient-to-tr from-success to-emerald-400">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
        </motion.div>

        {/* Thank You Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3.5 py-1 rounded-full text-xs font-semibold text-success uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Blind Votes Sealed
          </div>
          <h1 className="text-3xl md:text-4xl font-outfit font-extrabold text-text text-embossed">
            Thank You, {displayName}!
          </h1>
          <p className="text-text-secondary font-inter text-sm md:text-base">
            Your unbiased musical selections have been safely recorded into the tally.
          </p>
        </div>

        {/* Receipt & Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="skeu-raised p-6 space-y-4 rounded-3xl"
        >
          <div className="flex items-center justify-between skeu-inset p-4 rounded-2xl">
            <span className="text-xs font-outfit font-bold text-text-muted uppercase tracking-wider">
              Verification Receipt
            </span>
            <span className="font-outfit font-extrabold text-xl text-primary">
              {receiptId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="skeu-inset p-3.5 rounded-2xl text-center">
              <p className="text-xs text-text-muted font-inter">Tracks Auditioned</p>
              <p className="font-outfit font-extrabold text-text text-2xl mt-0.5">
                {songsVoted}/{TOTAL_SONGS}
              </p>
            </div>
            <div className="skeu-inset p-3.5 rounded-2xl text-center">
              <p className="text-xs text-text-muted font-inter">Time Invested</p>
              <p className="font-outfit font-extrabold text-text text-2xl mt-0.5">
                {totalTimeMinutes}m
              </p>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-outfit font-bold text-text-muted uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-accent" />
              Audition Badges Earned
            </div>
            <div className="space-y-2.5 text-left">
              {badges.map((badge, i) => (
                <VoterBadge key={badge.type} badge={badge} delay={0.5 + i * 0.15} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-2"
        >
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl skeu-btn font-outfit font-extrabold text-base flex items-center justify-center gap-2.5 text-[#128C7E] border border-[#25D366]/40 hover:scale-[1.01] transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share Blind Test on WhatsApp
          </button>
        </motion.div>

        <p className="text-xs text-text-muted font-inter italic">
          &ldquo;Thank you for helping us discern the purest worship arrangements.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
