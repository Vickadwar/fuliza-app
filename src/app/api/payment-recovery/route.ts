import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { action, checkoutRequestId } = await req.json();
    
    if (!action || !checkoutRequestId) {
      return NextResponse.json({ success: false, error: "Missing required fields" });
    }
    
    const redis = await getRedisClient();
    const cachedData = await redis.get(`pay:${checkoutRequestId}`);
    
    if (!cachedData) {
      return NextResponse.json({ 
        success: false, 
        error: "Transaction not found",
        recoveryAction: 'select_new'
      });
    }
    
    const localRecord = JSON.parse(cachedData);
    
    switch (action) {
      case 'fetch_payment':
        // Update stats
        localRecord.retryCount = (localRecord.retryCount || 0) + 1;
        localRecord.lastRetryAt = Date.now();
        await redis.set(`pay:${checkoutRequestId}`, JSON.stringify(localRecord), { EX: 3600 });
        
        return NextResponse.json({ 
          success: true, 
          message: "Retry attempt recorded",
          retryCount: localRecord.retryCount,
          originalAmount: localRecord.originalAmount,
          phone: localRecord.userFriendlyPhone
        });
        
      case 'retry_same':
        // Check age (30 mins limit)
        const transactionAge = Date.now() - localRecord.createdAt;
        if (transactionAge > 30 * 60 * 1000) { 
          return NextResponse.json({ 
            success: false, 
            error: "Transaction too old. Please select a new amount.",
            recoveryAction: 'select_new'
          });
        }
        
        localRecord.retryCount = (localRecord.retryCount || 0) + 1;
        await redis.set(`pay:${checkoutRequestId}`, JSON.stringify(localRecord), { EX: 3600 });
        
        return NextResponse.json({ 
          success: true, 
          shouldRetry: true,
          amount: localRecord.originalAmount,
          phone: localRecord.userFriendlyPhone
        });
        
      default:
        return NextResponse.json({ success: false, error: "Unknown action" });
    }
    
  } catch (error) {
    console.error("[RECOVERY-ERROR]", error);
    return NextResponse.json({ success: false, error: "Recovery failed" }, { status: 500 });
  }
}