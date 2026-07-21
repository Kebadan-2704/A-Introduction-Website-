"use client";

import { useEffect, useCallback } from "react";
import { useAudioStore } from "@/store/useAudioStore";

interface KeyboardShortcutsProps {
  segments: { id: string; audioUrl: string }[];
  onSelect?: (segmentId: string) => void;
}

export function useKeyboardShortcuts({
  segments,
  onSelect,
}: KeyboardShortcutsProps) {
  const { currentSegmentId, isPlaying, togglePlay, pause } = useAudioStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case "Space": {
          e.preventDefault();
          if (currentSegmentId && isPlaying) {
            pause();
          } else if (currentSegmentId) {
            const seg = segments.find((s) => s.id === currentSegmentId);
            if (seg) togglePlay(seg.id, seg.audioUrl);
          } else if (segments.length > 0) {
            // Play first segment
            togglePlay(segments[0].id, segments[0].audioUrl);
          }
          break;
        }
        case "Digit1":
        case "Numpad1": {
          e.preventDefault();
          if (segments[0]) {
            togglePlay(segments[0].id, segments[0].audioUrl);
            onSelect?.(segments[0].id);
          }
          break;
        }
        case "Digit2":
        case "Numpad2": {
          e.preventDefault();
          if (segments[1]) {
            togglePlay(segments[1].id, segments[1].audioUrl);
            onSelect?.(segments[1].id);
          }
          break;
        }
        case "Digit3":
        case "Numpad3": {
          e.preventDefault();
          if (segments[2]) {
            togglePlay(segments[2].id, segments[2].audioUrl);
            onSelect?.(segments[2].id);
          }
          break;
        }
        case "Digit4":
        case "Numpad4": {
          e.preventDefault();
          if (segments[3]) {
            togglePlay(segments[3].id, segments[3].audioUrl);
            onSelect?.(segments[3].id);
          }
          break;
        }
      }
    },
    [currentSegmentId, isPlaying, segments, togglePlay, pause, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
