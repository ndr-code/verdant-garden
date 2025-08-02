import { useState, useEffect } from 'react';

// Global shared timer untuk semua clock dengan presisi tinggi
let globalTimer: number | null = null;
const subscribers: Set<(time: Date) => void> = new Set();
let currentGlobalTime = new Date();

const updateTime = () => {
  currentGlobalTime = new Date();
  subscribers.forEach((callback) => {
    // Use requestAnimationFrame untuk smooth rendering
    requestAnimationFrame(() => callback(currentGlobalTime));
  });
};

const startGlobalTimer = () => {
  if (!globalTimer && subscribers.size > 0) {
    // Sync to the next second boundary untuk presisi
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();

    // Use high-precision timing
    const preciseInterval = () => {
      updateTime();

      // Calculate next exact second untuk prevent drift
      const nextSecond = new Date();
      nextSecond.setMilliseconds(0);
      nextSecond.setSeconds(nextSecond.getSeconds() + 1);
      const delay = nextSecond.getTime() - Date.now();

      globalTimer = window.setTimeout(preciseInterval, Math.max(0, delay));
    };

    setTimeout(preciseInterval, msUntilNextSecond);
  }
};

const stopGlobalTimer = () => {
  if (globalTimer && subscribers.size === 0) {
    clearTimeout(globalTimer);
    globalTimer = null;
  }
};

export const useGlobalTime = () => {
  const [time, setTime] = useState(() => currentGlobalTime);

  useEffect(() => {
    // Subscribe to global timer
    subscribers.add(setTime);

    // Start timer if this is the first subscriber
    if (subscribers.size === 1) {
      startGlobalTimer();
    }

    return () => {
      // Unsubscribe
      subscribers.delete(setTime);

      // Stop timer if no more subscribers
      if (subscribers.size === 0) {
        stopGlobalTimer();
      }
    };
  }, []);

  return time;
};
