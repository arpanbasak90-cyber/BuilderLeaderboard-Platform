import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Builder from '@/models/Builder';
import { builders as defaultBuilders } from '@/lib/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]);
    }

    const builders = await Builder.find().sort({ xp: -1 }).lean();

    const formatted = (builders || []).map((b: any, index: number) => ({
      ...b,
      id: b.id || b.stellarAddress,
      rank: index + 1,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Error fetching builders:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, builder: body, note: 'Saved locally' });
    }

    const { id, stellarAddress, name, avatar, xp, level, badges, questsCompleted, xlmEarned, onChainTxCount } = body;
    const targetAddress = stellarAddress || id;

    if (!targetAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const updatedBuilder = await Builder.findOneAndUpdate(
      { $or: [{ id: targetAddress }, { stellarAddress: targetAddress }] },
      {
        $set: {
          id: targetAddress,
          stellarAddress: targetAddress,
          name: name || `Builder_${targetAddress.slice(0, 4)}...${targetAddress.slice(-4)}`,
          avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetAddress}`,
          xp: xp || 0,
          level: level || Math.floor((xp || 0) / 500) + 1,
          badges: badges || [],
          questsCompleted: questsCompleted || 0,
          xlmEarned: xlmEarned || 0,
          onChainTxCount: onChainTxCount || 1,
          joinedAt: new Date().toISOString().split('T')[0],
          weeklyXPGain: 100,
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, builder: updatedBuilder });
  } catch (error: any) {
    console.error('Error updating builder:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
