"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Tracks which section is currently in view and returns its id
 * Accounts for sticky header via rootMargin so the section under the header counts as active.
 */
export function useActiveSection(sectionIds: string[], defaultId?: string) {
  const [activeId, setActiveId] = useState<string | undefined>(defaultId);
  const idsKey = useMemo(() => sectionIds.join("|"), [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Resolve elements on the client only
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    // Prefer center of viewport as active, compensate for sticky header (~80px)
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length === 0) return;
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visibleEntries[0];
        if (top?.target?.id) {
          setActiveId(top.target.id);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey, sectionIds]);

  return activeId;
}

export default useActiveSection;
