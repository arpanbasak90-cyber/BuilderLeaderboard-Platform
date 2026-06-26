'use client';

import { Badge } from '@/types';
import { Lock } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
  allBadges?: Badge[];
  showLocked?: boolean;
}

const defaultAllBadges: Badge[] = [
  { id: '1', name: 'First Deploy', icon: '🚀', description: 'Deployed first Soroban contract', earnedAt: '' },
  { id: '2', name: 'Diamond Hands', icon: '💎', description: 'Held XLM for 6+ months', earnedAt: '' },
  { id: '3', name: 'Quest Crusher', icon: '🔥', description: 'Completed 5 quests', earnedAt: '' },
  { id: '4', name: 'Top Builder', icon: '🌟', description: 'Reached top 3 on leaderboard', earnedAt: '' },
  { id: '5', name: 'Speed Coder', icon: '⚡', description: 'Completed a quest in under 1 hour', earnedAt: '' },
  { id: '6', name: 'Collaborator', icon: '🤝', description: 'Contributed to 3 community quests', earnedAt: '' },
];

export default function BadgeDisplay({ badges, allBadges = defaultAllBadges, showLocked = false }: BadgeDisplayProps) {
  const earnedIds = new Set(badges.map(b => b.id));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {allBadges.map((badge) => {
        const isEarned = earnedIds.has(badge.id);
        const earnedBadge = badges.find(b => b.id === badge.id);

        return (
          <div
            key={badge.id}
            className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-200 ${
              isEarned
                ? 'border-[#7c3aed] bg-[#1a1a2e] hover:border-[#9d4edd]'
                : showLocked
                  ? 'border-[#2a2a4a] bg-[#1a1a2e]/50 opacity-50'
                  : 'hidden'
            }`}
          >
            <span className={`text-2xl ${isEarned ? '' : 'grayscale'}`}>
              {isEarned ? badge.icon : <Lock className="h-6 w-6 text-[#94a3b8]" />}
            </span>
            <span className={`mt-1 text-xs font-medium ${isEarned ? 'text-[#f1f5f9]' : 'text-[#94a3b8]'}`}>
              {badge.name}
            </span>

            <div className="pointer-events-none invisible absolute -top-2 left-1/2 z-50 w-48 -translate-x-1/2 -translate-y-full rounded-lg bg-[#0f0f1a] p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <p className="text-xs font-medium text-[#f1f5f9]">{badge.name}</p>
              <p className="mt-1 text-xs text-[#94a3b8]">{badge.description}</p>
              {isEarned && earnedBadge?.earnedAt && (
                <p className="mt-1 text-xs text-[#06b6d4]">Earned: {earnedBadge.earnedAt}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
