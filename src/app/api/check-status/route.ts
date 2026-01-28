import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { sendFulizaSuccessSMS } from '@/app/actions/sms';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    const redisKey = `pay:${id}`;
    
    // 1. Get Local State
    const cachedData = await redis.get(redisKey);
    if (!cachedData) return NextResponse.json({ status: 'FAILED' });

    let localRecord = JSON.parse(cachedData);

    // If already completed locally, return
    if (localRecord.status === 'COMPLETED') {
        return NextResponse.json({ status: 'COMPLETED', trackId: localRecord.receipt || 'CONFIRMED' });
    }

    // 2. Active Check to Pesaflux
    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      transaction_request_id: id
    };

    const fluxRes = await fetch('https://api.pesaflux.co.ke/v1/transactionstatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const fluxData = await fluxRes.json();
    
    // 3. Handle Success
    if (fluxData.TransactionStatus === 'Completed') {
        localRecord.status = 'COMPLETED';
        localRecord.receipt = fluxData.TransactionReceipt;
        
        // Save status to Redis (extend expiry)
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        
        // 4. Send SMS (Once only)
        if (!localRecord.smsSent) {
            await sendFulizaSuccessSMS(
              localRecord.phone, 
              Number(localRecord.amount), // The Fee (e.g. 220)
              fluxData.TransactionReceipt
            );
            
            // Mark sent to avoid duplicates
            localRecord.smsSent = true;
            await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        }
        
        return NextResponse.json({ status: 'COMPLETED', trackId: fluxData.TransactionReceipt });
    } 
    
    // 4. Handle Cancelled/Failed
    if (fluxData.ResultCode === "1032") {
       localRecord.status = 'CANCELLED';
       await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
       return NextResponse.json({ status: 'CANCELLED' });
    }
    
    if (fluxData.TransactionStatus === 'Failed') {
       localRecord.status = 'FAILED';
       await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
       return NextResponse.json({ status: 'FAILED' });
    }

    // Still Pending
    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ status: 'PENDING' }); 
  }
}