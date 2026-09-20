"use client";

import { useEffect } from "react";

let sent = false;

// One page view per load. Skipped when the browser asks not to be tracked.
export default function Beacon() {
  useEffect(() => {
    if (sent || navigator.doNotTrack === "1") return;
    sent = true;
    const params = new URLSearchParams(location.search);
    const body = JSON.stringify({
      ref: document.referrer,
      src: params.get("ref") || params.get("utm_source") || "",
    });
    navigator.sendBeacon("/api/hit", body);
  }, []);
  return null;
}
