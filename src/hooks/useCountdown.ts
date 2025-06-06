"use client";

import { useState, useEffect } from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownTime {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = (): CountdownTime => {
      const now = new Date();
      const target = new Date(targetDate);

      // Check if the target date has passed
      if (now >= target) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      // Calculate differences
      const totalDays = differenceInDays(target, now);
      const totalHours = differenceInHours(target, now);
      const totalMinutes = differenceInMinutes(target, now);
      const totalSeconds = differenceInSeconds(target, now);

      // Calculate remaining time for each unit
      const days = totalDays;
      const hours = totalHours - days * 24;
      const minutes = totalMinutes - totalHours * 60;
      const seconds = totalSeconds - totalMinutes * 60;

      return {
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        isExpired: false,
      };
    };

    // Initial calculation
    setCountdown(calculateTimeLeft());

    // Set up interval to update every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
}

// Bulgarian time unit labels
export const bulgarianTimeLabels = {
  days: "дни",
  day: "ден",
  hours: "часа",
  hour: "час",
  minutes: "минути",
  minute: "минута",
  seconds: "секунди",
  second: "секунда",
};

// Helper function to get correct Bulgarian form based on number
export function getBulgarianTimeLabel(
  count: number,
  singular: string,
  plural: string
): string {
  if (count === 1) {
    return singular;
  }
  return plural;
}
