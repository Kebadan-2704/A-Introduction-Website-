"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, KeyRound } from "lucide-react";
import { ADMIN_PASSWORD } from "@/lib/songs";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 400));

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect admin credentials. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative bg-base text-text">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-sm w-full space-y-8"
      >
        {/* Emblem */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-3xl skeu-raised p-3 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl skeu-circle-primary flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-outfit font-extrabold text-text text-embossed">
              Admin Portal
            </h1>
            <p className="text-xs text-text-secondary font-inter mt-1">
              Enter master key to reveal un-blinded tallies
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="skeu-raised p-6 space-y-4 rounded-3xl">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin key (worship2026)"
              className="w-full px-4 py-3.5 pr-12 rounded-xl skeu-inset text-text placeholder:text-text-muted font-inter text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-error font-inter font-medium pl-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!password || isLoading}
            className={`w-full py-3.5 rounded-xl font-outfit font-extrabold text-sm flex items-center justify-center gap-2 transition-all
              ${
                password && !isLoading
                  ? "skeu-btn-primary text-white hover:scale-[1.02] shadow-md"
                  : "skeu-inset text-text-muted cursor-not-allowed opacity-50"
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Unlock Tally Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
