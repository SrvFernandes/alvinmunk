"use client";

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ConstellationAppCanvas } from './constellation-app-canvas';
import { hasWebGL } from '@/utils/webgl';
import { SceneErrorBoundary } from './scene-error-boundary';
import { Crest } from '@/components/crest';

interface Constellation3DProps {
  vouchers?: Array<{ id: string; name: string }>;
}

export function Constellation3D({ vouchers = [] }: Constellation3DProps) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(hasWebGL());
  }, []);

  const fallbackView = (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-xl border border-border">
      <Crest className="w-16 h-16 mb-4 text-primary" />
      <h2 className="text-xl font-bold mb-2">Dashboard Hero</h2>
      {vouchers.length > 0 ? (
        <ul className="w-full space-y-2 mt-4">
          {vouchers.map((v) => (
            <li key={v.id} className="p-3 bg-muted rounded-md text-sm">
              {v.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">No active vouchers found.</p>
      )}
    </div>
  );

  if (supported === false) {
    return fallbackView;
  }

  return (
    <SceneErrorBoundary fallback={fallbackView}>
      <div className="w-full h-[400px] relative">
        <Canvas
          camera={{ position: [0, 0, 5] }}
          gl={{ alpha: true, antialias: true }}
        >
          <ConstellationAppCanvas />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
}
