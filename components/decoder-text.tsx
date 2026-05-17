"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface DecoderTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnce?: boolean;
}

const GLYPHS = "█[ ]_//01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function DecoderText({
  text,
  className = "",
  delay = 0,
  triggerOnce = true,
}: DecoderTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);
  const [isMounted, setIsMounted] = useState(false);
  const inView = useInView(containerRef, { once: triggerOnce, margin: "-10%" });
  const hasAnimated = useRef(false);

  /* Prevent hydration mismatch by deferring scramble post-mount */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !inView || hasAnimated.current) return;

    hasAnimated.current = true;

    let frame = 0;
    const targetText = text;
    const duration = 24; // total ticks/frames
    let intervalId: NodeJS.Timeout;

    const startAnimation = () => {
      intervalId = setInterval(() => {
        setDisplayText(() => {
          return targetText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              
              /* Calculate progression percentage */
              const progress = frame / duration;
              const letterThreshold = index / targetText.length;

              if (progress > letterThreshold) {
                return char; // lock onto correct letter
              }

              /* Return random futuristic blueprint character */
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("");
        });

        frame++;
        if (frame >= duration) {
          setDisplayText(targetText); // guarantee precise final text
          clearInterval(intervalId);
        }
      }, 35); // 35ms per tick
    };

    const timeoutId = setTimeout(startAnimation, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, isMounted, text, delay]);

  return (
    <span
      ref={containerRef}
      className={className}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}
