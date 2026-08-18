import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Feedback from '@/models/Feedback';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]);
    }
    const feedbackList = await Feedback.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(feedbackList);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conn = await connectToDatabase();

    const item = {
      id: body.id || `fb_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      address: body.address,
      rating: Number(body.rating) || 5,
      comment: body.comment || '',
      timestamp: body.timestamp || new Date().toISOString(),
    };

    if (conn) {
      const created = await Feedback.create(item);
      return NextResponse.json({ success: true, feedback: created });
    }

    return NextResponse.json({ success: true, feedback: item });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
