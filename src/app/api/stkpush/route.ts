import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

// Helper to sanitize phone numbers to 254 format
function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '254' + clean.substring(1);
  } else if (clean.startsWith('7') || clean.startsWith('1')) {
    clean = '254' + clean;
  }
  return clean;
}

export async function POST(req: Request) {
  try {
    // 1. Validation
    if (!process.env.PESAFLUX_API_KEY || !process.env.PESAFLUX_URL) {
      console.error("Missing ENV variables");
      return NextResponse.json({ success: false, error: "Server Configuration Error" }, { status: 500 });
    }

    const { phoneNumber, amount, idNumber, serviceType } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" });
    }

    // 2. Prepare Data
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const cleanAmount = String(Math.ceil(Number(amount)));
    const uniqueRef = `${serviceType === 'FULIZA_BOOST' ? 'FZ' : 'LN'}_${idNumber}_${Date.now().toString().slice(-4)}`;

    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      amount: cleanAmount,
      msisdn: formattedPhone,
      reference: uniqueRef
    };

    console.log(`[STK-INIT] Sending ${cleanAmount} to ${formattedPhone}`);

    // 3. Call PesaFlux
    const response = await fetch(`${process.env.PESAFLUX_URL}/initiatestk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();

    // 4. Handle Response
    if (data.transaction_request_id) {
      const checkoutRequestID = data.transaction_request_id;
      const redis = await getRedisClient();
      
      // Save state to Redis (JSON.stringify is CRITICAL here)
      await redis.set(`pay:${checkoutRequestID}`, JSON.stringify({
        status: 'PENDING',
        phone: formattedPhone,
        originalPhone: phoneNumber,
        amount: cleanAmount,
        originalAmount: cleanAmount,
        ref: uniqueRef,
        serviceType: serviceType || 'UNKNOWN',
        idNumber: idNumber || '',
        createdAt: Date.now(),
        retryCount: 0,
        pollingAttempts: 0,
        userFriendlyPhone: phoneNumber
      }), { EX: 3600 }); // 1 Hour TTL

      return NextResponse.json({ 
        success: true, 
        checkoutRequestID,
        amount: cleanAmount,
        phone: phoneNumber
      });
    } 
    
    console.error("[STK-FAIL] PesaFlux response:", data);
    return NextResponse.json({ 
      success: false, 
      error: data.message || "Payment service unavailable" 
    });

  } catch (error: any) {
    console.error('[STK-ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: "Connection Error" 
    }, { status: 500 });
  }
}