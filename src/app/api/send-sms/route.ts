import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, message, sender_id = 'fluxsms' } = await request.json();

    // Basic validation
    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    if (message.length > 160) {
      return NextResponse.json(
        { error: 'Message exceeds 160 characters' },
        { status: 400 }
      );
    }

    const payload = {
      api_key: process.env.FLUXSMS_API_KEY,
      phone: phone.trim(),
      message: message.trim(),
      sender_id: sender_id.trim(),
    };

    const response = await fetch('https://api.fluxsms.co.ke/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Forward the error from FluxSMS if possible
      return NextResponse.json(
        { error: data['response-description'] || 'SMS API error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('SMS send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}