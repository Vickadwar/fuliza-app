import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

// Helper to sanitize phone
function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) clean = '254' + clean.substring(1);
  else if (clean.startsWith('7') || clean.startsWith('1')) clean = '254' + clean;
  return clean;
}

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, idNumber, serviceType } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    // Ensure amount is an integer string
    const cleanAmount = String(Math.ceil(Number(amount))); 
    // Create a unique reference
    const uniqueRef = `${serviceType === 'FULIZA_BOOST' ? 'FZ' : 'LN'}_${idNumber || 'NA'}_${Date.now().toString().slice(-4)}`;

    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      amount: cleanAmount,
      msisdn: formattedPhone,
      reference: uniqueRef
    };

    console.log(`[STK-INIT] Payload:`, JSON.stringify(payload));

    const response = await fetch(`${process.env.PESAFLUX_URL}/initiatestk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();
    console.log(`[STK-RES] PesaFlux Response:`, data);

    if (data.success === true || data.transaction_request_id) {
      const checkoutRequestID = data.transaction_request_id;
      const redis = await getRedisClient();
      
      // Save PENDING state to Redis
      await redis.set(`pay:${checkoutRequestID}`, JSON.stringify({
        status: 'PENDING',
        phone: phoneNumber,
        amount: cleanAmount,
        serviceType: serviceType,
        trackId: null, // Will be filled by webhook
        createdAt: Date.now()
      }), { EX: 3600 });

      return NextResponse.json({ success: true, checkoutRequestID });
    } 
    
    return NextResponse.json({ success: false, error: data.message || "Gateway Error" });

  } catch (error: any) {
    console.error('[STK-ERROR]', error);
    return NextResponse.json({ success: false, error: "Connection Error" }, { status: 500 });
  }
}