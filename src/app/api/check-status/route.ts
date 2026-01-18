import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { generateTrackingId } from '@/lib/loan-engine';
import { sendSuccessSMS } from '@/app/actions/sms';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // This 'id' comes from the frontend, which got it from the STK Push response
  const id = searchParams.get('id'); 

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    const redisKey = `pay:${id}`;
    
    // 1. Get current local state
    const cachedData = await redis.get(redisKey);
    
    // If Redis is empty, the transaction is lost or expired
    if (!cachedData) {
        return NextResponse.json({ status: 'FAILED', reason: 'Session expired' });
    }

    let localRecord = JSON.parse(cachedData);

    // 2. IF LOCAL STATUS IS ALREADY DONE, RETURN IT
    if (localRecord.status === 'COMPLETED') {
      return NextResponse.json({ 
        status: 'COMPLETED',
        mpesaCode: localRecord.mpesaCode,
        trackId: localRecord.trackId
      });
    }

    if (localRecord.status === 'FAILED') {
      return NextResponse.json({ 
        status: 'FAILED',
        reason: localRecord.reason || 'Payment failed'
      });
    }

    // 3. --- THE FIX: ACTIVE PESAFLUX CHECK ---
    // We ask PesaFlux directly: "What is the status of this ID?"
    
    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      transaction_request_id: id // This MUST be the SOFTPID...
    };

    const fluxRes = await fetch('https://api.pesaflux.co.ke/v1/transactionstatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const fluxData = await fluxRes.json();
    console.log(`[ACTIVE-CHECK] ID: ${id} | Response:`, JSON.stringify(fluxData));

    // 4. HANDLE PESAFLUX RESPONSE
    // PesaFlux returns "TransactionStatus": "Completed" or "Failed"
    
    if (fluxData.TransactionStatus === 'Completed') {
        // --- PAYMENT SUCCESS ---
        const trackId = localRecord.trackId || generateTrackingId();
        const mpesaCode = fluxData.TransactionReceipt || fluxData.mpesa_receipt_number;

        localRecord = {
            ...localRecord,
            status: 'COMPLETED',
            mpesaCode: mpesaCode,
            trackId: trackId
        };
        
        // Save to Redis
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        
        // Send SMS if not already sent
        if (!localRecord.smsSent) {
             await sendSuccessSMS(localRecord.phone, localRecord.amount, trackId, localRecord.serviceType);
             localRecord.smsSent = true;
             await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        }

        return NextResponse.json({ 
            status: 'COMPLETED',
            mpesaCode: mpesaCode,
            trackId: trackId
        });

    } else if (fluxData.TransactionStatus === 'Failed' || fluxData.ResultCode === "1032" || (fluxData.TransactionCode && fluxData.TransactionCode !== "0")) {
        // --- PAYMENT FAILED / CANCELLED ---
        // 1032 = Cancelled by user
        
        localRecord = {
            ...localRecord,
            status: 'FAILED',
            reason: fluxData.ResultDesc || 'Request Cancelled'
        };
        
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });

        return NextResponse.json({ 
            status: 'FAILED',
            reason: 'Request Cancelled'
        });
    }

    // 5. IF PESAFLUX SAYS "PENDING" OR NO STATUS YET
    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    console.error("[STATUS-CHECK-ERROR]", error);
    // Keep waiting on error, don't fail immediately
    return NextResponse.json({ status: 'PENDING' }); 
  }
}