"use client";

import { useEffect, useRef } from "react";

import styles from "./PhotoParticles.module.css";

type Particle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  photo: number;
};

const PARTICLE_COUNT = 150;
const SPRING = 0.045;
const DAMPING = 0.86;
const REPEL_RADIUS = 110;
const REPEL_FORCE = 9;
const REST = 0.05;

/**
 * `text` drawn as round speaker photos that scatter away from the pointer and
 * spring back when it leaves. Still under reduced motion.
 */
export function PhotoParticles({
  text,
  photoUrls,
}: {
  text: string;
  photoUrls: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rootStyle = getComputedStyle(document.documentElement);
    const accent = rootStyle.getPropertyValue("--color-accent").trim();
    const fontFamily = rootStyle.getPropertyValue("--font-display").trim();

    let width = 0;
    let height = 0;
    let diameter = 0;
    let particles: Particle[] = [];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let disposed = false;
    const images: (HTMLImageElement | undefined)[] = [];
    let sprites: (HTMLCanvasElement | undefined)[] = [];

    // Clipping 150 circles every frame is slow, so each photo is cut once per size.
    const cutSprite = (image: HTMLImageElement) => {
      const px = Math.ceil(diameter * devicePixelRatio);
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = px;
      const s = sprite.getContext("2d")!;
      s.beginPath();
      s.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2);
      s.clip();
      s.drawImage(image, 0, 0, px, px);
      return sprite;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = accent;
      const radius = diameter / 2;
      for (const p of particles) {
        const sprite = sprites[p.photo];
        if (sprite) {
          ctx.drawImage(sprite, p.x - radius, p.y - radius, diameter, diameter);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      let settled = pointer === null;
      for (const p of particles) {
        p.vx += (p.homeX - p.x) * SPRING;
        p.vy += (p.homeY - p.y) * SPRING;
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < REPEL_RADIUS && distance > 0) {
            const push = (1 - distance / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / distance) * push;
            p.vy += (dy / distance) * push;
          }
        }
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
        if (
          Math.abs(p.vx) > REST ||
          Math.abs(p.vy) > REST ||
          Math.abs(p.homeX - p.x) > REST ||
          Math.abs(p.homeY - p.y) > REST
        ) {
          settled = false;
        }
      }
      draw();
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (reduced) draw();
      else if (!frame) frame = requestAnimationFrame(tick);
    };

    const layout = async () => {
      await document.fonts.load(`700 100px ${fontFamily}`);
      if (disposed) return;

      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const sample = document.createElement("canvas");
      sample.width = width;
      sample.height = height;
      const s = sample.getContext("2d", { willReadFrequently: true })!;
      const fontSize = Math.min(height * 1.05, width * 0.42);
      s.font = `700 ${fontSize}px ${fontFamily}`;
      s.textAlign = "center";
      s.textBaseline = "middle";
      s.fillText(text, width / 2, height / 2 + fontSize * 0.04);
      const alpha = s.getImageData(0, 0, width, height).data;

      let filled = 0;
      for (let i = 3; i < alpha.length; i += 4) if (alpha[i]! > 128) filled++;
      const gap = Math.sqrt(filled / PARTICLE_COUNT);
      diameter = gap * 0.92;
      sprites = images.map((image) => image && cutSprite(image));

      const previous = particles;
      particles = [];
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          if (alpha[(Math.floor(y) * width + Math.floor(x)) * 4 + 3]! <= 128) {
            continue;
          }
          const old = previous[particles.length];
          const start = reduced
            ? { x, y }
            : (old ?? { x: Math.random() * width, y: Math.random() * height });
          particles.push({
            homeX: x,
            homeY: y,
            x: start.x,
            y: start.y,
            vx: 0,
            vy: 0,
            photo: particles.length % Math.max(1, photoUrls.length),
          });
        }
      }
      wake();
    };

    photoUrls.forEach((url, index) => {
      const image = new Image();
      image.onload = () => {
        if (disposed) return;
        images[index] = image;
        if (diameter) sprites[index] = cutSprite(image);
        if (!frame) draw();
      };
      image.src = url;
    });

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      wake();
    };
    const onLeave = () => {
      pointer = null;
    };
    // A mouse is still over the canvas after a click; a lifted finger isn't.
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };

    const observer = new ResizeObserver(() => void layout());
    observer.observe(canvas);

    const pointerEvents = {
      pointermove: onMove,
      pointerdown: onMove,
      pointerleave: onLeave,
      pointerup: onUp,
      pointercancel: onLeave,
    };
    if (!reduced) {
      for (const [type, handler] of Object.entries(pointerEvents)) {
        canvas.addEventListener(type, handler as EventListener);
      }
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const [type, handler] of Object.entries(pointerEvents)) {
        canvas.removeEventListener(type, handler as EventListener);
      }
    };
  }, [text, photoUrls]);

  return (
    <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
  );
}
