import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Quest from '@/models/Quest';
import { quests as defaultQuests } from '@/lib/mockData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]);
    }

    const quests = await Quest.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(quests || []);
  } catch (error: any) {
    console.error('Error fetching quests:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conn = await connectToDatabase();

    const newQuestData = {
      id: body.id || `quest_${Date.now()}`,
      title: body.title,
      description: body.description,
      xpReward: Number(body.xpReward) || 100,
      xlmReward: Number(body.xlmReward) || 10,
      difficulty: body.difficulty || 'Beginner',
      category: body.category || 'Smart Contract',
      completedBy: Number(body.completedBy) || 0,
      totalSlots: Number(body.totalSlots) || 50,
      isActive: body.isActive !== false,
    };

    if (conn) {
      const created = await Quest.create(newQuestData);
      return NextResponse.json({ success: true, quest: created });
    }

    return NextResponse.json({ success: true, quest: newQuestData });
  } catch (error: any) {
    console.error('Error creating quest:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
