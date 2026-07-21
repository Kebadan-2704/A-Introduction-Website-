"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Check,
  Play,
  Pause,
  Edit3,
  MessageSquare,
  Send,
  AlertTriangle,
  Headphones,
  Loader2,
} from "lucide-react";
import { usePollStore } from "@/store/usePollStore";
import { useAudioStore } from "@/store/useAudioStore";
import { getSongById, TOTAL_SONGS } from "@/lib/songs";
import { submitCloudBallot } from "@/lib/supabase";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { Equalizer } from "@/components/audio/Equalizer";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function BlindReviewCard({
  songId,
  stepNumber,
  segmentId,
  comment,
  segmentOrder,
  index,
}: {
  songId: string;
  stepNumber: number;
  segmentId: string;
  comment: string;
  segmentOrder: any[];
  index: number;
}) {
  const router = useRouter();
  const { currentSegmentId, isPlaying, currentTime, duration, togglePlay } =
    useAudioStore();

  const song = useMemo(() => getSongById(songId), [songId]);
  const selectedSegment = useMemo(
    () => segmentOrder.find((s) => s.id === segmentId) || song?.segments.find((s) => s.id === segmentId),
    [segmentOrder, song?.segments, segmentId]
  );

  if (!selectedSegment || !song) return null;

  const isThisPlaying = currentSegmentId === selectedSegment.id && isPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="skeu-raised p-5 md:p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 skeu-inset px-3 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" />
            Blind Track #{stepNumber}
          </div>
          <h3 className="font-outfit font-extrabold text-text text-xl text-embossed">
            Mystery Arrangement #{stepNumber}
          </h3>
          <p className="text-xs text-text-secondary font-inter mt-0.5">
            Original song identity remains sealed until poll completion
          </p>
        </div>

        <button
          onClick={() => router.push(`/poll/${stepNumber}`)}
          className="skeu-btn px-4 py-2 text-text-secondary hover:text-text text-xs font-outfit font-semibold flex items-center gap-1.5 transition-all shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Change Choice
        </button>
      </div>

      {/* Selected variation panel */}
      <div className="flex items-center gap-4 p-4 rounded-2xl skeu-inset border border-primary/20">
        <button
          onClick={() => togglePlay(selectedSegment.id, selectedSegment.audioUrl)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all
            ${isThisPlaying ? "skeu-circle-primary" : "skeu-circle hover:scale-105 active:scale-95"}
          `}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-text ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-success stroke-[3] shrink-0" />
            <span className="text-base font-outfit font-bold text-text text-embossed">
              {selectedSegment.displayLabel}
            </span>
          </div>
          {isThisPlaying && (
            <span className="text-xs text-primary font-semibold font-inter mt-0.5 block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        {isThisPlaying && <Equalizer isPlaying={true} barCount={4} />}
      </div>

      {/* Comment */}
      {comment && (
        <div className="flex items-start gap-2.5 text-sm text-text-secondary px-2 pt-1">
          <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span className="font-inter italic">&ldquo;{comment}&rdquo;</span>
        </div>
      )}
    </motion.div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { sessionId, voterName, songOrder, votes, comments, segmentOrder, markCompleted, hasCompleted } =
    usePollStore();
  const { stopAll } = useAudioStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const songsVoted = Object.keys(votes).length;
  const allVoted = songsVoted === TOTAL_SONGS;

  if (hasCompleted) {
    router.push("/already-voted");
    return null;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    stopAll();

    // Submit to Supabase cloud table
    await submitCloudBallot({
      sessionId: sessionId || "anon-session",
      voterName: voterName || "Anonymous Voter",
      votes,
      comments,
    });

    markCompleted();
    setIsSubmitting(false);
    router.push("/thank-you");
  };

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col bg-base text-text">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-base/90 backdrop-blur-md px-4 md:px-8 py-3.5 border-b border-shadow-dark/20 shadow-sm flex items-center justify-between">
          <button
            onClick={() => {
              stopAll();
              router.push(`/poll/${TOTAL_SONGS}`);
            }}
            className="skeu-btn px-4 py-2 flex items-center gap-1.5 text-text-secondary hover:text-text transition-colors font-outfit font-semibold text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Track #{TOTAL_SONGS}
          </button>
          <span className="font-outfit font-bold text-text text-base text-embossed">
            Final Review
          </span>
          <div className="w-24" />
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-2xl mx-auto w-full space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="skeu-raised p-6 text-center space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-outfit font-extrabold text-text text-embossed">
              Review Your Blind Audition
            </h1>
            <p className="text-sm text-text-secondary font-inter">
              Listen once more to your selected variations and confirm your vote.{" "}
              <span className="text-primary font-bold">
                {songsVoted}/{TOTAL_SONGS} mystery tracks voted
              </span>
            </p>
          </motion.div>

          {/* Missing votes warning */}
          {!allVoted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="skeu-inset p-4 rounded-2xl flex items-center gap-3 border border-warning/30"
            >
              <div className="w-10 h-10 rounded-xl skeu-raised flex items-center justify-center text-warning shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-sm text-text-secondary font-inter">
                You haven&apos;t voted on all mystery tracks yet. Go back and complete all {TOTAL_SONGS} tracks before submitting.
              </span>
            </motion.div>
          )}

          {/* Review Cards */}
          <div className="space-y-4">
            {songOrder.map((songId, idx) => {
              const segId = votes[songId];
              const stepNum = idx + 1;
              if (!segId) {
                return (
                  <motion.div
                    key={songId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="skeu-raised p-5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-outfit font-bold text-warning uppercase tracking-wider">
                        Blind Track #{stepNum} — Not Voted
                      </span>
                      <h3 className="font-outfit font-bold text-text text-lg">
                        Mystery Arrangement #{stepNum}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        stopAll();
                        router.push(`/poll/${stepNum}`);
                      }}
                      className="skeu-btn-primary px-5 py-2 text-white font-outfit font-bold text-xs"
                    >
                      Vote Now
                    </button>
                  </motion.div>
                );
              }

              return (
                <BlindReviewCard
                  key={songId}
                  songId={songId}
                  stepNumber={stepNum}
                  segmentId={segId}
                  comment={comments[songId] || ""}
                  segmentOrder={segmentOrder[songId] || []}
                  index={idx}
                />
              );
            })}
          </div>
        </main>

        {/* Submit Footer */}
        <footer className="sticky bottom-0 z-40 bg-base/90 backdrop-blur-md px-4 md:px-8 py-4 border-t border-shadow-dark/20">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={!allVoted || isSubmitting}
              className={`w-full py-4 rounded-2xl font-outfit font-extrabold text-base flex items-center justify-center gap-3 transition-all duration-200
                ${
                  allVoted && !isSubmitting
                    ? "skeu-btn-primary text-white hover:scale-[1.01] active:scale-[0.99] shadow-xl"
                    : "skeu-inset text-text-muted cursor-not-allowed opacity-50"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sealing Ballot into Cloud Tally...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Lock & Submit All Blind Votes
                </>
              )}
            </button>
            {allVoted && (
              <p className="text-center text-xs text-text-muted mt-2 font-inter">
                🔒 Once submitted, your choices are permanently sealed into the blind poll tally
              </p>
            )}
          </div>
        </footer>
      </div>
    </AudioProvider>
  );
}
