import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const action = searchParams.get('action') || 'poll'; 

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    
    // 1. Check Redis Cache
    const cachedData = await redis.get(`pay:${id}`);
    
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

    // Return logic based on Redis status (updated by Webhook)
    if (localRecord.status === 'COMPLETED') {
      return NextResponse.json({ 
        status: 'COMPLETED',
        mpesaCode: localRecord.mpesaCode || localRecord.receipt,
        originalAmount: localRecord.originalAmount,
        phone: localRecord.userFriendlyPhone,
        trackId: localRecord.trackId
      });
    }

    if (localRecord.status === 'FAILED') {
      return NextResponse.json({ 
        status: 'FAILED',
        reason: localRecord.failureReason || 'Payment failed',
        retryCount: localRecord.retryCount || 0
      });
    }

    // If still pending, return PENDING
    return NextResponse.json({ 
      status: 'PENDING',
      originalAmount: localRecord.originalAmount,
      phone: localRecord.userFriendlyPhone,
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