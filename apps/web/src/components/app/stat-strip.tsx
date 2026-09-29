import React, { useEffect, useState, useCallback } from 'react';
import { getScores } from '@/lib/scores';
import { REFRESH_MS } from '@/lib/constants';

interface StatStripProps {
  address: string;
}

export const StatStrip: React.FC<StatStripProps> = ({ address }) => {
  const [scores, setScores] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }
    try {
      const data = await getScores(address);
      setScores(data);
    } catch (err) {
      console.error('Failed to load scores:', err);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [address]);

  useEffect(() => {
    load(true);
  }, [load]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let intervalId: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (document.visibilityState === 'visible') {
            load(false);
          }
        }, REFRESH_MS);
      }
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopInterval();
      } else {
        load(false);
        startInterval();
      }
    };

    if (document.visibilityState === 'visible') {
      startInterval();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [load]);

  const hasAnySignal = scores && scores.hasSignal;
  const isInitialLoading = loading && scores === null;

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="animate-pulse h-24 bg-muted rounded-lg" />
        <div className="animate-pulse h-24 bg-muted rounded-lg" />
        <div className="animate-pulse h-24 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>Stat 1: {scores?.stat1 ?? '--'}</div>
        <div>Stat 2: {scores?.stat2 ?? '--'}</div>
        <div>Stat 3: {scores?.stat3 ?? '--'}</div>
      </div>
      {!loading && !hasAnySignal && (
        <div className="mt-4 p-4 border rounded-lg bg-card">
          <p>No signal detected yet.</p>
        </div>
      )}
    </div>
  );
};
