// Copyright 2024 Alvinmunk
// ... existing imports ...

export function ActivityFeed({ items, focusMode }: { items: FeedItem[]; focusMode: boolean }) {
  if (focusMode) {
    return <div>Focus mode active</div>
  }

  if (items.length === 0) return <div>No activity</div>

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        item.kind === 'tip' && focusMode ? null : (
          <div key={`${item.ledger}-${index}`} className="p-3 border rounded">
            {item.kind === 'vouch' ? (
              <span>@<span className="font-bold">{item.from}</span> vouched @<span className="font-bold">{item.to}</span></span>
            ) : (
              <span>@<span className="font-bold">{item.from}</span> tipped @<span className="font-bold">{item.to}</span> {stroopsToUsdc(item.amount)} USDC</span>
            )}
          </div>
        )
      ))}
    </div>
  )
}
