import type { RefObject } from "react";
import { useEffect } from "react";

const PULL = 0.15;
const MAX_DISTANCE = 16;
const VERTICAL = 0.5;
const HOVER_SCALE = 1.05;

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

/**
 * The speaker photo drifts toward a mouse cursor inside its box and springs back on leave.
 * Listens on the card because the card's open button covers it. GSAP loads on the first hover.
 */
export function useMagneticPull(
  cardRef: RefObject<HTMLElement | null>,
  photoRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const card = cardRef.current;
    const photo = photoRef.current;
    const image = photo?.querySelector("img");
    if (!card || !photo || !image) return;

    let gsap: typeof import("gsap").gsap | null = null;
    let loading = false;
    let enabled = false;
    let inside = false;
    let revert: (() => void) | undefined;
    let unmounted = false;

    const leave = () => {
      if (!inside) return;
      inside = false;
      if (gsap && enabled)
        gsap.to(image, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto",
        });
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = photo.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return leave();

      if (!gsap) {
        if (!loading) {
          loading = true;
          void import("gsap").then((module) => {
            if (unmounted) return;
            gsap = module.gsap;
            const mm = gsap.matchMedia();
            mm.add(
              "(hover: hover) and (prefers-reduced-motion: no-preference)",
              () => {
                enabled = true;
                return () => {
                  enabled = false;
                  inside = false;
                  module.gsap.killTweensOf(image);
                  module.gsap.set(image, { clearProps: "transform" });
                };
              },
            );
            revert = () => mm.revert();
          });
        }
        return;
      }
      if (!enabled) return;

      if (!inside) {
        inside = true;
        gsap.to(image, {
          scale: HOVER_SCALE,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      gsap.to(image, {
        x: clamp((x - rect.width / 2) * PULL, MAX_DISTANCE),
        y: clamp(
          (y - rect.height / 2) * PULL * VERTICAL,
          MAX_DISTANCE * VERTICAL,
        ),
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      unmounted = true;
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      gsap?.killTweensOf(image);
      gsap?.set(image, { clearProps: "transform" });
      revert?.();
    };
  }, [cardRef, photoRef]);
}
