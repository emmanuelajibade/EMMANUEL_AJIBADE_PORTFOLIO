"use client";

import { useEffect, useRef } from "react";

type RingDot = {
  angle: number;
  baseRadius: number;
  phase: number;
  hue: number;
  saturation: number;
  lightness: number;
  ringIndex: number;
};

export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let dots: RingDot[] = [];
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;

    const createDots = () => {
      const baseRadius = Math.min(width, height) * 0.18;
      const ringCount = 3;

      dots = [];

      for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
        const radius = baseRadius + ringIndex * (Math.min(width, height) * 0.06);
        const dotCount = Math.max(140, Math.min(240, Math.round(radius * 2.8)));

        for (let index = 0; index < dotCount; index += 1) {
          const angle = (index / dotCount) * Math.PI * 2;

          dots.push({
            angle,
            baseRadius:
              radius +
              Math.sin(angle * (3.8 + ringIndex * 0.6) + index * 0.8) * (10 + ringIndex * 5),
            phase: index * 0.36 + ringIndex * 1.1,
            hue: 198 + ringIndex * 26 + Math.sin(index * 0.8) * 18,
            saturation: 70 + ringIndex * 5 + Math.cos(index * 0.5) * 12,
            lightness: 64 + Math.sin(index * 0.35) * 10,
            ringIndex,
          });
        }
      }
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDots();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const render = (time: number) => {
      const pointer = pointerRef.current;
      const pulse = Math.sin(time * 0.0019);
      const breathingRadius = Math.sin(time * 0.0012) * 12;
      const maxInfluenceDistance = Math.min(width, height) * 0.28;

      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        18,
        centerX,
        centerY,
        Math.min(width, height) * 0.72,
      );
      glow.addColorStop(0, "rgba(96, 165, 250, 0.08)");
      glow.addColorStop(0.42, "rgba(249, 115, 22, 0.04)");
      glow.addColorStop(1, "rgba(15, 23, 42, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (const dot of dots) {
        const baseX = centerX + Math.cos(dot.angle) * (dot.baseRadius + breathingRadius + dot.ringIndex * 4);
        const baseY = centerY + Math.sin(dot.angle) * (dot.baseRadius + breathingRadius + dot.ringIndex * 4);

        let influence = 0;
        let offsetX = 0;
        let offsetY = 0;

        if (pointer.active) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxInfluenceDistance) {
            influence = 1 - distance / maxInfluenceDistance;
            const pullForce = Math.pow(influence, 2) * 30;
            const normalizedX = distance === 0 ? 0 : dx / distance;
            const normalizedY = distance === 0 ? 0 : dy / distance;

            offsetX = normalizedX * pullForce;
            offsetY = normalizedY * pullForce;
          }
        }

        const x = baseX - offsetX;
        const y = baseY - offsetY;

        const hue =
          influence > 0 ? 28 + pulse * 8 : dot.hue + Math.sin(time * 0.0014 + dot.phase) * 18;
        const saturation = influence > 0 ? 96 : dot.saturation;
        const lightness = influence > 0 ? 58 : dot.lightness + Math.sin(time * 0.0018 + dot.phase) * 8;
        const alpha = influence > 0 ? 1 : 0.68 + (Math.sin(time * 0.0012 + dot.phase) + 1) * 0.12;

        context.beginPath();
        context.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        context.arc(x, y, influence > 0 ? 4.2 : 2.6 + dot.ringIndex * 0.2, 0, Math.PI * 2);
        context.fill();
      }

      frameRef.current = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
