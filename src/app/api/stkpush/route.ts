import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { formatPhoneForPesaflux } from '@/lib/pesaflux';

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, idNumber } = await req.json();

    if (!phoneNumber || !amount || !idNumber) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let formattedPhone;
    try {
      formattedPhone = formatPhoneForPesaflux(phoneNumber);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid Safaricom Number" }, { status: 400 });
    }

    // Unique reference
    const reference = `FZ_${idNumber}_${Date.now().toString().slice(-4)}`;
    
    // Get your live domain for the callback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      amount: String(amount),
      msisdn: formattedPhone,
      reference: reference,
      // Tell Pesaflux to hit our new webhook file
      callback_url: `${baseUrl}/api/webhooks/pesaflux`
    };

    console.log(`[STK-INIT] Sending to PesaFlux: ${formattedPhone} | KES ${amount}`);

    const response = await fetch('https://api.pesaflux.co.ke/v1/initiatestk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();

    if (data.success === "200" || data.transaction_request_id) {
      const trackingId = data.transaction_request_id;
      
      const redis = await getRedisClient();
      
      // Store initial state
      await redis.set(`pay:${trackingId}`, JSON.stringify({
        status: 'PENDING',
        phone: formattedPhone,
        amount: amount,
        reference: reference,
        smsSent: false, // Track if SMS sent to avoid duplicates
        createdAt: Date.now()
      }), { EX: 3600 });

      return NextResponse.json({ success: true, checkoutRequestID: trackingId });
    } 
    
    return NextResponse.json({ 
      success: false, 
      error: data.message || "Payment Gateway Error" 
    });

  } catch (error: any) {
    console.error('[STK-ERROR]', error);
    return NextResponse.json({ success: false, error: "Connection Error" }, { status: 500 });
  }
}