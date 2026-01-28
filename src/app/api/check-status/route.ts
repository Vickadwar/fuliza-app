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

    // If already final state, return immediately
    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(localRecord.status)) {
        return NextResponse.json({ 
            status: localRecord.status, 
            trackId: localRecord.receipt 
        });
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
    
    // --- SCENARIO 1: SUCCESS ---
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
    
    // --- SCENARIO 2: FAILED OR CANCELLED ---
    // Pesaflux may return TransactionStatus: "Failed" 
    // OR ResultCode: "1032" (Cancelled)
    // OR ResultCode: "1" (Insufficient Funds)
    
    const isFailed = fluxData.TransactionStatus === 'Failed' || 
                     fluxData.ResultCode !== "0" && fluxData.ResultCode !== "200";

    if (isFailed) {
       // Check if it was specifically cancelled (ResultCode 1032 or "cancel" in desc)
       const isCancelled = fluxData.ResultCode === "1032" || 
                           (fluxData.ResultDesc && fluxData.ResultDesc.toLowerCase().includes('cancel'));
       
       const newStatus = isCancelled ? 'CANCELLED' : 'FAILED';
       
       localRecord.status = newStatus;
       localRecord.reason = fluxData.ResultDesc || 'Transaction Failed';
       
       await redis.set(redisKey, JSON.stringify(localRecord), { EX: 600 });
       
       return NextResponse.json({ status: newStatus, reason: localRecord.reason });
    }

    // --- SCENARIO 3: STILL PENDING ---
    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    console.error("Status Check Error:", error);
    return NextResponse.json({ status: 'PENDING' }); 
  }
}