import { NextResponse } from 'next/server';
import { sendFluxSMS } from '@/lib/flux-client';
import { generateTrackingId } from '@/lib/loan-engine';
import { getRedisClient } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("[Webhook Received]", data);

    const { 
        ResponseCode, 
        CheckoutRequestID, 
        Msisdn, 
        TransactionAmount, 
        TransactionReceipt 
    } = data;

    // Use getRedisClient for safety
    const redis = await getRedisClient();

    // 1. Fetch Existing Data (To preserve phone number, original amount, etc.)
    const existingDataStr = await redis.get(`pay:${CheckoutRequestID}`);
    let existingData = {};
    if (existingDataStr) {
        // Redis returns a string, we must parse it to an object to merge
        existingData = JSON.parse(existingDataStr);
    }

    if (ResponseCode == 0) {
        // --- SUCCESS CASE ---
        
        // FIX: Called without arguments to match loan-engine definition
        const trackId = generateTrackingId(); 

        // Update Redis (Merge with existing data)
        await redis.set(`pay:${CheckoutRequestID}`, JSON.stringify({
            ...existingData, // Keep original phone, amount, etc.
            status: 'COMPLETED',
            mpesaCode: TransactionReceipt, // Save receipt for frontend
            receipt: TransactionReceipt,
            trackId: trackId,
            updatedAt: Date.now()
        }), { EX: 3600 }); // Extend expiry to 1 hour

        // Send Success SMS
        const successMsg = `CONFIRMED: ${TransactionReceipt}. KES ${TransactionAmount} received. Your Loan Limit is ACTIVE. Tracking ID: ${trackId}. Disbursement in progress.`;
        await sendFluxSMS(Msisdn, successMsg);

    } else {
        // --- FAILURE CASE ---
        
        // Update Redis
        await redis.set(`pay:${CheckoutRequestID}`, JSON.stringify({
            ...existingData,
            status: 'FAILED',
            updatedAt: Date.now()
        }), { EX: 600 }); // Keep for 10 mins
        
        // Send Failure SMS
        const failMsg = `DEAR Customer: The transaction failed. We could not activate your limit. Please verify M-Pesa balance or retry.`;
        await sendFluxSMS(Msisdn, failMsg);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}