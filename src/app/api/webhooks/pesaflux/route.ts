import { NextResponse } from 'next/server';
import { sendFulizaSuccessSMS } from '@/app/actions/sms'; // <--- UPDATED IMPORT
import { getRedisClient } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("[WEBHOOK] Received:", JSON.stringify(payload));

    // Pesaflux Success Check
    // They send "ResponseCode": 0 for success via webhook callback
    if (payload.ResponseCode === 0 || payload.ResultCode === "0") {
      const redis = await getRedisClient();
      // Pesaflux sends "TransactionID" (SOFTPID...) in the webhook which matches our tracking ID
      const redisKey = `pay:${payload.TransactionID}`;
      
      const cachedData = await redis.get(redisKey);
      
      if (cachedData) {
        let localRecord = JSON.parse(cachedData);
        
        // Only process if not already completed
        if (localRecord.status !== 'COMPLETED') {
           localRecord.status = 'COMPLETED';
           localRecord.receipt = payload.TransactionReceipt;
           
           await redis.set(redisKey, JSON.stringify(localRecord), { EX: 3600 });
           
           // Send SMS if not already sent
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
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK-ERROR]", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}