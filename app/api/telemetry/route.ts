import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Interaction from '@/models/Interaction';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]);
    }
    const interactions = await Interaction.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(interactions);
  } catch (error: any) {
    console.error('Error fetching telemetry interactions:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const conn = await connectToDatabase();

    const item = {
      id: body.id || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      address: body.address,
      action: body.action,
      txHash: body.txHash,
      details: body.details,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    if (conn) {
      const created = await Interaction.create(item);
      return NextResponse.json({ success: true, interaction: created });
    }

    return NextResponse.json({ success: true, interaction: item });
  } catch (error: any) {
    console.error('Error saving interaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
