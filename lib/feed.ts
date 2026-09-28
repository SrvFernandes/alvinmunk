// Copyright 2024 Alvinmunk
import { fetchReputationEvents, fetchContractEvents } from './events'

// ... existing imports ...

export type FeedItem = (
  | { kind: 'vouch'; from: string; to: string; ledger: number; claimed?: boolean }
  | { kind: 'tip'; from: string; to: string; amount: bigint; ledger: number }
)

// ... existing implementation ...

export async function fetchFeedItems(contractId: string, fromBlock: number): Promise<FeedItem[]> {
  const [vouchItems, tipItems] = await Promise.all([
    fetchReputationEvents(contractId, fromBlock),
    fetchContractEvents(contractId, fromBlock)
  ])

  return [...vouchItems, ...tipItems]
    .sort((a, b) => b.ledger - a.ledger)
    .slice(0, 20)
}
