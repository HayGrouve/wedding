"use client";

import {
  useCountdown,
  bulgarianTimeLabels,
  getBulgarianTimeLabel,
} from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer = ({ targetDate, className }: CountdownTimerProps) => {
  const countdown = useCountdown(targetDate);

  if (countdown.isExpired) {
    return (
      <div className={cn("text-center space-y-4", className)}>
        <div className="text-lg font-medium text-primary">
          🎉 Денят е дошъл! 🎉
        </div>
        <p className="text-sm text-muted-foreground">
          Сватбата е днес! Време е за празненство!
        </p>
      </div>
    );
  }

  const timeUnits = [
    {
      value: countdown.days,
      label: getBulgarianTimeLabel(
        countdown.days,
        bulgarianTimeLabels.day,
        bulgarianTimeLabels.days
      ),
      shortLabel: "дни",
    },
    {
      value: countdown.hours,
      label: getBulgarianTimeLabel(
        countdown.hours,
        bulgarianTimeLabels.hour,
        bulgarianTimeLabels.hours
      ),
      shortLabel: "часа",
    },
    {
      value: countdown.minutes,
      label: getBulgarianTimeLabel(
        countdown.minutes,
        bulgarianTimeLabels.minute,
        bulgarianTimeLabels.minutes
      ),
      shortLabel: "минути",
    },
    {
      value: countdown.seconds,
      label: getBulgarianTimeLabel(
        countdown.seconds,
        bulgarianTimeLabels.second,
        bulgarianTimeLabels.seconds
      ),
      shortLabel: "секунди",
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-muted-foreground text-sm text-center">
        До нашия специален ден остават:
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.shortLabel}
            className={cn(
              "relative overflow-hidden rounded-lg bg-gradient-to-br",
              "from-primary/5 via-primary/10 to-primary/5",
              "border border-primary/20 p-3 text-center",
              "transition-all duration-300 hover:scale-105",
              "hover:shadow-lg hover:border-primary/40"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50" />

            {/* Content */}
            <div className="relative z-10 space-y-1">
              <div
                className={cn(
                  "text-2xl sm:text-3xl md:text-4xl font-bold",
                  "text-primary tabular-nums leading-none",
                  "transition-all duration-300"
                )}
              >
                {unit.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {unit.shortLabel}
              </div>
            </div>

            {/* Subtle pulse effect for seconds */}
            {unit.shortLabel === "секунди" && (
              <div
                className={cn(
                  "absolute inset-0 rounded-lg bg-primary/10",
                  "animate-pulse opacity-30"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Additional message */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Всеки момент ни приближава към нашия съвършен ден! ❤️
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
