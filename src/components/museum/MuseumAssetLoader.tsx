'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const KTXContext = createContext<KTX2Loader | null>(null);

export function MuseumAssetLoader({ children }: { children: React.ReactNode }) {
  const gl = useThree((state) => state.gl);

  const ktx2 = useMemo(() => {
    try {
      return new KTX2Loader()
        .setTranscoderPath('/basis/')
        .detectSupport(gl);
    } catch (e) {
      console.warn('KTX2Loader initialization skipped:', e);
      return null;
    }
  }, [gl]);

  return <KTXContext.Provider value={ktx2}>{children}</KTXContext.Provider>;
}

export function useMuseumGLTF(url: string) {
  const ktx2 = useContext(KTXContext);

  const extendLoader = useCallback(
    (loader: any) => {
      if (ktx2) {
        loader.setKTX2Loader(ktx2);
      }
    },
    [ktx2]
  );

  // Pass local draco decoder path and enable meshopt + KTX2
  return useGLTF(url, '/draco/', true, extendLoader);
}
