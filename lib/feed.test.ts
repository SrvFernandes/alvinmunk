// Copyright 2024 Alvinmunk
import { FeedItem } from './feed'

// ... existing tests ...

test('merges and orders vouch and tip events', () => {
  const vouchItems: FeedItem[] = [
    { kind: 'vouch', from: 'a', to: 'b', ledger: 100 }
  ]

  const tipItems: FeedItem[] = [
    { kind: 'tip', from: 'c', to: 'd', amount: 1000000n, ledger: 101 }
  ]

  const merged = [...vouchItems, ...tipItems].sort((a, b) => b.ledger - a.ledger)

  expect(merged[0].kind).toBe('tip')
  expect(merged[0].from).toBe('c')
  expect(merged[1].kind).toBe('vouch')
})
