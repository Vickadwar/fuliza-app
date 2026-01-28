import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { sendFulizaSuccessSMS } from '@/app/actions/sms';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Log for debugging
    console.log("[WEBHOOK] Received:", JSON.stringify(payload));

    // Pesaflux sends "TransactionID" which matches our SOFTPID...
    const redisKey = `pay:${payload.TransactionID}`;
    const redis = await getRedisClient();
    
    // 1. Get existing record
    const cachedData = await redis.get(redisKey);
    
    // If we don't have a record, ignore it
    if (!cachedData) return NextResponse.json({ received: true });

    let localRecord = JSON.parse(cachedData);

    // 2. CHECK FOR CANCELLATION (ResultCode 1032)
    if (payload.ResultCode === 1032 || payload.ResultCode === "1032") {
        console.log(`[WEBHOOK] ${payload.TransactionID} -> CANCELLED`);
        
        localRecord.status = 'CANCELLED';
        localRecord.reason = 'Request cancelled by user';
        
        // Update Redis immediately (Frontend polling will see this)
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
    }
    
    // 3. CHECK FOR SUCCESS (ResultCode 0)
    // This handles cases where user closes browser before polling finishes
    else if (payload.ResultCode === 0 || payload.ResultCode === "0") {
        console.log(`[WEBHOOK] ${payload.TransactionID} -> COMPLETED`);
        
        if (localRecord.status !== 'COMPLETED') {
            localRecord.status = 'COMPLETED';
            localRecord.receipt = payload.TransactionReceipt;
            await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
            
            // Send SMS if not already sent by the frontend poller
            if (!localRecord.smsSent) {
                 await sendFulizaSuccessSMS(
                   localRecord.phone, 
                   Number(localRecord.amount), 
                   payload.TransactionReceipt
                 );
                 localRecord.smsSent = true;
                 await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
            }
        }
    }
    
    // 4. CHECK FOR GENERIC FAILURES
    else {
        localRecord.status = 'FAILED';
        localRecord.reason = payload.ResultDesc || 'Transaction Failed';
        await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK-ERROR]", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}