import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Gửi job đến queue/BullMQ hoặc FastAPI service ở đây
    return NextResponse.json({
      success: true,
      jobId: 'job-remix-uuid',
      status: 'queued',
      message: 'AI Remix request received.',
      splitRules: {
        originalCreator: 0.70,
        remixer: 0.20,
        platform: 0.10,
      },
    }, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
