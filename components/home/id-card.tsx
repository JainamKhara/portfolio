"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { IDCardUI } from "./id-card-ui";
import { useLoading } from "@/lib/loading-context";
const ATTACHMENT_OFFSET_Y = 28;
const ANCHOR_Y = 20;

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
  const { isLoading } = useLoading();
  const gradientId = "id-card-grad";
  const edgeGradientId = `${gradientId}-edge`;
  const glowId = `${gradientId}-glow`;
  const strapPathId = `${gradientId}-strap-path`;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapGroupRef = useRef<SVGGElement>(null);
  const strapPathsRef = useRef<SVGPathElement[]>([]);
  const strapClipRef = useRef<SVGGElement>(null);
  const mountSwingRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(282);

  useEffect(() => {
    const checkMobile = () => {
      const touchDevice = 
        typeof window !== "undefined" && 
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const userAgentMobile = 
        typeof navigator !== "undefined" && 
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      setIsMobile(window.innerWidth < 1024 || touchDevice || userAgentMobile);
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
    const strapGroup = strapGroupRef.current;
    const strapClip = strapClipRef.current;
    const mountSwing = mountSwingRef.current;
    const layout = layoutRef.current;
    const sim = simRef.current;

    if (
      !card ||
      !strapGroup ||
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
    const bow = clamp(78 + Math.abs(dx) * 0.12 + speed * 0.8, 72, 130);

    const control1X = layout.anchorX + dx * 0.08;
    const control1Y = layout.anchorY + bow * 0.48;
    const control2X = attachX - dx * 0.12 - sim.vx * 0.45;
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

    if (strapPathsRef.current.length === 0) {
      strapPathsRef.current = Array.from(strapGroup.querySelectorAll("path"));
    }
    strapPathsRef.current.forEach((p) => p.setAttribute("d", path));

    if (strapClip) {
      strapClip.setAttribute(
        "transform",
        `translate(${attachX}, ${attachY}) rotate(${sim.angle})`
      );
    }

    if (mountSwing) {
      mountSwing.style.transform = `rotate(${mountTilt}deg)`;
    }
  }, [getAttachmentPoint, getTransformOrigin]);

  const runningRef = useRef(false);

  const wakeUp = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    let previous = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;

      const dt = Math.min((now - previous) / 16.6667, 2);
      previous = now;

      const layout = layoutRef.current;
      const sim = simRef.current;

      if (sim.ready && layout.cardHeight) {
        if (!sim.dragging) {
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
          const desiredY = hangingY - ATTACHMENT_OFFSET_Y;
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

          const targetAngle = clamp(swingDx * 0.1 + sim.vx * 2.6, -22, 22);
          sim.angularVelocity += (targetAngle - sim.angle) * 0.12 * dt;
          sim.angularVelocity *= reducedMotionRef.current ? 0.76 : 0.86;
          sim.angle += sim.angularVelocity * dt;

          // Sleep check:
          const distToRest = Math.hypot(sim.x - layout.restX, sim.y - desiredY);
          const speed = Math.hypot(sim.vx, sim.vy);
          const angSpeed = Math.abs(sim.angularVelocity);
          const angleDiff = Math.abs(sim.angle);

          if (
            distToRest < 0.15 &&
            speed < 0.025 &&
            angSpeed < 0.012 &&
            angleDiff < 0.06
          ) {
            // Snap to absolute rest
            sim.x = layout.restX;
            sim.y = desiredY;
            sim.vx = 0;
            sim.vy = 0;
            sim.angle = 0;
            sim.angularVelocity = 0;

            renderScene();
            runningRef.current = false;
            return;
          }
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

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }, [getAttachmentPoint, renderScene]);

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
      const stageWidth = stage.clientWidth || 528;
      const stageHeight = stage.clientHeight || 720;

      const widthRatio = stageWidth < 400 ? 0.85 : 0.82;
      const nextCardWidth = Math.round(
        clamp(stageWidth * widthRatio, 280, 410),
      );
      const cardHeight = card.offsetHeight || 480;
      const anchorX = stageWidth / 2;
      const anchorY = ANCHOR_Y;
      const strapLength = isMobile
        ? (stageWidth < 400 ? clamp(stageHeight * 0.28, 90, 135) : clamp(stageHeight * 0.32, 120, 170))
        : clamp(stageHeight * 0.31, 160, 210);
      const restX = anchorX - nextCardWidth / 2;
      const restY = anchorY + strapLength - ATTACHMENT_OFFSET_Y;
      const minX = -nextCardWidth * 0.4;
      const maxX = stageWidth - nextCardWidth * 0.6;
      const minY = 10;
      const maxY = stageHeight - 40;

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
      }

      renderScene();
      wakeUp();
    };

    const resizeObserver = new ResizeObserver(syncLayout);
    resizeObserver.observe(stage);
    resizeObserver.observe(card);
    syncLayout();

    return () => resizeObserver.disconnect();
  }, [getAttachmentPoint, renderScene, isMobile]);

  useEffect(() => {
    wakeUp();
    return () => {
      runningRef.current = false;
    };
  }, [wakeUp]);

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
    wakeUp();
  }, [wakeUp]);

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
      
      const stage = stageRef.current;
      let nextX = point.x - sim.dragOffsetX;
      let nextY = point.y - sim.dragOffsetY;
      
      if (stage) {
        const stageRect = stage.getBoundingClientRect();
        const dynMinX = -stageRect.left - layout.cardWidth + 80;
        const dynMaxX = window.innerWidth - stageRect.left - 80;
        const dynMinY = -stageRect.top - layout.cardHeight + 80;
        const dynMaxY = window.innerHeight - stageRect.top - 80;
        
        nextX = clamp(nextX, dynMinX, dynMaxX);
        nextY = clamp(nextY, dynMinY, dynMaxY);
      }

      sim.vx = (nextX - sim.x) / dt;
      sim.vy = (nextY - sim.y) / dt;
      sim.x = nextX;
      sim.y = nextY;
      sim.lastPointerAt = now;

      renderScene();
      wakeUp();
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
    if (!event.isPrimary) return;

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
    wakeUp();
    if (event.cancelable) {
      event.preventDefault();
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative h-full w-full overflow-visible"
      style={{ 
        touchAction: isMobile ? "pan-y" : "none",
        opacity: isLoading ? 0 : 1,
        pointerEvents: isLoading ? "none" : "auto",
        transition: "opacity 0.5s ease-in-out"
      }}
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
          
          {/* High-fidelity twill weave fabric texture pattern */}
          <pattern id="lanyard-weave" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
            <rect width="6" height="6" fill="none" />
            <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(0, 0, 0, 0.35)" strokeWidth="2.2" />
            <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1.8" />
            <line x1="0" y1="1.5" x2="6" y2="1.5" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1" />
            <line x1="0" y1="4.5" x2="6" y2="4.5" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          </pattern>

          {/* Premium gunmetal and chrome linear gradients for clasp hardware */}
          <linearGradient id="metal-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1c" />
            <stop offset="35%" stopColor="#3d3d42" />
            <stop offset="65%" stopColor="#252528" />
            <stop offset="100%" stopColor="#0e0e0f" />
          </linearGradient>
          <linearGradient id="metal-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a8a93" />
            <stop offset="25%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#a3a3ac" />
            <stop offset="85%" stopColor="#52525b" />
            <stop offset="100%" stopColor="#18181b" />
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

        {/* Dynamic 12-layer volumetric strap shading container */}
        <g ref={strapGroupRef}>
          {/* 1. Ambient Occlusion Drop Shadow */}
          <path
            fill="none"
            stroke="rgba(0, 0, 0, 0.45)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
          />
          {/* 2. Deep Under-edge Red Shadow */}
          <path
            fill="none"
            stroke="#1f0201"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 3. Base Shadow Red Contour */}
          <path
            fill="none"
            stroke="#520503"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 4. Core Rich Crimson Ribbon */}
          <path
            fill="none"
            stroke="#a31410"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 5. Center Brilliant 3D Ribbon Face */}
          <path
            fill="none"
            stroke="#d9281c"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 6. Centered Volumetric Highlight Beam */}
          <path
            fill="none"
            stroke="#ff6054"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 7. Specular Silk Reflection (Text Path Anchor) */}
          <path
            id={strapPathId}
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.28"
          />
          {/* 8. Repeating Woven Ribbed Fabric Overlay */}
          <path
            fill="none"
            stroke="url(#lanyard-weave)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          {/* 9. Embossed Left Stitch Shadow */}
          <path
            fill="none"
            stroke="rgba(0, 0, 0, 0.48)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="2 3"
            transform="translate(-6.8 0.4)"
          />
          {/* 10. Left Fine Cotton Stitch Thread */}
          <path
            fill="none"
            stroke="rgba(255, 255, 255, 0.38)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="2 3"
            transform="translate(-6.8 0)"
          />
          {/* 11. Embossed Right Stitch Shadow */}
          <path
            fill="none"
            stroke="rgba(0, 0, 0, 0.48)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="2 3"
            transform="translate(6.8 0.4)"
          />
          {/* 12. Right Fine Cotton Stitch Thread */}
          <path
            fill="none"
            stroke="rgba(255, 255, 255, 0.38)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="2 3"
            transform="translate(6.8 0)"
          />
        </g>



        {/* Dynamically swinging gunmetal/chrome Swivel snap hook clasp */}
        <g ref={strapClipRef} className="pointer-events-none">
          {/* Fabric fold wrapping around swivel clasp D-ring */}
          <rect x="-10" y="-20" width="20" height="11" rx="1.5" fill="#400403" stroke="rgba(0,0,0,0.55)" strokeWidth="0.8" />
          <line x1="-10" y1="-12" x2="10" y2="-12" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
          {/* Metallic Rivet through the fabric fold */}
          <circle cx="0" cy="-15" r="2.8" fill="url(#metal-light)" stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
          
          {/* D-ring Loop of the swivel clasp */}
          <path 
            d="M -12 -12 L 12 -12 A 1.8 1.8 0 0 1 13.8 -10.2 L 9 -5 C 7.5 -3.5, 6 -2.5, 3.5 -2.5 L -3.5 -2.5 C -6 -2.5, -7.5 -3.5, -9 -5 L -13.8 -10.2 A 1.8 1.8 0 0 1 -12 -12 Z" 
            fill="url(#metal-dark)" 
            stroke="rgba(0,0,0,0.6)" 
            strokeWidth="0.8" 
          />
          
          {/* Swivel center collar */}
          <rect x="-3" y="-2.5" width="6" height="4.5" rx="1" fill="url(#metal-light)" stroke="rgba(0,0,0,0.55)" strokeWidth="0.6" />
          
          {/* Snap hook curved main body */}
          <path 
            d="M -4.5 2 C -4.5 4.5, -6.5 8.5, -3 11.5 C 0.5 14.5, 5.5 12, 6 7.5 C 6.2 5.5, 4.5 3.5, 4.5 2" 
            fill="none" 
            stroke="url(#metal-dark)" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
          
          {/* Clasp wire spring gate */}
          <line x1="3.5" y1="2" x2="-3.5" y2="7.5" stroke="url(#metal-light)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute top-0 z-20 -translate-x-1/2"
        style={{ left: layoutState.anchorX }}
      >
        <div className="mx-auto h-3 w-12 rounded-full bg-black/15 blur-md" />
        <div className="relative mx-auto mt-0 flex w-[5.5rem] flex-col items-center">
          {/* Wall Mount Pin / Polished Metal Dome Rivet */}
          <div className="absolute -top-1.5 h-6 w-6 rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#e4e4e7_20%,#a1a1aa_45%,#52525b_75%,#18181b_100%)] shadow-[0_5px_12px_rgba(0,0,0,0.45),inset_0_-1.5px_2px_rgba(0,0,0,0.7)]">
            <div className="absolute left-[5px] top-[4px] h-[3px] w-[5px] rotate-[-15deg] rounded-full bg-white/60 blur-[0.3px]" />
            <div className="absolute inset-[7px] rounded-full border border-white/5 bg-gradient-to-br from-zinc-600 to-zinc-950 opacity-40" />
          </div>

          <div
            ref={mountSwingRef}
            className="relative mt-[0.55rem] flex flex-col items-center origin-top transition-transform duration-75 ease-out"
          >
            {/* Metal connector loop holding the breakaway buckle */}
            <div className="h-[0.45rem] w-[0.22rem] rounded-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-800 border-x border-black/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
            
            {/* Breakaway buckle / matte black polymer clasp */}
            <div className="relative mt-[0.12rem] h-[0.95rem] w-[3.8rem] rounded-[3px] border border-zinc-950 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.15)]">
              <div className="absolute -left-[3px] top-[2px] bottom-[2px] w-[3px] rounded-l-[1.5px] border-y border-l border-zinc-950 bg-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
              <div className="absolute -right-[3px] top-[2px] bottom-[2px] w-[3px] rounded-r-[1.5px] border-y border-r border-zinc-950 bg-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-1/2 bg-zinc-950" />
              <div className="absolute left-2.5 right-2.5 top-[2px] bottom-[2px] rounded-[1.5px] border border-zinc-950 bg-zinc-950/40 flex items-center justify-between px-1">
                <div className="h-[2px] w-[4px] rounded-sm bg-zinc-700/60" />
                <div className="h-[2px] w-[4px] rounded-sm bg-zinc-700/60" />
              </div>
              <div className="absolute inset-x-2.5 top-[1px] h-[1px] bg-white/10" />
            </div>
            
            {/* Bottom attachment oval steel ring */}
            <div className="relative mt-[0.14rem] flex h-[0.45rem] w-[1.8rem] items-center justify-center rounded-[4px] border border-zinc-950 bg-gradient-to-b from-zinc-100 via-zinc-400 to-zinc-700 shadow-[0_3px_6px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]">
              <div className="h-[0.18rem] w-[1.1rem] rounded-[2px] bg-black shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.9)]" />
              <div className="absolute left-1/2 top-1/2 h-[0.38rem] w-[0.24rem] -translate-x-1/2 rounded-full border border-zinc-950 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={cardRef}
        role="application"
        aria-label="Interactive 3D lanyard student ID card. Click and drag to swing with realistic physical spring dynamics."
        className="absolute left-0 top-0 z-30 will-change-transform"
        style={{
          width: `${cardWidth}px`,
          opacity: 0,
          transformOrigin: `50% ${ATTACHMENT_OFFSET_Y}px`,
          transformStyle: "preserve-3d",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
      >
        <IDCardUI isDragging={isDragging} />
      </div>
    </div>
  );
}
