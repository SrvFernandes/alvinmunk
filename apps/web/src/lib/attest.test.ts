import { validateEvidence, verifyEvidence } from './attest';
import { mockGetEvents, mockGetVouchEdges, mockIsFrozen } from '@/lib/mocks';

describe('first_tip evidence', () => {
  beforeEach(() => {
    mockGetEvents.mockResolvedValue([]);
    mockGetVouchEdges.mockResolvedValue([]);
    mockIsFrozen.mockResolvedValue(false);
  });

  it('validates shape', async () => {
    const valid = await validateEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(valid.valid).toBe(true);
  });

  it('rejects missing recipient', async () => {
    const invalid = await validateEvidence({ type: 'first_tip' });
    expect(invalid.valid).toBe(false);
    expect(invalid.reason).toBe('Recipient address required');
  });

  it('rejects self-tips', async () => {
    mockGetEvents.mockResolvedValueOnce([{ args: { from: '0x123', to: '0x123' } }]);
    const result = await verifyEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(result).toBe(false);
  });

  it('rejects low amounts', async () => {
    mockGetEvents.mockResolvedValueOnce([{ args: { amount: '100000000' } }]);
    const result = await verifyEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(result).toBe(false);
  });

  it('rejects unconnected wallets', async () => {
    mockGetEvents.mockResolvedValueOnce([{ args: { to: '0x456' } }]);
    mockGetVouchEdges.mockResolvedValueOnce([]);
    const result = await verifyEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(result).toBe(false);
  });

  it('rejects frozen wallets', async () => {
    mockGetEvents.mockResolvedValueOnce([{ args: { to: '0x456' } }]);
    mockGetVouchEdges.mockResolvedValueOnce(['edge']);
    mockIsFrozen.mockResolvedValueOnce(true);
    const result = await verifyEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(result).toBe(false);
  });

  it('accepts valid tip', async () => {
    mockGetEvents.mockResolvedValueOnce([{ args: { to: '0x456', amount: '500000000' } }]);
    mockGetVouchEdges.mockResolvedValueOnce(['edge']);
    const result = await verifyEvidence({ type: 'first_tip', recipient: '0x123' });
    expect(result).toBe(true);
  });
});