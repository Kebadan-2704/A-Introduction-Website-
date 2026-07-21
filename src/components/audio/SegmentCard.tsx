"use client";

import { motion } from "framer-motion";
import { Play, Pause, Loader2, Check, Clock, Volume2 } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { usePollStore } from "@/store/usePollStore";
import type { Segment } from "@/types";
import { Equalizer } from "./Equalizer";

interface SegmentCardProps {
  segment: Segment;
  songId: string;
  isSelected: boolean;
  onSelect: () => void;
  displayIndex: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SegmentCard({
  segment,
  songId,
  isSelected,
  onSelect,
  displayIndex,
}: SegmentCardProps) {
  const { currentSegmentId, isPlaying, isLoading, currentTime, duration, togglePlay } =
    useAudioStore();
  const { listenedSegments } = usePollStore();

  const isThisPlaying = currentSegmentId === segment.id && isPlaying;
  const isThisLoading = currentSegmentId === segment.id && isLoading;
  const isThisActive = currentSegmentId === segment.id;
  const hasListened = (listenedSegments[songId] || []).includes(segment.id);
  const progress = isThisActive && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: displayIndex * 0.08, duration: 0.35 }}
      onClick={onSelect}
      className={`w-full text-left p-5 md:p-6 transition-all duration-200 relative cursor-pointer select-none
        ${isSelected ? "skeu-selected" : "skeu-raised"}
      `}
    >
      {/* Top row: Play Button + Label + Status */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay(segment.id, segment.audioUrl);
          }}
          className={`w-14 h-14 flex items-center justify-center shrink-0 transition-all duration-150
            ${isThisPlaying ? "skeu-circle-primary" : "skeu-circle hover:scale-105 active:scale-95"}
          `}
          title={isThisPlaying ? "Pause" : "Play variation"}
        >
          {isThisLoading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : isThisPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-text ml-1" />
          )}
        </button>

        {/* Info & Blind Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-bold text-lg text-text text-embossed">
              {segment.displayLabel || `Variation ${displayIndex + 1}`}
            </span>
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
              >
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </motion.span>
            )}
          </div>

          {/* Time & Listen Gate Status */}
          <div className="flex items-center gap-3 mt-1.5 font-inter text-xs">
            {isThisActive ? (
              <span className="text-primary font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            ) : hasListened ? (
              <span className="text-success font-medium flex items-center gap-1 bg-success/10 px-2 py-0.5 rounded-full">
                <Check className="w-3.5 h-3.5" /> Heard
              </span>
            ) : (
              <span className="text-text-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Tap play to listen
              </span>
            )}
          </div>
        </div>

        {/* Equalizer when active */}
        {isThisPlaying && (
          <div className="shrink-0">
            <Equalizer isPlaying={isThisPlaying} />
          </div>
        )}
      </div>

      {/* Seek bar and physical progress track for active variation */}
      {isThisActive && duration > 0 && (
        <div className="mt-4 pt-2">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              e.stopPropagation();
              useAudioStore.getState().seek(parseFloat(e.target.value));
            }}
            onClick={(e) => e.stopPropagation()}
            className="audio-progress w-full"
          />
          <div className="flex justify-between text-[11px] font-inter text-text-muted mt-1 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Physical groove progress bar when not actively dragging slider but playing */}
      {isThisActive && duration <= 0 && (
        <div className="mt-4 skeu-progress-track">
          <div className="skeu-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </motion.div>
  );
}
