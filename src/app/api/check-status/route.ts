import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    
    // 1. Check Redis Cache
    const cachedData = await redis.get(`pay:${id}`);
    
    // If not in Redis, transaction expired or never existed
    if (!cachedData) {
        return NextResponse.json({ status: 'FAILED', reason: 'Transaction expired' });
    }

    const localRecord = JSON.parse(cachedData);

    // If we already know the final status, don't ask API again
    if (localRecord.status === 'COMPLETED' || localRecord.status === 'FAILED') {
      return NextResponse.json({ status: localRecord.status });
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
    const remoteStatus = (apiData.status || apiData.transaction_status || '').toLowerCase();
    const resultCode = String(apiData.ResultCode || ''); // Sometimes APIs return "0" for success

    if (remoteStatus === 'success' || remoteStatus === 'completed' || resultCode === '0') {
        newStatus = 'COMPLETED';
    } else if (remoteStatus === 'failed' || remoteStatus === 'cancelled' || resultCode !== '') {
        // If result code exists but isn't 0, it failed
        newStatus = 'FAILED';
    }

    // 4. Update Redis if status changed
    if (newStatus !== 'PENDING') {
      await redis.set(`pay:${id}`, JSON.stringify({
        ...localRecord,
        status: newStatus,
        updatedAt: Date.now()
      }), { EX: 3600 }); // Keep final result for 1 hour
    }

    return NextResponse.json({ status: newStatus });

  } catch (error) {
    console.error("[STATUS-CHECK-ERROR]", error);
    // Return PENDING on network error so frontend keeps polling
    return NextResponse.json({ status: 'PENDING' }); 
  }
}