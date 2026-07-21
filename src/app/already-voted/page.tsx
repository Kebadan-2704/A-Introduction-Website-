"use client";

import { motion } from "framer-motion";
import { UserCheck, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AlreadyVotedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative bg-base text-text">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-md w-full text-center space-y-6"
      >
        {/* Emblem */}
        <div className="mx-auto w-24 h-24 rounded-3xl skeu-raised p-3 flex items-center justify-center">
          <div className="w-full h-full rounded-2xl skeu-inset flex items-center justify-center bg-primary/10">
            <UserCheck className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Session Sealed
          </div>
          <h1 className="text-3xl font-outfit font-extrabold text-text text-embossed">
            Welcome Back! 👋
          </h1>
          <p className="text-text-secondary font-inter text-sm md:text-base leading-relaxed">
            You&apos;ve already completed and submitted your blind musical audition. Thank you for your heartfelt contributions!
          </p>
        </div>

        {/* Info Card */}
        <div className="skeu-raised p-5 text-sm text-text-secondary font-inter space-y-2 rounded-2xl">
          <p className="font-semibold text-text">
            Why can&apos;t I vote again?
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            To preserve the integrity and statistical accuracy of the blind listening test, each device is permitted to submit one complete ballot.
          </p>
        </div>

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/"
            className="skeu-btn px-6 py-3 inline-flex items-center gap-2 text-sm font-outfit font-bold text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Landing Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
