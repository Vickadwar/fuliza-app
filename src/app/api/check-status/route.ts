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
          recoveryAction: 'select_new' 
        });
    }

    const localRecord = JSON.parse(cachedData);
    
    // Update polling attempts
    if (action === 'poll') {
      localRecord.pollingAttempts = (localRecord.pollingAttempts || 0) + 1;
      await redis.set(`pay:${id}`, JSON.stringify(localRecord), { EX: 3600 });
    }

    // If we already know the final status from a previous check, return it
    if (localRecord.status === 'COMPLETED' || localRecord.status === 'FAILED') {
      return NextResponse.json({ 
        status: localRecord.status,
        mpesaCode: localRecord.mpesaCode,
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
      signal: AbortSignal.timeout(10000)
    });

    const apiData = await apiRes.json();
    
    // --- 3. LOGIC FIX IS HERE ---
    
    let newStatus = 'PENDING';
    
    // Normalize data
    const remoteStatus = (apiData.TransactionStatus || apiData.status || '').toLowerCase();
    const resultCode = String(apiData.ResultCode || apiData.ResponseCode || '');
    const mpesaReceipt = apiData.TransactionReceipt || apiData.TransactionReceipt || null;

    // A. CHECK FOR SUCCESS
    // STRICT CHECK: Must be 'completed'/'success' AND have an M-Pesa Receipt
    // We removed "resultCode === 200" because PesaFlux returns 200 for Pending requests too.
    if (
        (remoteStatus === 'success' || remoteStatus === 'completed' || resultCode === '0') && 
        mpesaReceipt && mpesaReceipt.length > 5
    ) {
        newStatus = 'COMPLETED';
    } 
    // B. CHECK FOR FAILURE
    else if (
        remoteStatus === 'failed' || 
        remoteStatus === 'cancelled' || 
        resultCode === '1032' || // Cancelled by user
        resultCode === '1037' || // Timeout
        resultCode === '2001' || // Invalid info
        (remoteStatus !== 'pending' && resultCode !== '200' && resultCode !== '0' && resultCode !== '') // Catch-all for other non-success codes
    ) {
        newStatus = 'FAILED';
    }
    // C. OTHERWISE, IT REMAINS PENDING

    // 4. Update Redis if status changed
    if (newStatus !== 'PENDING') {
      await redis.set(`pay:${id}`, JSON.stringify({
        ...localRecord,
        status: newStatus,
        mpesaCode: mpesaReceipt,
        apiResponse: apiData, 
        updatedAt: Date.now(),
        failureReason: newStatus === 'FAILED' ? apiData.ResultDesc || apiData.ResponseDescription : null
      }), { EX: 3600 });
    } else {
      // Still pending
      await redis.set(`pay:${id}`, JSON.stringify({
        ...localRecord,
        lastCheckedAt: Date.now()
      }), { EX: 3600 });
    }

    return NextResponse.json({ 
      status: newStatus,
      mpesaCode: newStatus === 'COMPLETED' ? mpesaReceipt : null,
      originalAmount: localRecord.originalAmount,
      phone: localRecord.userFriendlyPhone,
      canRetry: newStatus === 'FAILED',
      retryCount: localRecord.retryCount || 0
    });

  } catch (error) {
    console.error("[STATUS-CHECK-ERROR]", error);
    return NextResponse.json({ 
      status: 'PENDING',
      networkError: true,
      message: 'Network error while checking status'
    }); 
  }
}