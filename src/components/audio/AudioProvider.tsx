"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { usePollStore } from "@/store/usePollStore";
import { LISTEN_GATE_SECONDS } from "@/lib/songs";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setAudioElement, updateTime, setDuration, setLoading } = useAudioStore();
  const { addListenDuration, markSegmentListened } = usePollStore();
  const currentSegmentId = useAudioStore((s) => s.currentSegmentId);
  const lastTimeRef = useRef(0);
  const listenAccumulatorRef = useRef(0);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);

      // Restore volume
      const savedVol = localStorage.getItem("worship-poll-volume");
      if (savedVol) {
        audioRef.current.volume = parseFloat(savedVol);
      }
    }
  }, [setAudioElement]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSegmentId) return;

    const now = audio.currentTime;
    const delta = (now - lastTimeRef.current) * 1000;
    lastTimeRef.current = now;

    if (delta > 0 && delta < 1000) {
      listenAccumulatorRef.current += delta;
      addListenDuration(currentSegmentId, delta);

      // Check listen gate
      if (listenAccumulatorRef.current >= LISTEN_GATE_SECONDS * 1000) {
        const songId = currentSegmentId.split("-").slice(0, 2).join("-");
        markSegmentListened(songId, currentSegmentId);
      }
    }

    updateTime(now);
  }, [currentSegmentId, updateTime, addListenDuration, markSegmentListened]);

  // Reset accumulator when segment changes
  useEffect(() => {
    listenAccumulatorRef.current = 0;
    lastTimeRef.current = 0;
  }, [currentSegmentId]);

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setLoading(false);
          }
        }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => useAudioStore.getState().pause()}
      />
      {children}
    </>
  );
}
