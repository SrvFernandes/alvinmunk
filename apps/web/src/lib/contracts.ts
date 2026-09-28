export async function getTippedEvents(recipient: string) {
  return getEvents(rewardsABI, 'tipped', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: { from: recipient, amount: { gt: '500000000' } }
  });
}