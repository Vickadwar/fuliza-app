import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

// Helper to sanitize phone numbers to 254 format
function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, plus signs
  let clean = phone.replace(/\D/g, '');
  
  // If starts with 0 (e.g., 0712...), replace 0 with 254
  if (clean.startsWith('0')) {
    clean = '254' + clean.substring(1);
  }
  // If starts with 7 (e.g., 712...), prepend 254
  else if (clean.startsWith('7') || clean.startsWith('1')) {
    clean = '254' + clean;
  }
  
  return clean; // Returns 254712345678
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
    const cleanAmount = String(Math.ceil(Number(amount))); // No decimals allowed in STK
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
      signal: AbortSignal.timeout(15000) // 15s Timeout to prevent hanging
    });

    const data = await response.json();

    // 4. Handle Response
    // PesaFlux returns 'transaction_request_id' on success
    if (data.transaction_request_id) {
      const checkoutRequestID = data.transaction_request_id;
      
      const redis = await getRedisClient();
      
      // Save state to Redis with enhanced tracking for recovery
      await redis.set(`pay:${checkoutRequestID}`, JSON.stringify({
        status: 'PENDING',
        phone: formattedPhone,
        originalPhone: phoneNumber, // Store original format for display
        amount: cleanAmount,
        originalAmount: cleanAmount, // Store for retry comparison
        ref: uniqueRef,
        serviceType: serviceType || 'UNKNOWN',
        idNumber: idNumber || '',
        createdAt: Date.now(),
        // New fields for recovery system:
        retryCount: 0, // Track how many times user tried to retry
        lastRetryAt: null, // Timestamp of last retry attempt
        pollingAttempts: 0, // How many times frontend has polled
        // User details for reference
        userFriendlyPhone: phoneNumber // For display purposes
      }), { EX: 3600 }); // Keep for 1 hour (increased from 1200s/20mins)

      return NextResponse.json({ 
        success: true, 
        checkoutRequestID,
        amount: cleanAmount,
        phone: phoneNumber // Return original phone for frontend display
      });
    } 
    
    // Handle specific API errors
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