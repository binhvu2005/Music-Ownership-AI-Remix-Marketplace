import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { songId, priceInCents, userId } = await request.json();
    // Tạo stripe session và lưu vào database
    return NextResponse.json({
      sessionId: 'stripe-session-id-mock',
      checkoutUrl: `https://checkout.stripe.com/pay/mock_session`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Payment processing error' }, { status: 500 });
  }
}
