"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  const toggleTheme = (e: React.MouseEvent) => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(document as any).startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.documentElement.style.setProperty("--click-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--click-y", `${e.clientY}px`);
    document.documentElement.classList.add("theme-transitioning");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove("theme-transitioning");
      });
    } catch {
      setTheme(nextTheme);
      document.documentElement.classList.remove("theme-transitioning");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative z-50 rounded-full"
    >
      <Moon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}