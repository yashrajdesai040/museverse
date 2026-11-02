'use client';

import { useEffect, useRef } from 'react';

/**
 * Minimalist Inverted Difference Circle Cursor (Locomotive / Studio Freight style)
 * - 100% Guaranteed Contrast via CSS mix-blend-mode: difference
 * - Turns pure radiant white on black backgrounds & 3D space
 * - Turns deep dark on white & cream paper backgrounds
 * - Smoothly expands on hover over links, buttons, and specimens
 * - Zero layout reflow: pure GPU-composited translate3d & scale
 * - Auto-sleep on idle (0% CPU impact)
 */
export function CursorEffect() {
  const orbRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices or small screens
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    if (isTouch || isSmall) return;

    document.documentElement.classList.add('has-custom-cursor');

    const orb = orbRef.current;
    const dot = dotRef.current;
    if (!orb || !dot) return;

    const activeOrb = orb;
    const activeDot = dot;

    const html = document.documentElement;

    let mouseX = -100;
    let mouseY = -100;
    let orbX = -100;
    let orbY = -100;

    let targetScale = 1;
    let currentScale = 1;

    let isHovering = false;
    let isMouseDown = false;
    let isRunning = false;
    let hasMoved = false;
    let rafId = 0;

    function startRenderLoop() {
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(render);
      }
    }

    /* ── Mouse Movement ── */
    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        orbX = mouseX;
        orbY = mouseY;
        html.classList.add('csr-visible');
        html.classList.remove('csr-hidden');
      }

      // Center 4px dot centered at -2px with zero lag
      activeDot.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;

      startRenderLoop();
    };

    /* ── Pointer Down / Up (Click Haptics) ── */
    const onPointerDown = () => {
      isMouseDown = true;
      targetScale = isHovering ? 2.0 : 0.7;
      startRenderLoop();
    };

    const onPointerUp = () => {
      isMouseDown = false;
      targetScale = isHovering ? 2.6 : 1;
      startRenderLoop();
    };

    /* ── Hover Detection (Optimized High-Speed Traversal) ── */
    const SELECTOR = 'a, button, input, select, [data-cursor], .cursor-pointer';

    const onMouseOver = (e: MouseEvent) => {
      if (!e.target || typeof (e.target as Element).closest !== 'function') return;
      const target = e.target as Element;

      const interactiveEl = target.closest(SELECTOR);
      if (interactiveEl) {
        isHovering = true;
        targetScale = isMouseDown ? 2.0 : 2.6;
        startRenderLoop();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.target || typeof (e.target as Element).closest !== 'function') return;
      const target = e.target as Element;

      const interactiveEl = target.closest(SELECTOR);
      if (interactiveEl) {
        isHovering = false;
        targetScale = isMouseDown ? 0.7 : 1;
        startRenderLoop();
      }
    };

    /* ── Visibility & Window Handlers ── */
    const onBlur = () => html.classList.add('csr-hidden');
    const onMouseLeaveDoc = () => html.classList.add('csr-hidden');
    const onMouseEnterDoc = () => {
      if (hasMoved) {
        html.classList.remove('csr-hidden');
        html.classList.add('csr-visible');
        startRenderLoop();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('mouseleave', onMouseLeaveDoc);
    document.addEventListener('mouseenter', onMouseEnterDoc);

    /* ── 120 FPS Buttery Lerp Render Loop ── */
    function render() {
      const dx = mouseX - orbX;
      const dy = mouseY - orbY;
      const dist = Math.hypot(dx, dy);
      const dScale = targetScale - currentScale;

      // Idle sleep optimization: 0% CPU consumption when mouse stops
      if (dist < 0.1 && Math.abs(dScale) < 0.005) {
        orbX = mouseX;
        orbY = mouseY;
        currentScale = targetScale;
        activeOrb.style.transform = `translate3d(${orbX - 10}px, ${orbY - 10}px, 0) scale(${currentScale})`;
        isRunning = false;
        return;
      }

      // Smooth inertia damping
      orbX += dx * 0.22;
      orbY += dy * 0.22;
      currentScale += dScale * 0.18;

      // Outer 20px orb (offset -10px to exact center)
      activeOrb.style.transform = `translate3d(${orbX - 10}px, ${orbY - 10}px, 0) scale(${currentScale})`;

      rafId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mouseleave', onMouseLeaveDoc);
      document.removeEventListener('mouseenter', onMouseEnterDoc);
      html.classList.remove('has-custom-cursor', 'csr-visible', 'csr-hidden');
    };
  }, []);

  return (
    <>
      {/* 20px Fluid Inverted Difference Orb */}
      <div
        ref={orbRef}
        id="csr-orb"
        aria-hidden="true"
      />

      {/* 4px Instant Center Focal Dot */}
      <div
        ref={dotRef}
        id="csr-dot"
        aria-hidden="true"
      />
    </>
  );
}
