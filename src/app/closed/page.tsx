"use client";

import { motion } from "framer-motion";
import { Lock, Calendar, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PollClosedPage() {
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
          <div className="w-full h-full rounded-2xl skeu-inset flex items-center justify-center text-text-muted">
            <Lock className="w-10 h-10" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-outfit font-extrabold text-text text-embossed">
            Audition Closed
          </h1>
          <p className="text-text-secondary font-inter text-sm md:text-base leading-relaxed">
            The blind worship listening test is no longer accepting new submissions. Thank you to everyone who participated!
          </p>
        </div>

        {/* Info Card */}
        <div className="skeu-raised p-5 space-y-4 rounded-2xl">
          <div className="flex items-center justify-center gap-6 text-sm font-inter">
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-semibold">Summer Session</span>
            </div>
            <div className="w-px h-5 bg-shadow-dark/40" />
            <div className="flex items-center gap-2 text-text-secondary">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold">Tally Complete</span>
            </div>
          </div>
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
