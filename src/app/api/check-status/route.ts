import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // This will be the SOFTPID
  const action = searchParams.get('action') || 'poll'; 

  if (!id) return NextResponse.json({ status: 'ERROR' });

  try {
    const redis = await getRedisClient();
    
    // Check Redis Cache using the SOFTPID
    const cachedData = await redis.get(`pay:${id}`);
    
    if (!cachedData) {
        return NextResponse.json({ 
          status: 'PENDING', // Keep pending if not found immediately to prevent premature failure
          message: 'Waiting for record...'
        });
    }

    const localRecord = JSON.parse(cachedData);
    
    // Return logic based on Redis status (updated by Webhook)
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

    // Default: PENDING
    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    console.error("[STATUS-CHECK-ERROR]", error);
    return NextResponse.json({ status: 'PENDING' }); 
  }
}