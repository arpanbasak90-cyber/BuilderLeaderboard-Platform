import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Builder from '@/models/Builder';
import Quest from '@/models/Quest';
import { builders, quests } from '@/lib/mockData';

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection unavailable' }, { status: 500 });
    }

    await Builder.deleteMany({});
    await Quest.deleteMany({});

    await Builder.insertMany(builders);
    await Quest.insertMany(quests);

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${builders.length} builders and ${quests.length} quests.`,
    });
  } catch (error: any) {
    console.error('Database seeding failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
