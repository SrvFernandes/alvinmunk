import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { StatStrip } from '../stat-strip';
import { getScores } from '@/lib/scores';
import { REFRESH_MS } from '@/lib/constants';

jest.mock('@/lib/scores', () => ({
  getScores: jest.fn(),
}));

describe('StatStrip Zero State and Polling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not render skeletons on interval refresh after initial load', async () => {
    (getScores as jest.Mock).mockResolvedValue({ hasSignal: false, stat1: 10, stat2: 20, stat3: 30 });

    render(<StatStrip address="0x123" />);

    // Initial load state shows skeletons or resolves
    await waitFor(() => {
      expect(screen.getByText('Stat 1: 10')).toBeInTheDocument();
    });

    // Advance timers by the refresh interval
    act(() => {
      jest.advanceTimersByTime(REFRESH_MS);
    });

    await waitFor(() => {
      expect(screen.getByText('Stat 1: 10')).toBeInTheDocument();
    });

    // Ensure zero-state card is present and did not unmount/remount destructively
    expect(screen.getByText('No signal detected yet.')).toBeInTheDocument();
  });
});
