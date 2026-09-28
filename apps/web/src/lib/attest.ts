import { getEvents } from '@/lib/contracts';
import { rewardsABI } from '@/lib/abi/rewards';
import { getVouchEdges } from '@/lib/vouches';
import { isFrozen } from '@/lib/rewards';

export const evidenceTypes = ['github_pr', 'referral_tx', 'invite_converts', 'vouch_back', 'first_tip'] as const;

export type EvidenceType = typeof evidenceTypes[number];

export interface Evidence {
  type: EvidenceType;
  ref?: string;
  recipient: string;
  amount?: string;
}

export async function validateEvidence(evidence: Evidence): Promise<{ valid: boolean; reason?: string }> {
  switch (evidence.type) {
    case 'first_tip':
      if (!evidence.recipient) return { valid: false, reason: 'Recipient address required' };
      return { valid: true };
    // ... existing cases
  }
}

export async function verifyEvidence(evidence: Evidence): Promise<boolean> {
  if (evidence.type === 'first_tip') {
    const { recipient } = evidence;
    const events = await getEvents(rewardsABI, 'tipped', {
      fromBlock: 0,
      toBlock: 'latest',
      filter: { from: recipient, amount: { gt: '500000000' } } // 0.5 USDC floor
    });

    if (events.length === 0) return false;

    const tipEvent = events[0];
    const toAddress = tipEvent.args.to;
    const sharedEdge = await getVouchEdges(recipient, toAddress);
    const isFrozen = await isFrozen(toAddress);

    return sharedEdge.length > 0 && !isFrozen;
  }
  // ... existing cases
}