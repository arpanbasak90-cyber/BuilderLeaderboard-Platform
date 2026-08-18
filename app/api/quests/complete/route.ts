import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Builder from '@/models/Builder';
import Quest from '@/models/Quest';

export async function POST(request: Request) {
  try {
    const { publicKey, questId, xpReward, xlmReward, questTitle, category } = await request.json();

    if (!publicKey || !questId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const conn = await connectToDatabase();

    if (conn) {
      // 1. Update Quest completion count
      await Quest.findOneAndUpdate(
        { id: questId },
        { $inc: { completedBy: 1 } }
      );

      // 2. Award XP & XLM to Builder profile
      const newBadge = {
        id: `badge_${questId}_${Date.now()}`,
        name: `${questTitle || 'Quest'} Champion`,
        icon: category === 'Smart Contract' ? '🚀' : category === 'DeFi' ? '💎' : '🔥',
        description: `Successfully completed ${questTitle || 'quest'}`,
        earnedAt: new Date().toISOString().split('T')[0],
      };

      const updatedBuilder = await Builder.findOneAndUpdate(
        { $or: [{ id: publicKey }, { stellarAddress: publicKey }] },
        {
          $inc: {
            xp: Number(xpReward) || 0,
            xlmEarned: Number(xlmReward) || 0,
            questsCompleted: 1,
            onChainTxCount: 1,
          },
          $push: { badges: newBadge },
        },
        { upsert: true, new: true }
      );

      // Recalculate level
      if (updatedBuilder) {
        updatedBuilder.level = Math.floor(updatedBuilder.xp / 500) + 1;
        await updatedBuilder.save();
      }

      return NextResponse.json({ success: true, builder: updatedBuilder });
    }

    return NextResponse.json({ success: true, message: 'Completed locally' });
  } catch (error: any) {
    console.error('Error completing quest in DB:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
