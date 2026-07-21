"use client";

import { useEffect, useState } from "react";

export function useDeviceDetect() {
  const [device, setDevice] = useState<"mobile" | "desktop" | "tablet">("desktop");
  const [browser, setBrowser] = useState("");
  const [os, setOs] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent;

    // Device detection
    if (/iPad|Android(?!.*Mobile)/i.test(ua)) {
      setDevice("tablet");
    } else if (/iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      setDevice("mobile");
    } else {
      setDevice("desktop");
    }

    // Browser detection
    if (ua.includes("Firefox")) {
      setBrowser("Firefox");
    } else if (ua.includes("Edg")) {
      setBrowser("Edge");
    } else if (ua.includes("Chrome")) {
      setBrowser("Chrome");
    } else if (ua.includes("Safari")) {
      setBrowser("Safari");
    } else {
      setBrowser("Other");
    }

    // OS detection
    if (ua.includes("Windows")) {
      setOs("Windows");
    } else if (ua.includes("Mac")) {
      setOs("macOS");
    } else if (ua.includes("iPhone") || ua.includes("iPad")) {
      setOs("iOS");
    } else if (ua.includes("Android")) {
      setOs("Android");
    } else if (ua.includes("Linux")) {
      setOs("Linux");
    } else {
      setOs("Other");
    }
  }, []);

  return { device, browser, os };
}
