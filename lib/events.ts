// Copyright 2024 Alvinmunk
import { decodeEventLog, getContractEvents } from '@alvinmunk/contracts'
import { FeedItem } from './feed'

// ... existing imports ...

export async function fetchReputationEvents(contractId: string, fromBlock: number): Promise<FeedItem[]> {
  // ... existing implementation ...
}

export async function fetchContractEvents(contractId: string, fromBlock: number): Promise<FeedItem[]> {
  const events = await getContractEvents(contractId, fromBlock)
  return events.map((log) => {
    const decoded = decodeEventLog(log)
    if (decoded.event === 'Tipped') {
      return {
        kind: 'tip' as const,
        from: decoded.args.from,
        to: decoded.args.to,
        amount: decoded.args.amount,
        ledger: log.blockNumber
      }
    }
    return null
  }).filter(Boolean) as FeedItem[]
}
