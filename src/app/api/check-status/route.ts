import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action') || 'poll'; // 'poll' or 'fetch'

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    
    // 1. Check Redis Cache
    const cachedData = await redis.get(`pay:${id}`);
    
    // If not in Redis, transaction expired or never existed
    if (!cachedData) {
        return NextResponse.json({ 
          status: 'FAILED', 
          reason: 'Transaction expired or not found',
          recoveryAction: 'select_new' // Tell frontend to go to offers
        });
    }

    const localRecord = JSON.parse(cachedData);
    
    // Update polling attempts if this is a regular poll
    if (action === 'poll') {
      localRecord.pollingAttempts = (localRecord.pollingAttempts || 0) + 1;
      await redis.set(`pay:${id}`, JSON.stringify(localRecord), { EX: 3600 });
    }

    // If we already know the final status, don't ask API again
    if (localRecord.status === 'COMPLETED' || localRecord.status === 'FAILED') {
      return NextResponse.json({ 
        status: localRecord.status,
        mpesaCode: localRecord.mpesaCode, // Include M-Pesa code if available
        originalAmount: localRecord.originalAmount,
        phone: localRecord.userFriendlyPhone
      });
    }

    // 2. Poll PesaFlux API
    const payload = {
      api_key: process.env.PESAFLUX_API_KEY,
      email: process.env.PESAFLUX_EMAIL,
      transaction_request_id: id
    };

    const apiRes = await fetch(`${process.env.PESAFLUX_URL}/transactionstatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000) // 10s Timeout
    });

    const apiData = await apiRes.json();
    
    // 3. Determine Status
    // We map various possible API responses to our 3 core states
    let newStatus = 'PENDING';
    const remoteStatus = (apiData.TransactionStatus || apiData.status || '').toLowerCase();
    const resultCode = String(apiData.ResultCode || apiData.ResponseCode || '');

    if (remoteStatus === 'success' || remoteStatus === 'completed' || resultCode === '0' || resultCode === '200') {
        newStatus = 'COMPLETED';
    } else if (remoteStatus === 'failed' || remoteStatus === 'cancelled' || 
               resultCode === '1032' || resultCode === '1019' || 
               (resultCode !== '' && resultCode !== '0' && resultCode !== '200')) {
        // If result code exists but isn't success, it failed
        newStatus = 'FAILED';
    }

    // 4. Update Redis if status changed
    if (newStatus !== 'PENDING') {
      // Extract M-Pesa receipt number if available
      const mpesaCode = apiData.TransactionReceipt || apiData.TransactionReceipt || null;
      
      await redis.set(`pay:${id}`, JSON.stringify({
        ...localRecord,
        status: newStatus,
        mpesaCode: mpesaCode, // Store M-Pesa receipt number
        apiResponse: apiData, // Store full API response for debugging
        updatedAt: Date.now(),
        // If failed, provide more context
        failureReason: newStatus === 'FAILED' ? apiData.ResultDesc || apiData.ResponseDescription : null
      }), { EX: 3600 }); // Keep final result for 1 hour
    } else {
      // Still pending, update timestamp and extend TTL
      await redis.set(`pay:${id}`, JSON.stringify({
        ...localRecord,
        lastCheckedAt: Date.now()
      }), { EX: 3600 });
    }

    return NextResponse.json({ 
      status: newStatus,
      mpesaCode: newStatus === 'COMPLETED' ? (apiData.TransactionReceipt || null) : null,
      originalAmount: localRecord.originalAmount,
      phone: localRecord.userFriendlyPhone,
      // For recovery screen
      canRetry: newStatus === 'FAILED',
      retryCount: localRecord.retryCount || 0
    });

  } catch (error) {
    console.error("[STATUS-CHECK-ERROR]", error);
    // Return PENDING on network error so frontend keeps polling
    // But add a flag that this was a network error
    return NextResponse.json({ 
      status: 'PENDING',
      networkError: true,
      message: 'Network error while checking status'
    }); 
  }
}