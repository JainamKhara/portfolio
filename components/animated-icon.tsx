"use client";

interface AnimatedIconProps {
  name: "atom" | "cube" | "synapse" | "pipeline" | "neural" | "arrow" | "github" | "globe";
  className?: string;
}

export function AnimatedIcon({ name, className = "h-6 w-6" }: AnimatedIconProps) {
  const baseSvgProps = {
    className: `${className} animated-svg-wire`,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <>
      <style>{`
        .animated-svg-wire path,
        .animated-svg-wire circle,
        .animated-svg-wire rect,
        .animated-svg-wire ellipse {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawOutline 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .group:hover .animated-svg-wire path,
        .group:hover .animated-svg-wire circle,
        .group:hover .animated-svg-wire rect,
        .group:hover .animated-svg-wire ellipse,
        button:hover .animated-svg-wire path,
        a:hover .animated-svg-wire path {
          animation: redrawOutline 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes drawOutline {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes redrawOutline {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {name === "atom" && (
        <svg {...baseSvgProps}>
          <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-30 12 12)" />
          <circle cx="12" cy="12" r="1.5" className="fill-primary stroke-none" />
        </svg>
      )}

      {name === "cube" && (
        <svg {...baseSvgProps}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
          <path d="M12 12v10" />
        </svg>
      )}

      {name === "synapse" && (
        <svg {...baseSvgProps}>
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="5" cy="18" r="2.5" />
          <circle cx="19" cy="18" r="2.5" />
          <path d="M12 7.5v8" />
          <path d="M10.5 16.5l-4-6.5" />
          <path d="M13.5 16.5l4-6.5" />
        </svg>
      )}

      {name === "pipeline" && (
        <svg {...baseSvgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M8 8l8 8" />
          <path d="M8 16l8-8" />
        </svg>
      )}

      {name === "neural" && (
        <svg {...baseSvgProps}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M8 6h6l4 4" />
          <path d="M8 18h6l4-4" />
          <path d="M8 6l10 6" />
          <path d="M8 18l10-6" />
        </svg>
      )}

      {name === "arrow" && (
        <svg {...baseSvgProps}>
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      )}

      {name === "github" && (
        <svg {...baseSvgProps}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )}

      {name === "globe" && (
        <svg {...baseSvgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )}
    </>
  );
}
