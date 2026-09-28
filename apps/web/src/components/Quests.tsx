import { QuestCard } from './QuestCard';
import { useUser } from '@/lib/user';

export const Quests = () => {
  const { address } = useUser();

  const quests = [
    // ... existing quests
    {
      id: 'first_tip',
      title: 'First Tip',
      description: 'Tip 0.5+ USDC to a connected wallet',
      xp: 5,
      envId: 'first_tip',
      conditions: [
        { type: 'evidence', evidenceType: 'first_tip', recipient: address }
      ]
    }
  ];

  return (
    <div className='quests-grid'>
      {quests.map(quest => (
        <QuestCard key={quest.id} {...quest} />
      ))}
    </div>
  );
};