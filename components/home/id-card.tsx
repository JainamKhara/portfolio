"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { IDCardUI } from "./id-card-ui";

const ATTACHMENT_OFFSET_Y = 28;
const ANCHOR_Y = 18;
const SIDE_ALLOWANCE = 20;
const BOTTOM_PADDING = 24;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type LayoutState = {
  stageWidth: number;
  stageHeight: number;
  cardWidth: number;
  anchorX: number;
  anchorY: number;
};

type LayoutModel = LayoutState & {
  cardHeight: number;
  restX: number;
  restY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  strapLength: number;
};

type SimulationModel = {
  ready: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  dragging: boolean;
  pointerId: number | null;
  dragOffsetX: number;
  dragOffsetY: number;
  grabPointX: number;
  grabPointY: number;
  lastPointerAt: number;
};

export function IDCard() {
  const gradientId = useId().replace(/:/g, "");
  const edgeGradientId = `${gradientId}-edge`;
  const glowId = `${gradientId}-glow`;
  const strapPathId = `${gradientId}-strap-path`;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const strapEdgeRef = useRef<SVGPathElement>(null);
  const strapStitchRef = useRef<SVGPathElement>(null);
  const strapSeamLeftRef = useRef<SVGPathElement>(null);
  const strapSeamRightRef = useRef<SVGPathElement>(null);
  const mountSwingRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(282);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [layoutState, setLayoutState] = useState<LayoutState>({
    stageWidth: 0,
    stageHeight: 0,
    cardWidth: 282,
    anchorX: 0,
    anchorY: 0,
  });

  const reducedMotionRef = useRef(false);
  const layoutRef = useRef<LayoutModel>({
    stageWidth: 0,
    stageHeight: 0,
    cardWidth: 282,
    cardHeight: 0,
    anchorX: 0,
    anchorY: ANCHOR_Y,
    restX: 0,
    restY: 0,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    strapLength: 210,
  });
  const simRef = useRef<SimulationModel>({
    ready: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    angularVelocity: 0,
    dragging: false,
    pointerId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    grabPointX: 0,
    grabPointY: 0,
    lastPointerAt: 0,
  });

  const getTransformOrigin = useCallback(
    (sim: SimulationModel, layout: LayoutModel) => {
      if (!sim.dragging) {
        return {
          x: layout.cardWidth / 2,
          y: ATTACHMENT_OFFSET_Y,
        };
      }

      return {
        x: sim.grabPointX,
        y: sim.grabPointY,
      };
    },
    [],
  );

  const getAttachmentPoint = useCallback(
    (sim: SimulationModel, layout: LayoutModel) => {
      const attachmentLocalX = layout.cardWidth / 2;
      const attachmentLocalY = ATTACHMENT_OFFSET_Y;
      const origin = getTransformOrigin(sim, layout);

      if (Math.abs(sim.angle) < 0.001) {
        return {
          x: sim.x + attachmentLocalX,
          y: sim.y + attachmentLocalY,
        };
      }

      const radians = (sim.angle * Math.PI) / 180;
      const relativeX = attachmentLocalX - origin.x;
      const relativeY = attachmentLocalY - origin.y;
      const rotatedX =
        origin.x +
        relativeX * Math.cos(radians) -
        relativeY * Math.sin(radians);
      const rotatedY =
        origin.y +
        relativeX * Math.sin(radians) +
        relativeY * Math.cos(radians);

      return {
        x: sim.x + rotatedX,
        y: sim.y + rotatedY,
      };
    },
    [getTransformOrigin],
  );

  const renderScene = useCallback(() => {
    const card = cardRef.current;
    const strap = strapRef.current;
    const strapEdge = strapEdgeRef.current;
    const strapStitch = strapStitchRef.current;
    const strapSeamLeft = strapSeamLeftRef.current;
    const strapSeamRight = strapSeamRightRef.current;
    const mountSwing = mountSwingRef.current;
    const layout = layoutRef.current;
    const sim = simRef.current;

    if (
      !card ||
      !strap ||
      !strapEdge ||
      !strapStitch ||
      !strapSeamLeft ||
      !strapSeamRight ||
      !layout.cardHeight
    ) {
      return;
    }

    const attachmentPoint = getAttachmentPoint(sim, layout);
    const attachX = attachmentPoint.x;
    const attachY = attachmentPoint.y;
    const dx = attachX - layout.anchorX;
    const dy = attachY - layout.anchorY;
    const speed = Math.hypot(sim.vx, sim.vy);
    const bow = clamp(72 + Math.abs(dx) * 0.24 + speed * 18, 72, 166);

    const control1X = layout.anchorX + dx * 0.08;
    const control1Y = layout.anchorY + bow * 0.48;
    const control2X = attachX - dx * 0.18 - sim.vx * 7;
    const control2Y = attachY - Math.max(78, bow * 0.55 + dy * 0.06);
    const path = `M ${layout.anchorX} ${layout.anchorY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${attachX} ${attachY}`;
    const mountTilt = clamp(
      (Math.atan2(control1Y - layout.anchorY, control1X - layout.anchorX) *
        180) /
        Math.PI -
        90,
      -24,
      24,
    );

    card.style.opacity = sim.ready ? "1" : "0";
    const transformOrigin = getTransformOrigin(sim, layout);
    const grabOffsetX = transformOrigin.x - layout.cardWidth / 2;
    const grabOffsetY = transformOrigin.y - layout.cardHeight / 2;
    const tiltX = sim.dragging
      ? clamp(-sim.vy * 1.7 + grabOffsetY * 0.06, -17, 17)
      : clamp(-sim.vy * 0.74, -8, 8);
    const tiltY = sim.dragging
      ? clamp(sim.vx * 1.95 + grabOffsetX * 0.11 + dx * 0.026, -22, 22)
      : clamp(sim.vx * 0.9 + dx * 0.034, -10, 10);
    card.style.transformOrigin = `${transformOrigin.x}px ${transformOrigin.y}px`;
    card.style.transform = `perspective(1600px) translate3d(${sim.x}px, ${sim.y}px, 0) rotateZ(${sim.angle}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    strap.setAttribute("d", path);
    strapEdge.setAttribute("d", path);
    strapStitch.setAttribute("d", path);
    strapSeamLeft.setAttribute("d", path);
    strapSeamRight.setAttribute("d", path);
    if (mountSwing) {
      mountSwing.style.transform = `rotate(${mountTilt}deg)`;
    }
  }, [getAttachmentPoint, getTransformOrigin]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = media.matches;
    };

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const syncLayout = () => {
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;

      if (!stageWidth || !stageHeight) return;

      const widthRatio = stageWidth < 400 ? 0.82 : 0.64;
      const nextCardWidth = Math.round(
        clamp(stageWidth * widthRatio, 248, 312),
      );
      const cardHeight = card.offsetHeight;
      const anchorX = stageWidth / 2;
      const anchorY = ANCHOR_Y;
      const strapLength = isMobile ? 180 : clamp(stageHeight * 0.46, 210, 276);
      const stageRect = stage.getBoundingClientRect();
      const restX = anchorX - nextCardWidth / 2;
      const restY = Math.min(
        anchorY + strapLength - ATTACHMENT_OFFSET_Y,
        stageHeight - cardHeight - BOTTOM_PADDING,
      );
      const minX = -stageRect.left + SIDE_ALLOWANCE;
      const maxX =
        window.innerWidth - stageRect.left - nextCardWidth - SIDE_ALLOWANCE;
      const minY = -stageRect.top + SIDE_ALLOWANCE;
      const maxY =
        window.innerHeight - stageRect.top - cardHeight - SIDE_ALLOWANCE;

      layoutRef.current = {
        stageWidth,
        stageHeight,
        cardWidth: nextCardWidth,
        cardHeight,
        anchorX,
        anchorY,
        restX,
        restY,
        minX,
        maxX,
        minY,
        maxY,
        strapLength,
      };

      setCardWidth((current) =>
        current !== nextCardWidth ? nextCardWidth : current,
      );
      setLayoutState((current) => {
        if (
          current.stageWidth === stageWidth &&
          current.stageHeight === stageHeight &&
          current.cardWidth === nextCardWidth &&
          current.anchorX === anchorX &&
          current.anchorY === anchorY
        ) {
          return current;
        }

        return {
          stageWidth,
          stageHeight,
          cardWidth: nextCardWidth,
          anchorX,
          anchorY,
        };
      });

      const sim = simRef.current;
      if (!sim.ready) {
        sim.ready = true;
        sim.x = restX;
        sim.y = restY;
      } else if (!sim.dragging) {
        sim.x = clamp(sim.x, minX, maxX);
        sim.y = clamp(sim.y, minY, maxY);
      }

      renderScene();
    };

    const resizeObserver = new ResizeObserver(syncLayout);
    resizeObserver.observe(stage);
    resizeObserver.observe(card);
    syncLayout();

    return () => resizeObserver.disconnect();
  }, [getAttachmentPoint, renderScene, isMobile]);

  useEffect(() => {
    let frameId = 0;
    let previous = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - previous) / 16.6667, 2);
      previous = now;

      const layout = layoutRef.current;
      const sim = simRef.current;

      if (sim.ready && layout.cardHeight) {
        if (isMobile) {
          // Keep at rest position on mobile
          sim.vx = 0;
          sim.vy = 0;
          sim.angularVelocity = 0;
          sim.x = layout.restX;
          sim.y = layout.restY;
          sim.angle = 0;
        } else if (!sim.dragging) {
          const attachmentPoint = getAttachmentPoint(sim, layout);
          const attachX = attachmentPoint.x;
          const swingDx = clamp(
            attachX - layout.anchorX,
            -layout.strapLength * 0.94,
            layout.strapLength * 0.94,
          );
          const hangingY =
            layout.anchorY +
            Math.sqrt(
              Math.max(
                layout.strapLength * layout.strapLength - swingDx * swingDx,
                0,
              ),
            );
          const desiredY = Math.max(
            layout.minY,
            hangingY - ATTACHMENT_OFFSET_Y,
          );
          const restingInfluence = reducedMotionRef.current ? 0.015 : 0.026;

          if (!reducedMotionRef.current) {
            sim.vx += Math.sin(now / 980) * 0.02 * dt;
          }

          sim.vx += (layout.restX - sim.x) * restingInfluence * dt;
          sim.vy += (desiredY - sim.y) * 0.038 * dt;
          sim.vx *= reducedMotionRef.current ? 0.9 : 0.955;
          sim.vy *= reducedMotionRef.current ? 0.9 : 0.96;
          sim.x += sim.vx * dt;
          sim.y += sim.vy * dt;
          sim.x = clamp(sim.x, layout.minX, layout.maxX);
          sim.y = clamp(sim.y, layout.minY, layout.maxY);

          const targetAngle = clamp(swingDx * 0.1 + sim.vx * 2.6, -22, 22);
          sim.angularVelocity += (targetAngle - sim.angle) * 0.12 * dt;
          sim.angularVelocity *= reducedMotionRef.current ? 0.76 : 0.86;
          sim.angle += sim.angularVelocity * dt;
        } else {
          const attachmentPoint = getAttachmentPoint(sim, layout);
          const attachX = attachmentPoint.x;
          const targetAngle = clamp(
            (attachX - layout.anchorX) * 0.15 +
              sim.vx * 2.6 +
              (sim.grabPointX - layout.cardWidth / 2) * 0.04,
            -26,
            26,
          );
          sim.angularVelocity += (targetAngle - sim.angle) * 0.24 * dt;
          sim.angularVelocity *= 0.84;
          sim.angle += sim.angularVelocity * dt;
        }

        renderScene();
      }

      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, [getAttachmentPoint, renderScene, isMobile]);

  const getPointFromClient = useCallback((clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const endDrag = useCallback(() => {
    const sim = simRef.current;
    if (!sim.dragging) return;

    sim.dragging = false;
    sim.pointerId = null;
    sim.angularVelocity += sim.vx * 0.28;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const sim = simRef.current;
      const layout = layoutRef.current;

      if (!sim.dragging || sim.pointerId !== event.pointerId) {
        return;
      }

      const point = getPointFromClient(event.clientX, event.clientY);
      const now = performance.now();
      const dt = Math.max((now - sim.lastPointerAt) / 16.6667, 0.6);
      const nextX = clamp(point.x - sim.dragOffsetX, layout.minX, layout.maxX);
      const nextY = clamp(point.y - sim.dragOffsetY, layout.minY, layout.maxY);

      sim.vx = (nextX - sim.x) / dt;
      sim.vy = (nextY - sim.y) / dt;
      sim.x = nextX;
      sim.y = nextY;
      sim.lastPointerAt = now;

      renderScene();
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const handlePointerEnd = (event: PointerEvent) => {
      const sim = simRef.current;
      if (!sim.dragging || sim.pointerId !== event.pointerId) {
        return;
      }

      endDrag();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [endDrag, getPointFromClient, renderScene]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isMobile || !event.isPrimary) return;

    const sim = simRef.current;
    const layout = layoutRef.current;
    if (!layout.cardHeight) return;

    const point = getPointFromClient(event.clientX, event.clientY);
    sim.dragging = true;
    sim.pointerId = event.pointerId;
    sim.dragOffsetX = point.x - sim.x;
    sim.dragOffsetY = point.y - sim.y;
    sim.grabPointX = point.x - sim.x;
    sim.grabPointY = point.y - sim.y;
    sim.lastPointerAt = performance.now();
    setIsDragging(true);
    if (event.cancelable) {
      event.preventDefault();
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative h-full w-full overflow-visible"
      style={{ touchAction: isMobile ? "pan-y" : "none" }}
    >
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${Math.max(layoutState.stageWidth, 1)} ${Math.max(layoutState.stageHeight, 1)}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A0B09" />
            <stop offset="20%" stopColor="#8A1310" />
            <stop offset="52%" stopColor="#D9281C" />
            <stop offset="80%" stopColor="#A31C14" />
            <stop offset="100%" stopColor="#4A0B09" />
          </linearGradient>
          <linearGradient id={edgeGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,230,230,0.38)" />
            <stop offset="26%" stopColor="rgba(255,200,200,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-inner`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="18%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="84%" stopColor="rgba(10,7,18,0.08)" />
            <stop offset="100%" stopColor="rgba(4,4,8,0.12)" />
          </linearGradient>
          <linearGradient
            id={`${gradientId}-lane`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(23,16,34,0.95)" />
            <stop offset="45%" stopColor="rgba(31,20,48,0.94)" />
            <stop offset="100%" stopColor="rgba(14,10,22,0.96)" />
          </linearGradient>
          <filter id={glowId} x="-45%" y="-30%" width="190%" height="190%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="3.6"
              floodColor="rgba(2,2,6,0.28)"
            />
            <feGaussianBlur stdDeviation="0.32" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.423 0 1 0 0 0.278 0 0 1 0 1 0 0 0 0.008 0"
            />
            <feBlend in="SourceGraphic" in2="blur" />
          </filter>
        </defs>


        <path
          id={strapPathId}
          ref={strapRef}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
        <path
          ref={strapEdgeRef}
          fill="none"
          stroke={`url(#${edgeGradientId})`}
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.32"
        />

        <path
          ref={strapStitchRef}
          fill="none"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="1 12"
          opacity="0.18"
        />
        <path
          ref={strapSeamLeftRef}
          fill="none"
          stroke="rgba(248, 245, 255, 0.74)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.82"
          transform="translate(-4.9 0)"
        />
        <path
          ref={strapSeamRightRef}
          fill="none"
          stroke="rgba(20, 14, 31, 0.72)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.88"
          transform="translate(4.9 0)"
        />

        <text
          fill="rgba(255, 252, 244, 1)"
          stroke="rgba(11, 8, 16, 1)"
          strokeWidth="1.85"
          paintOrder="stroke"
          fontSize="12.1"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          letterSpacing="1.3"
          opacity="0.98"
        >
          <textPath
            href={`#${strapPathId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            JAINAM KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM
            KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM KHARA •
            JAINAM KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM KHARA • JAINAM
            KHARA • JAINAM KHARA
          </textPath>
        </text>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-20 -translate-x-1/2"
        style={{ left: layoutState.anchorX }}
      >
        <div className="mx-auto h-2.5 w-10 rounded-full bg-primary/10 blur-md" />
        <div className="relative mx-auto mt-0 flex w-[5.2rem] flex-col items-center">
          <div className="absolute -top-1 h-4.5 w-4.5 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.88),rgba(80,80,80,0.88)_42%,rgba(10,10,10,0.96)_100%)] shadow-[0_7px_14px_rgba(8,8,16,0.32)]" />
          <div
            ref={mountSwingRef}
            className="relative mt-[0.45rem] flex flex-col items-center origin-top transition-transform duration-75 ease-out"
          >
            <div className="h-[0.42rem] w-[0.18rem] rounded-full bg-[linear-gradient(180deg,rgba(200,200,200,0.94)_0%,rgba(30,30,30,0.9)_100%)]" />
            <div className="relative mt-[0.18rem] h-[0.92rem] w-full rounded-[999px] border border-white/12 bg-[linear-gradient(180deg,rgba(220,220,220,0.98)_0%,rgba(120,120,120,0.92)_30%,rgba(20,20,20,0.95)_100%)] shadow-[0_7px_14px_rgba(6,6,12,0.28)]">
              <div className="absolute left-1/2 top-1/2 h-[0.22rem] w-[3rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,rgba(10,10,10,0.96)_0%,rgba(5,5,5,1)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
              <div className="absolute left-1/2 top-1/2 h-[0.06rem] w-[1.7rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/12" />
              <div className="absolute inset-x-3 top-[0.11rem] h-px bg-white/65" />
            </div>
            <div className="relative mt-[0.16rem] flex h-[0.34rem] w-[1.5rem] items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(200,200,200,0.96)_0%,rgba(40,40,40,0.92)_100%)] shadow-[0_4px_8px_rgba(8,8,14,0.24)]">
              <div className="h-[0.08rem] w-[0.78rem] rounded-full bg-[rgba(10,10,10,0.7)]" />
              <div className="absolute left-1/2 top-full h-[0.42rem] w-[0.16rem] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(100,100,100,0.95)_0%,rgba(15,15,15,0.94)_100%)]" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={cardRef}
        className="absolute left-0 top-0 z-30 will-change-transform"
        style={{
          width: `${cardWidth}px`,
          opacity: 0,
          transformOrigin: `50% ${ATTACHMENT_OFFSET_Y}px`,
          transformStyle: "preserve-3d",
          touchAction: isMobile ? "pan-y" : "none",
        }}
        onPointerDown={handlePointerDown}
      >
        <IDCardUI isDragging={isDragging} />
      </div>
    </div>
  );
}
