// Copyright 2024 Alvinmunk
// ... existing imports ...

export function stroopsToUsdc(stroops: bigint): string {
  const usdc = Number(stroops) / 1e6
  return usdc.toFixed(2)
}

// ... existing implementation ...
