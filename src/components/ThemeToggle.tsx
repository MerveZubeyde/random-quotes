"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "@/app/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="
        flex size-11 shrink-0 items-center justify-center
        rounded-xl
        border border-border
        bg-card
        text-card-foreground
        shadow-sm
        transition-all duration-200
        hover:bg-accent
        hover:text-accent-foreground
        hover:shadow-md
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
      "
    >
      {isDark ? (
        <SunMedium className="size-5" />
      ) : (
        <MoonStar className="size-5" />
      )}
    </button>
  );
}
