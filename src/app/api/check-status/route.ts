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
    
    // 1. Check Redis (Fastest)
    const cachedData = await redis.get(redisKey);
    if (!cachedData) return NextResponse.json({ status: 'FAILED' });

    let localRecord = JSON.parse(cachedData);

    // IF WEBHOOK HAS ALREADY UPDATED REDIS, RETURN THAT STATUS
    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(localRecord.status)) {
        return NextResponse.json({ 
            status: localRecord.status, 
            trackId: localRecord.receipt 
        });
    }

    // 2. If Redis is still PENDING, Ask Pesaflux directly
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
    
    // Success Case
    if (fluxData.TransactionStatus === 'Completed') {
        localRecord.status = 'COMPLETED';
        localRecord.receipt = fluxData.TransactionReceipt;
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        
        // Send SMS
        if (!localRecord.smsSent) {
            await sendFulizaSuccessSMS(
              localRecord.phone, 
              Number(localRecord.amount),
              fluxData.TransactionReceipt
            );
            localRecord.smsSent = true;
            await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
        }
        
        return NextResponse.json({ status: 'COMPLETED', trackId: fluxData.TransactionReceipt });
    } 
    
    // Cancelled Case (Look for Code 1032 or "cancel" text)
    if (fluxData.ResultCode === "1032" || (fluxData.ResultDesc && fluxData.ResultDesc.toLowerCase().includes('cancel'))) {
       localRecord.status = 'CANCELLED';
       await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
       return NextResponse.json({ status: 'CANCELLED' });
    }

    // Failed Case
    if (fluxData.TransactionStatus === 'Failed') {
       localRecord.status = 'FAILED';
       await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
       return NextResponse.json({ status: 'FAILED' });
    }

    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    return NextResponse.json({ status: 'PENDING' }); 
  }
}