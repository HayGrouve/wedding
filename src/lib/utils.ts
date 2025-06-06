import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Client-side IP detection utility
export async function getClientIP(): Promise<string | null> {
  try {
    // Try multiple IP detection services for reliability
    const services = [
      "https://api.ipify.org?format=json",
      "https://ipapi.co/json/",
      "https://httpbin.org/ip",
    ];

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) continue;

        const data = await response.json();

        // Different services return IP in different formats
        const ip = data.ip || data.query || data.origin;

        if (ip && typeof ip === "string") {
          // Basic IP validation (IPv4 or IPv6)
          if (
            /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) ||
            /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(ip)
          ) {
            return ip;
          }
        }
      } catch (serviceError) {
        // Continue to next service if this one fails
        console.warn(`IP service ${service} failed:`, serviceError);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.warn("Failed to detect client IP:", error);
    return null;
  }
}
