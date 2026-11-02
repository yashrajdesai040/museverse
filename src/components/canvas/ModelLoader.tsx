'use client';

import React, { useEffect, useState } from 'react';
import { Html, useProgress } from '@react-three/drei';

export type LoaderTheme = 'paper' | 'dark' | 'gold' | 'transparent';

export interface SpeederProps {
  color?: string;
  className?: string;
}

/**
 * Pure Speeder Animation from Uiverse.io by anand_4957
 */
export function SpeederAnimation({ color, className = '' }: SpeederProps) {
  const style = color ? ({ '--speeder-color': color } as React.CSSProperties) : undefined;

  return (
    <div className={`relative w-full h-full min-h-[140px] overflow-hidden ${className}`} style={style}>
      <div className="loader">
        <span>
          <span />
          <span />
          <span />
          <span />
        </span>
        <div className="base">
          <span />
          <div className="face" />
        </div>
      </div>
      <div className="longfazers">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export interface ModelLoaderProps {
  label?: string;
  progress?: number;
  theme?: LoaderTheme;
  color?: string;
  className?: string;
}

/**
 * Standalone 3D Model Loader Component
 * Renders the Speeder animation with neo-brutalist status metadata
 */
export function ModelLoader({
  label = 'TRANSMITTING 3D ASSET...',
  progress,
  theme = 'dark',
  color,
  className = '',
}: ModelLoaderProps) {
  const resolvedColor =
    color ||
    (theme === 'dark' || theme === 'gold' ? '#ffd400' : '#000000');

  const themeClasses =
    theme === 'paper'
      ? 'bg-[#F2EDE4] text-[#0E0E0E] border-2 border-[#0E0E0E]'
      : theme === 'dark'
      ? 'bg-[#0a0a0a]/95 text-[#ffd400]'
      : theme === 'gold'
      ? 'bg-black/90 text-[#ffd400] border-2 border-[#ffd400]/40'
      : 'bg-transparent text-white';

  return (
    <div
      className={`relative w-full h-full min-h-[220px] flex flex-col items-center justify-center overflow-hidden p-6 select-none ${themeClasses} ${className}`}
      style={{ '--speeder-color': resolvedColor } as React.CSSProperties}
    >
      <div className="w-full max-w-[280px] h-[130px] relative">
        <SpeederAnimation color={resolvedColor} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1.5 mt-2 font-mono">
        <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-center">
          {label}
        </span>
        {progress !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-white/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-current transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-[10px] font-bold opacity-80">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * In-Canvas 3D Model Loader
 * Placed inside React Three Fiber <Canvas> as <Suspense fallback={<CanvasModelLoader />}>
 */
export function CanvasModelLoader({
  label = 'COMPILING 3D MESH...',
  theme = 'dark',
  color,
}: {
  label?: string;
  theme?: LoaderTheme;
  color?: string;
}) {
  const { progress } = useProgress();

  return (
    <Html center prepend className="pointer-events-none select-none z-30">
      <div className="w-[320px] h-[200px] flex items-center justify-center">
        <ModelLoader
          label={label}
          progress={progress}
          theme={theme}
          color={color}
          className="rounded-none shadow-[4px_4px_0px_#000]"
        />
      </div>
    </Html>
  );
}

export interface ModelLoaderOverlayProps {
  label?: string;
  theme?: LoaderTheme;
  color?: string;
  active?: boolean;
  minDurationMs?: number;
}

/**
 * ModelLoaderOverlay Component
 * Sits as an overlay above the 3D Canvas element and automatically tracks
 * Three.js asset loading via Drei's useProgress() hook.
 */
export function ModelLoaderOverlay({
  label = 'TRANSMITTING SPECIMEN...',
  theme = 'dark',
  color,
  active: forcedActive,
  minDurationMs = 400,
}: ModelLoaderOverlayProps) {
  const { active: progressActive, progress, item } = useProgress();
  const isLoading = forcedActive !== undefined ? forcedActive : progressActive;

  const [visible, setVisible] = useState(isLoading);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setVisible(true);
      setFading(false);
    } else {
      // Keep visible for at least minDurationMs to avoid flickers
      timer = setTimeout(() => {
        setFading(true);
        const hideTimer = setTimeout(() => {
          setVisible(false);
          setFading(false);
        }, 500); // matches fade duration
        return () => clearTimeout(hideTimer);
      }, minDurationMs);
    }

    return () => clearTimeout(timer);
  }, [isLoading, minDurationMs]);

  if (!visible) return null;

  // Extract friendly asset filename if available
  let assetName = '';
  if (item) {
    try {
      const parts = item.split('/');
      assetName = parts[parts.length - 1] || '';
    } catch {
      assetName = '';
    }
  }

  const dynamicLabel = assetName
    ? `${label} [${assetName.toUpperCase()}]`
    : label;

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <ModelLoader
        label={dynamicLabel}
        progress={progress}
        theme={theme}
        color={color}
        className="w-full h-full"
      />
    </div>
  );
}
