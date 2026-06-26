'use client';

import Link from 'next/link';
import { Builder } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BuilderCardProps {
  builder: Builder;
  rank: number;
  isPodium?: boolean;
}

export default function BuilderCard({ builder, rank, isPodium = false }: BuilderCardProps) {
  const borderColors = {
    1: 'border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    2: 'border-[#9ca3af] shadow-[0_0_15px_rgba(156,163,175,0.3)]',
    3: 'border-[#b45309] shadow-[0_0_12px_rgba(180,83,9,0.3)]',
  };

  const rankBgColors = {
    1: 'bg-[#f59e0b]',
    2: 'bg-[#9ca3af]',
    3: 'bg-[#b45309]',
  };

  const heightClass = isPodium ? (rank === 1 ? 'h-64' : 'h-52') : '';

  if (!isPodium) return null;

  return (
    <Link href={`/profile/${builder.id}`}>
      <div
        className={`relative flex flex-col items-center justify-between rounded-xl border bg-[#1a1a2e] p-4 transition-all duration-200 hover:scale-105 ${
          borderColors[rank as keyof typeof borderColors] || 'border-[#2a2a4a]'
        } ${heightClass}`}
      >
        <div
          className={`absolute -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
            rankBgColors[rank as keyof typeof rankBgColors]
          }`}
        >
          {rank}
        </div>

        <div className="mt-2 flex flex-col items-center">
          <Avatar className="h-16 w-16 border-2 border-[#2a2a4a]">
            <AvatarImage src={builder.avatar} alt={builder.name} />
            <AvatarFallback>{builder.name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="mt-2 text-center text-sm font-semibold text-[#f1f5f9]">{builder.name}</h3>
          <p className="text-xs text-[#06b6d4]">Level {builder.level}</p>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">XP</span>
            <span className="font-medium text-[#f1f5f9]">{builder.xp.toLocaleString()}</span>
          </div>

          {builder.badges.length > 0 && (
            <div className="flex justify-center text-lg">
              {builder.badges[0].icon}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
