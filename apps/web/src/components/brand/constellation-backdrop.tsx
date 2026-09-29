"use client";

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ConstellationCanvas } from './constellation-canvas';
import { hasWebGL } from '@/utils/webgl';
import { SceneErrorBoundary } from './scene-error-boundary';

export function ConstellationBackdrop() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(hasWebGL());
  }, []);

  if (supported === false) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <SceneErrorBoundary fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
          dpr={[1, 1.5]}
        >
          <ConstellationCanvas />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
