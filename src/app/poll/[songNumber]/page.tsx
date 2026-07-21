"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  MessageSquare,
  Lock,
  PlaySquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { getSongById, TOTAL_SONGS, SEGMENTS_PER_SONG } from "@/lib/songs";
import { SegmentCard } from "@/components/audio/SegmentCard";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { ProgressRing } from "@/components/poll/ProgressRing";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function PollPage({
  params,
}: {
  params: Promise<{ songNumber: string }>;
}) {
  const { songNumber } = use(params);
  const router = useRouter();
  const stepNum = parseInt(songNumber, 10);
  const stepIndex = stepNum - 1;

  const {
    songOrder,
    segmentOrder,
    votes,
    comments,
    listenedSegments,
    currentStepIndex,
    initOrders,
    castVote,
    setComment,
    goToStep,
    hasCompleted,
  } = usePollStore();
  const { stopAll, togglePlay, currentSegmentId, isPlaying } = useAudioStore();

  const [autoPlaySequence, setAutoPlaySequence] = useState(false);

  // Initialize order if needed
  useEffect(() => {
    initOrders();
  }, [initOrders]);

  // Sync step index
  useEffect(() => {
    if (!isNaN(stepIndex) && stepIndex !== currentStepIndex && stepIndex >= 0 && stepIndex < TOTAL_SONGS) {
      goToStep(stepIndex);
    }
  }, [stepIndex, currentStepIndex, goToStep]);

  // Redirect if already completed
  useEffect(() => {
    if (hasCompleted) {
      router.push("/already-voted");
    }
  }, [hasCompleted, router]);

  // Get current mystery song
  const currentSongId = songOrder[stepIndex] || "";
  const song = useMemo(() => getSongById(currentSongId), [currentSongId]);

  // Get blind segments for this track
  const segments = useMemo(() => {
    if (!song) return [];
    return segmentOrder[song.id] || song.segments || [];
  }, [segmentOrder, song]);

  // Keyboard shortcuts (Space to toggle, 1-4 to pick variation)
  useKeyboardShortcuts({
    segments,
    onSelect: (segId) => {
      if (song && (listenedSegments[song.id] || []).length >= SEGMENTS_PER_SONG) {
        castVote(song.id, segId);
      }
    },
  });

  // Handle auto-advance sequential playback
  useEffect(() => {
    if (!autoPlaySequence || !isPlaying || !currentSegmentId || segments.length === 0) return;

    const currentIdx = segments.findIndex((s) => s.id === currentSegmentId);
    if (currentIdx === -1) return;

    // Check every second if audio ended or check via duration
    const checkInterval = setInterval(() => {
      const state = useAudioStore.getState();
      if (!state.isPlaying && state.currentTime >= state.duration - 0.5 && state.duration > 0) {
        // Advance to next segment
        const nextIdx = currentIdx + 1;
        if (nextIdx < segments.length) {
          const nextSeg = segments[nextIdx];
          state.togglePlay(nextSeg.id, nextSeg.audioUrl);
        } else {
          setAutoPlaySequence(false);
        }
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [autoPlaySequence, isPlaying, currentSegmentId, segments]);

  if (!song || stepNum < 1 || stepNum > TOTAL_SONGS) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4">
        <div className="skeu-raised p-8 text-center space-y-4 max-w-sm">
          <p className="text-text font-outfit font-bold text-lg">Mystery track not ready yet</p>
          <button
            onClick={() => {
              initOrders();
              router.push("/poll/1");
            }}
            className="skeu-btn-primary px-6 py-2.5 font-outfit font-semibold text-sm w-full"
          >
            Start from Track #1
          </button>
        </div>
      </div>
    );
  }

  const selectedSegmentId = votes[song.id] || null;
  const listened = listenedSegments[song.id] || [];
  const allListened = listened.length >= SEGMENTS_PER_SONG;
  const hasVoted = !!selectedSegmentId;
  const comment = comments[song.id] || "";
  const canProceed = hasVoted;
  const songsVoted = Object.keys(votes).length;
  const isLastTrack = stepNum === TOTAL_SONGS;

  const handleNext = () => {
    stopAll();
    setAutoPlaySequence(false);
    if (isLastTrack) {
      router.push("/review");
    } else {
      router.push(`/poll/${stepNum + 1}`);
    }
  };

  const handlePrev = () => {
    stopAll();
    setAutoPlaySequence(false);
    if (stepNum > 1) {
      router.push(`/poll/${stepNum - 1}`);
    }
  };

  const handleSelectSegment = (segmentId: string) => {
    if (allListened) {
      castVote(song.id, segmentId);
    }
  };

  const startSequentialPlay = () => {
    if (segments.length > 0) {
      setAutoPlaySequence(true);
      togglePlay(segments[0].id, segments[0].audioUrl);
    }
  };

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-base text-text">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-base/90 backdrop-blur-md px-4 md:px-8 py-3.5 border-b border-shadow-dark/20 shadow-sm flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={stepNum <= 1}
            className="skeu-btn px-4 py-2 flex items-center gap-1.5 text-text-secondary hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-outfit font-semibold text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-4 skeu-inset px-4 py-1.5 rounded-full">
            <span className="font-outfit font-bold text-sm text-text text-embossed">
              Mystery Track {stepNum} <span className="text-text-muted font-normal">of {TOTAL_SONGS}</span>
            </span>
            <div className="h-4 w-px bg-shadow-dark/40" />
            <ProgressRing current={songsVoted} total={TOTAL_SONGS} size={32} strokeWidth={3.5} />
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-4 py-2 font-outfit font-bold text-xs flex items-center gap-1.5 rounded-xl transition-all
              ${
                canProceed
                  ? "skeu-btn-primary text-white"
                  : "skeu-inset text-text-muted cursor-not-allowed opacity-60"
              }
            `}
          >
            {isLastTrack ? "Review All" : "Next Track"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-8 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={song.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6"
            >
              {/* Blind Track Header Panel */}
              <div className="skeu-raised p-6 md:p-7 text-center space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-12 h-12 rounded-2xl skeu-inset flex items-center justify-center text-primary">
                    <Headphones className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 skeu-inset px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Blind Listening Audition
                  </div>
                  <h1 className="text-3xl md:text-4xl font-outfit font-extrabold text-text text-embossed tracking-tight">
                    Blind Track #{stepNum}
                  </h1>
                  <p className="text-sm text-text-secondary font-inter mt-1.5 max-w-md mx-auto">
                    All original song info is hidden. Listen to the 4 arrangements below and vote based purely on what speaks to your heart.
                  </p>
                </div>

                {/* Auto-Play Sequence Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={startSequentialPlay}
                    className={`skeu-btn px-4 py-2 rounded-xl font-outfit font-semibold text-xs flex items-center gap-2 transition-all
                      ${autoPlaySequence ? "ring-2 ring-primary bg-primary/10 text-primary" : "text-text-secondary hover:text-text"}
                    `}
                  >
                    <PlaySquare className="w-4 h-4 text-primary" />
                    {autoPlaySequence ? "Auto-playing variations sequentially..." : "Play All 4 Variations Sequentially"}
                  </button>
                </div>
              </div>

              {/* Listen Gate Status Panel */}
              {!allListened ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="skeu-inset px-5 py-3.5 flex items-center gap-3.5 text-sm rounded-2xl border border-warning/30"
                >
                  <div className="w-9 h-9 rounded-xl skeu-raised flex items-center justify-center text-warning shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-text-secondary font-inter leading-tight">
                    Listen to all 4 variations (at least 5s each) to unlock voting for this track.{" "}
                    <span className="text-primary font-bold ml-1">
                      {listened.length}/4 heard
                    </span>
                  </span>
                </motion.div>
              ) : !hasVoted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="skeu-inset px-5 py-3 flex items-center justify-center gap-2.5 text-sm text-success font-outfit font-bold rounded-2xl bg-success/5 border border-success/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ✨ Voting unlocked! Tap your favorite arrangement below.
                </motion.div>
              ) : null}

              {/* Variation Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment, idx) => (
                  <SegmentCard
                    key={segment.id}
                    segment={segment}
                    songId={song.id}
                    isSelected={selectedSegmentId === segment.id}
                    onSelect={() => handleSelectSegment(segment.id)}
                    displayIndex={idx}
                  />
                ))}
              </div>

              {/* Optional Comment Section */}
              {hasVoted && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="skeu-raised p-5 space-y-2.5 rounded-2xl"
                >
                  <label className="flex items-center gap-2 text-sm font-outfit font-bold text-text">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Why did you choose {segments.find((s) => s.id === selectedSegmentId)?.displayLabel}? (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(song.id, e.target.value)}
                    placeholder="E.g., I loved the acoustic guitar intro, or the vocal harmonies felt very uplifting..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl skeu-inset text-text placeholder:text-text-muted font-inter text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation Bar */}
        <footer className="sticky bottom-0 z-40 bg-base/90 backdrop-blur-md px-4 md:px-8 py-4 border-t border-shadow-dark/20">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className="text-xs text-text-muted font-inter hidden sm:block">
              ⌨️ Shortcuts: Spacebar (Play/Pause) &bull; Keys 1-4 (Listen to Variation)
            </p>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`ml-auto px-8 py-3 rounded-xl font-outfit font-bold text-sm flex items-center gap-2 transition-all duration-200
                ${
                  canProceed
                    ? "skeu-btn-primary text-white hover:scale-105 active:scale-95 shadow-lg"
                    : "skeu-inset text-text-muted cursor-not-allowed opacity-50"
                }
              `}
            >
              {isLastTrack ? "Review Blind Votes" : "Next Blind Track"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </AudioProvider>
  );
}
