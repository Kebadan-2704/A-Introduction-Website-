"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Music2,
  Headphones,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { TOTAL_SONGS } from "@/lib/songs";
import { ParticleField } from "@/components/effects/Effects";
import {
  ParticipationCounter,
  VoterNumber,
  HeadphoneBanner,
} from "@/components/engagement/Engagement";

export default function LandingPage() {
  const router = useRouter();
  const { hasCompleted, currentStepIndex, votes, initOrders, resetPoll } =
    usePollStore();
  const [mounted, setMounted] = useState(false);
  const [showHeadphoneBanner, setShowHeadphoneBanner] = useState(true);

  useEffect(() => {
    setMounted(true);
    initOrders();
  }, [initOrders]);

  const hasStarted = Object.keys(votes).length > 0 && !hasCompleted;

  const handleStart = () => {
    initOrders();
    router.push("/poll/1");
  };

  const handleResume = () => {
    const nextStep = currentStepIndex + 1;
    router.push(`/poll/${nextStep}`);
  };

  const handleStartOver = () => {
    if (confirm("Reset your current progress and begin a new blind session?")) {
      resetPoll();
      initOrders();
      router.push("/poll/1");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="w-12 h-12 rounded-full skeu-inset flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-4 md:px-8 py-10 relative bg-base">
      <ParticleField count={20} />

      {/* Top Bar / Badge */}
      <header className="w-full max-w-3xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 skeu-raised px-4 py-2 rounded-2xl">
          <div className="w-8 h-8 rounded-xl skeu-circle-primary flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-outfit font-bold text-sm text-text">Blind Test Session</span>
        </div>
        <VoterNumber number={142} />
      </header>

      {/* Hero Section */}
      <main className="max-w-2xl w-full text-center space-y-8 my-auto py-8 z-10">
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mx-auto w-24 h-24 rounded-3xl skeu-raised flex items-center justify-center p-2"
        >
          <div className="w-full h-full rounded-2xl skeu-inset flex items-center justify-center bg-gradient-to-tr from-primary-light/20 to-primary/10">
            <Headphones className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Title & Description */}
        <div className="space-y-3 px-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full skeu-inset text-xs font-semibold text-primary uppercase tracking-wider mb-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            100% Unbiased Listening Test
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-outfit font-extrabold text-text text-embossed tracking-tight leading-tight"
          >
            Worship Music <br className="hidden sm:block" />
            <span className="gradient-text">Blind Audition</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary font-inter text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            All song titles, artists, and languages are hidden. Listen purely to the instrumentation and arrangement, compare 4 variations per track, and vote for the version that moves your spirit.
          </motion.p>
        </div>

        {/* Headphone Recommendation */}
        {showHeadphoneBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="max-w-md mx-auto"
          >
            <HeadphoneBanner onDismiss={() => setShowHeadphoneBanner(false)} />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md mx-auto"
        >
          {hasCompleted ? (
            <button
              onClick={() => router.push("/already-voted")}
              className="w-full sm:w-auto px-8 py-4 skeu-btn-primary font-outfit font-bold text-base flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5" />
              View Your Completed Receipt
            </button>
          ) : hasStarted ? (
            <>
              <button
                onClick={handleResume}
                className="w-full sm:flex-1 py-4 px-6 skeu-btn-primary font-outfit font-bold text-base flex items-center justify-center gap-2"
              >
                Resume Track #{currentStepIndex + 1}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartOver}
                className="w-full sm:w-auto py-4 px-5 skeu-btn text-text-secondary font-outfit font-semibold text-sm flex items-center justify-center gap-2"
                title="Start from Track #1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-10 py-4 skeu-btn-primary font-outfit font-bold text-lg flex items-center justify-center gap-3 group"
            >
              Start Blind Audition
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </motion.div>

        {/* Participation Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ParticipationCounter count={141} />
        </motion.div>

        {/* How It Works (3D raised cards) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="pt-6"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-outfit font-bold text-text-muted uppercase tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            How Blind Voting Works
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              {
                step: "01",
                title: "Listen Blindly",
                desc: `We present ${TOTAL_SONGS} mystery tracks in random order. Each track has 4 unique arrangements.`,
              },
              {
                step: "02",
                title: "Compare & Feel",
                desc: "Listen for at least 5 seconds to each variation without knowing the singer or language.",
              },
              {
                step: "03",
                title: "Cast Unbiased Vote",
                desc: "Pick your favorite version for all 6 tracks and earn physical badges for your listening style.",
              },
            ].map((item, i) => (
              <div key={item.step} className="skeu-raised p-5 space-y-2 relative overflow-hidden">
                <span className="font-outfit font-extrabold text-2xl text-primary/30 absolute top-3 right-4 select-none">
                  {item.step}
                </span>
                <h3 className="font-outfit font-bold text-text text-base pt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary font-inter leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 font-inter text-xs text-text-muted">
        Tactile Skeuomorphic Day Theme &bull; Blind Listening Engine &bull; ~10 mins
      </footer>
    </div>
  );
}
