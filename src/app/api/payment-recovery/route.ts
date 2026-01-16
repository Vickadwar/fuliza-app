import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { action, checkoutRequestId, phoneNumber, amount } = await req.json();
    
    if (!action || !checkoutRequestId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }
    
    const redis = await getRedisClient();
    const cachedData = await redis.get(`pay:${checkoutRequestId}`);
    
    if (!cachedData) {
      return NextResponse.json({ 
        success: false, 
        error: "Transaction not found",
        recoveryAction: 'select_new' // Go to offers/select screen
      });
    }
    
    const localRecord = JSON.parse(cachedData);
    
    switch (action) {
      case 'fetch_payment':
        // Just update retry count and timestamp
        localRecord.retryCount = (localRecord.retryCount || 0) + 1;
        localRecord.lastRetryAt = Date.now();
        await redis.set(`pay:${checkoutRequestId}`, JSON.stringify(localRecord), { EX: 3600 });
        
        return NextResponse.json({ 
          success: true, 
          message: "Retry attempt recorded",
          retryCount: localRecord.retryCount,
          // Return original transaction details for frontend
          originalAmount: localRecord.originalAmount,
          phone: localRecord.userFriendlyPhone,
          serviceType: localRecord.serviceType,
          createdAt: localRecord.createdAt
        });
        
      case 'retry_same':
        // Check if transaction is too old (more than 30 minutes)
        const transactionAge = Date.now() - localRecord.createdAt;
        if (transactionAge > 30 * 60 * 1000) { // 30 minutes
          return NextResponse.json({ 
            success: false, 
            error: "Transaction too old. Please select a new amount.",
            recoveryAction: 'select_new'
          });
        }
        
        // Update retry count
        localRecord.retryCount = (localRecord.retryCount || 0) + 1;
        localRecord.lastRetryAt = Date.now();
        await redis.set(`pay:${checkoutRequestId}`, JSON.stringify(localRecord), { EX: 3600 });
        
        return NextResponse.json({ 
          success: true, 
          message: "Ready for retry",
          shouldRetry: true,
          amount: localRecord.originalAmount,
          phone: localRecord.userFriendlyPhone,
          retryCount: localRecord.retryCount
        });
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: "Unknown action" 
        });
    }
    
  } catch (error) {
    console.error("[PAYMENT-RECOVERY-ERROR]", error);
    return NextResponse.json({ 
      success: false, 
      error: "Recovery action failed" 
    }, { status: 500 });
  }
}