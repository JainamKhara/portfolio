"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SIGNAL_COUNT = 18;
const MOBILE_SIGNAL_COUNT = 10;
const TELEMETRY_COUNT = 6;

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressValueRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const signalRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ringRefs = useRef<Array<HTMLDivElement | null>>([]);
  const telemetryRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasCompletedRef = useRef(false);

  const signalNodes = Array.from({ length: SIGNAL_COUNT });
  const telemetryBars = Array.from({ length: TELEMETRY_COUNT });

  const finish = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reducedMotion } = context.conditions as {
            desktop: boolean;
            reducedMotion: boolean;
          };

          const activeSignalCount = desktop ? SIGNAL_COUNT : MOBILE_SIGNAL_COUNT;
          const activeTelemetryCount = desktop ? TELEMETRY_COUNT : 4;
          const activeSignals = signalRefs.current
            .slice(0, activeSignalCount)
            .filter(Boolean) as HTMLDivElement[];
          const inactiveSignals = signalRefs.current
            .slice(activeSignalCount)
            .filter(Boolean) as HTMLDivElement[];
          const activeTelemetry = telemetryRefs.current
            .slice(0, activeTelemetryCount)
            .filter(Boolean) as HTMLDivElement[];
          const inactiveTelemetry = telemetryRefs.current
            .slice(activeTelemetryCount)
            .filter(Boolean) as HTMLDivElement[];
          const rings = ringRefs.current.filter(Boolean) as HTMLDivElement[];
          const frameLines = frameRefs.current.filter(Boolean) as HTMLDivElement[];
          const labels = labelRefs.current.filter(Boolean) as HTMLDivElement[];
          const progressState = { value: 0 };
          const ambientTweens: gsap.core.Tween[] = [];
          const orbitRadius = desktop ? 210 : 132;
          const textTargets = [
            eyebrowRef.current,
            titleRef.current,
            subtitleRef.current,
          ].filter(Boolean);

          gsap.set(containerRef.current, {
            autoAlpha: 1,
            clipPath: "circle(140% at 50% 50%)",
          });
          gsap.set(inactiveSignals, { autoAlpha: 0 });
          gsap.set(inactiveTelemetry, { autoAlpha: 0 });
          gsap.set(progressFillRef.current, { scaleX: 0, transformOrigin: "left" });
          gsap.set(progressValueRef.current, { textContent: "00%" });
          gsap.set(statusRef.current, { textContent: "Calibrating orbit map" });

          activeSignals.forEach((signal, index) => {
            const angle = (index / activeSignalCount) * Math.PI * 2;

            gsap.set(signal, {
              x: gsap.utils.random(-180, 180),
              y: gsap.utils.random(-150, 150),
              scale: gsap.utils.random(0.25, 0.7),
              autoAlpha: 0,
            });

            signal.dataset.orbitX = `${Math.cos(angle) * orbitRadius}`;
            signal.dataset.orbitY = `${Math.sin(angle) * orbitRadius}`;
          });

          gsap.set(rings, { scale: 0.78, autoAlpha: 0, rotate: -18 });
          gsap.set(frameLines, { autoAlpha: 0, scaleX: 0, scaleY: 0 });
          gsap.set(labels, { autoAlpha: 0, y: 12 });
          gsap.set(gridRef.current, { autoAlpha: 0.18 });
          gsap.set(scanRef.current, { autoAlpha: 0, xPercent: -55 });
          gsap.set([coreRef.current, glowRef.current, monogramRef.current], {
            autoAlpha: 0,
            scale: 0.84,
          });
          gsap.set(textTargets, { autoAlpha: 0, y: 24 });
          gsap.set(activeTelemetry, {
            scaleY: 0.15,
            transformOrigin: "bottom",
            autoAlpha: 0.45,
          });
          gsap.set(portalRef.current, { scale: 0.1, autoAlpha: 0 });

          if (reducedMotion) {
            const reducedTimeline = gsap.timeline({
              onComplete: finish,
            });

            reducedTimeline
              .fromTo(
                containerRef.current,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.2 },
              )
              .to(
                [coreRef.current, glowRef.current, monogramRef.current],
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.3,
                  stagger: 0.04,
                },
                0,
              )
              .to(
                textTargets,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.3,
                  stagger: 0.05,
                },
                0.08,
              )
              .to(
                progressState,
                {
                  value: 100,
                  duration: 0.35,
                  ease: "power1.out",
                  onUpdate: () => {
                    const value = Math.round(progressState.value);
                    if (progressValueRef.current) {
                      progressValueRef.current.textContent = `${value
                        .toString()
                        .padStart(2, "0")}%`;
                    }
                    gsap.set(progressFillRef.current, {
                      scaleX: progressState.value / 100,
                    });
                    if (statusRef.current) {
                      statusRef.current.textContent = "Portfolio ready";
                    }
                  },
                },
                0.02,
              )
              .to(
                containerRef.current,
                {
                  autoAlpha: 0,
                  duration: 0.28,
                  delay: 0.18,
                },
              );

            return () => {
              reducedTimeline.kill();
            };
          }

          const timeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            onComplete: finish,
          });

          timeline
            .fromTo(
              containerRef.current,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.24 },
            )
            .to(
              frameLines,
              {
                autoAlpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 0.7,
                stagger: 0.06,
              },
              0,
            )
            .to(
              labels,
              {
                autoAlpha: 0.85,
                y: 0,
                duration: 0.45,
                stagger: 0.06,
              },
              0.08,
            )
            .to(
              scanRef.current,
              {
                autoAlpha: 0.55,
                xPercent: 70,
                duration: 1.1,
                ease: "sine.inOut",
              },
              0.08,
            )
            .to(
              rings,
              {
                autoAlpha: 1,
                scale: 1,
                rotate: 0,
                duration: 0.9,
                stagger: 0.08,
              },
              0.18,
            )
            .to(
              [coreRef.current, glowRef.current, monogramRef.current],
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.75,
                stagger: 0.05,
              },
              0.26,
            );

          activeSignals.forEach((signal, index) => {
            timeline.to(
              signal,
              {
                x: Number(signal.dataset.orbitX ?? 0),
                y: Number(signal.dataset.orbitY ?? 0),
                scale: 1,
                autoAlpha: 0.95,
                duration: 0.9,
                ease: "expo.out",
              },
              0.16 + index * 0.03,
            );
          });

          timeline
            .to(
              textTargets,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.08,
              },
              0.52,
            )
            .to(
              activeTelemetry,
              {
                scaleY: () => gsap.utils.random(0.45, 1),
                autoAlpha: 0.85,
                duration: 0.4,
                stagger: 0.05,
              },
              0.72,
            )
            .to(
              progressState,
              {
                value: 100,
                duration: 2.2,
                ease: "power2.inOut",
                onStart: () => {
                  ambientTweens.push(
                    gsap.to(glowRef.current, {
                      scale: 1.08,
                      opacity: 0.95,
                      duration: 1.4,
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut",
                    }),
                    gsap.to(rings[0], {
                      rotate: 360,
                      duration: 18,
                      repeat: -1,
                      ease: "none",
                    }),
                    gsap.to(rings[1], {
                      rotate: -360,
                      duration: 20,
                      repeat: -1,
                      ease: "none",
                    }),
                    gsap.to(rings[2], {
                      rotate: 360,
                      duration: 24,
                      repeat: -1,
                      ease: "none",
                    }),
                    gsap.to(activeSignals, {
                      scale: 1.14,
                      duration: 0.9,
                      stagger: {
                        each: 0.03,
                        repeat: -1,
                        yoyo: true,
                        from: "random",
                      },
                      ease: "sine.inOut",
                    }),
                    gsap.to(activeTelemetry, {
                      scaleY: () => gsap.utils.random(0.35, 1),
                      duration: 0.45,
                      repeat: -1,
                      yoyo: true,
                      stagger: 0.05,
                      ease: "sine.inOut",
                    }),
                  );
                },
                onUpdate: () => {
                  const value = Math.round(progressState.value);
                  if (progressValueRef.current) {
                    progressValueRef.current.textContent = `${value
                      .toString()
                      .padStart(2, "0")}%`;
                  }
                  gsap.set(progressFillRef.current, {
                    scaleX: progressState.value / 100,
                  });

                  if (!statusRef.current) return;

                  if (value < 34) {
                    statusRef.current.textContent = "Calibrating orbit map";
                  } else if (value < 72) {
                    statusRef.current.textContent = "Routing project systems";
                  } else {
                    statusRef.current.textContent = "Opening portfolio deck";
                  }
                },
              },
              0.64,
            )
            .to(
              scanRef.current,
              {
                autoAlpha: 0.22,
                duration: 0.4,
              },
              2.15,
            )
            .add(() => {
              ambientTweens.forEach((tween) => tween.kill());
            }, 2.85)
            .to(
              [eyebrowRef.current, subtitleRef.current],
              {
                autoAlpha: 0,
                y: -16,
                duration: 0.25,
              },
              2.95,
            )
            .to(
              titleRef.current,
              {
                autoAlpha: 0,
                y: -22,
                duration: 0.28,
              },
              3,
            )
            .to(
              activeSignals,
              {
                x: 0,
                y: 0,
                scale: 0.25,
                autoAlpha: 0,
                duration: 0.5,
                stagger: {
                  each: 0.015,
                  from: "center",
                },
                ease: "power4.in",
              },
              3,
            )
            .to(
              [...rings, ...activeTelemetry],
              {
                autoAlpha: 0,
                scale: 1.25,
                duration: 0.45,
                stagger: 0.04,
                ease: "power3.in",
              },
              3.05,
            )
            .to(
              [coreRef.current, glowRef.current],
              {
                scale: 1.06,
                duration: 0.3,
              },
              3.02,
            )
            .to(
              portalRef.current,
              {
                autoAlpha: 1,
                scale: desktop ? 36 : 24,
                duration: 0.72,
                ease: "expo.in",
              },
              3.08,
            )
            .to(
              containerRef.current,
              {
                clipPath: "circle(0% at 50% 50%)",
                autoAlpha: 0,
                duration: 0.78,
                ease: "power4.inOut",
              },
              3.18,
            );

          return () => {
            ambientTweens.forEach((tween) => tween.kill());
            timeline.kill();
          };
        },
      );

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [onComplete] },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#030712] text-white"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04),_transparent_56%)]" />
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(circle at center, black 26%, transparent 88%)",
        }}
      />
      <div
        ref={scanRef}
        className="absolute inset-y-0 left-[-20%] w-[42%] bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1.2px)] [background-size:32px_32px] opacity-20" />

      <div
        ref={(element) => {
          labelRefs.current[0] = element;
        }}
        className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.45em] text-white/55 md:left-10 md:top-8"
      >
        Mission launch
      </div>
      <div
        ref={(element) => {
          labelRefs.current[1] = element;
        }}
        className="absolute right-6 top-6 text-right text-[10px] uppercase tracking-[0.45em] text-white/45 md:right-10 md:top-8"
      >
        Portfolio interface
      </div>
      <div
        ref={(element) => {
          labelRefs.current[2] = element;
        }}
        className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.45em] text-white/45 md:bottom-8 md:left-10"
      >
        GSAP sequence online
      </div>
      <div
        ref={(element) => {
          labelRefs.current[3] = element;
        }}
        className="absolute bottom-6 right-6 text-right text-[10px] uppercase tracking-[0.45em] text-primary/70 md:bottom-8 md:right-10"
      >
        Developer systems synced
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={(element) => {
              frameRefs.current[0] = element;
            }}
            className="absolute left-1/2 top-[14%] h-px w-[min(88vw,920px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />
          <div
            ref={(element) => {
              frameRefs.current[1] = element;
            }}
            className="absolute left-1/2 top-[86%] h-px w-[min(88vw,920px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          />
          <div
            ref={(element) => {
              frameRefs.current[2] = element;
            }}
            className="absolute left-[14%] top-1/2 h-[min(74vh,560px)] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent"
          />
          <div
            ref={(element) => {
              frameRefs.current[3] = element;
            }}
            className="absolute right-[14%] top-1/2 h-[min(74vh,560px)] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent"
          />
        </div>

        <div className="relative w-full max-w-4xl">
          <div className="relative mx-auto flex aspect-square w-full max-w-[26rem] items-center justify-center md:max-w-[32rem]">
            <div
              ref={portalRef}
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(255,255,255,0.18)_18%,_rgba(255,255,255,0)_62%)]"
            />
            <div
              ref={(element) => {
                ringRefs.current[0] = element;
              }}
              className="absolute h-[55%] w-[55%] rounded-full border border-primary/30"
            />
            <div
              ref={(element) => {
                ringRefs.current[1] = element;
              }}
              className="absolute h-[78%] w-[78%] rounded-full border border-white/12"
            />
            <div
              ref={(element) => {
                ringRefs.current[2] = element;
              }}
              className="absolute h-full w-full rounded-full border border-white/8"
            />

            {signalNodes.map((_, index) => (
              <div
                key={index}
                ref={(element) => {
                  signalRefs.current[index] = element;
                }}
                className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_18px_rgba(255,255,255,0.35)]"
              />
            ))}

            <div
              ref={glowRef}
              className="absolute h-[32%] w-[32%] rounded-full bg-primary/25 blur-3xl"
            />
            <div
              ref={coreRef}
              className="relative z-10 flex h-[38%] w-[38%] min-h-40 min-w-40 items-center justify-center rounded-full border border-white/14 bg-white/6 shadow-[0_0_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="absolute inset-[10%] rounded-full border border-primary/25" />
              <div className="absolute inset-[18%] rounded-full border border-white/10" />
              <div
                ref={monogramRef}
                className="relative flex flex-col items-center gap-1 text-center"
              >
                <span className="font-display text-5xl font-bold uppercase tracking-[0.22em] text-white md:text-6xl">
                  JK
                </span>
                <span className="text-[9px] uppercase tracking-[0.55em] text-primary/80 md:text-[10px]">
                  Mission core
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-2xl text-center md:mt-10">
            <p
              ref={eyebrowRef}
              className="font-mono text-[10px] uppercase tracking-[0.6em] text-primary/80 md:text-[11px]"
            >
              Launching developer portfolio
            </p>
            <h2
              ref={titleRef}
              className="mt-4 font-display text-4xl font-bold uppercase tracking-[0.16em] text-white md:text-6xl"
            >
              Jainam Khara
            </h2>
            <p
              ref={subtitleRef}
              className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 md:text-base"
            >
              Orbit lines locked. Project systems are aligning for a clean
              entry into the portfolio experience.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-xl items-center gap-4 md:mt-10">
              <span className="font-mono text-xs uppercase tracking-[0.35em] text-white/45">
                Progress
              </span>
              <div className="relative h-px flex-1 overflow-hidden bg-white/12">
                <div
                  ref={progressFillRef}
                  className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-primary via-white to-primary"
                />
              </div>
              <span
                ref={progressValueRef}
                className="min-w-14 text-right font-mono text-sm tracking-[0.3em] text-white"
              >
                00%
              </span>
            </div>

            <div className="mx-auto mt-4 flex max-w-xl items-center justify-between gap-4">
              <span
                ref={statusRef}
                className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/50"
              >
                Calibrating orbit map
              </span>
              <div className="flex h-7 items-end gap-1.5">
                {telemetryBars.map((_, index) => (
                  <div
                    key={index}
                    ref={(element) => {
                      telemetryRefs.current[index] = element;
                    }}
                    className="h-full w-1 rounded-full bg-primary/80"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
