'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useLoginStore } from '@/stores/useLoginStore';

/* ═══════════════════════════════════════════════════════
   INK EFFECT WITH FLOATING/DISTINCT LABELS & SHOW/HIDE PASSWORD TOGGLE
   - Visual floating/top labels matching brutalist MUSEO theme
   - Password Show/Hide eye icon toggle button embedded inside input
   - Keystroke audio feedback & particle bursts
   ═══════════════════════════════════════════════════════ */

interface InkEffectProps {
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  autoFocus?: boolean;
}

export default function InkEffect({
  type,
  value,
  onChange,
  placeholder,
  label,
  autoFocus,
}: InkEffectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useLoginStore((s) => s.reducedMotion);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="ticket-field relative">
      <div className="flex items-center justify-between mb-1">
        <label className="ticket-label mb-0 flex items-center gap-1.5">
          <span>{label}</span>
          {(isFocused || value) && (
            <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full inline-block" />
          )}
        </label>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type={effectiveType}
          className={`ticket-input ${isPasswordField ? 'pr-12' : ''}`}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
        />

        {/* Password Show/Hide Eye Toggle */}
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-black transition-colors focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide Password' : 'Show Password'}
            aria-label={showPassword ? 'Hide Password' : 'Show Password'}
          >
            {showPassword ? (
              // Eye Open Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              // Eye Off / Slash Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
