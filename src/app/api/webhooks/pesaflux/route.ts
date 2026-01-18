import { NextResponse } from 'next/server';
import { sendSuccessSMS } from '@/app/actions/sms';
import { generateTrackingId } from '@/lib/loan-engine';
import { getRedisClient } from '@/lib/redis';
import { sendFluxSMS } from '@/lib/flux-client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("[Webhook Received]", JSON.stringify(data, null, 2));

    // 1. SAFE EXTRACTION (Handle PesaFlux naming conventions)
    // IMPORTANT: 'TransactionID' in Webhook matches 'transaction_request_id' from Initiation
    const requestID = data.TransactionID || data.MerchantRequestID; 
    const responseCode = data.ResponseCode; // 0 = Success
    const msisdn = data.Msisdn;
    const amount = data.TransactionAmount;
    const receipt = data.TransactionReceipt;

    if (!requestID) {
      return NextResponse.json({ status: "error", message: "Missing TransactionID" }, { status: 400 });
    }

    const redis = await getRedisClient();

    // 2. FIND THE CONTEXT (Using the SOFTPID)
    const redisKey = `pay:${requestID}`;
    const existingStr = await redis.get(redisKey);
    
    // If not found, log it (It might be an orphaned transaction or ID mismatch)
    if (!existingStr) {
        console.error(`[Webhook] No Redis context found for ID: ${requestID}`);
        return NextResponse.json({ status: "ignored" });
    }

    const existing = JSON.parse(existingStr as string);
    const serviceType = existing.serviceType === 'FULIZA_BOOST' ? 'FULIZA' : 'LOAN';

    if (responseCode == 0) {
        // --- SUCCESS ---
        const trackId = generateTrackingId();

        // Update Redis so the frontend polling loop sees 'COMPLETED'
        await redis.set(redisKey, JSON.stringify({
            ...existing,
            status: 'COMPLETED',
            mpesaCode: receipt,
            trackId: trackId,
        }), { EX: 3600 });

        // Send Custom Success SMS
        await sendSuccessSMS(msisdn, amount, trackId, serviceType);
        console.log(`[Webhook] Success processed for ${requestID}`);

    } else {
        // --- FAILED / CANCELLED ---
        await redis.set(redisKey, JSON.stringify({
            ...existing,
            status: 'FAILED',
            reason: data.ResponseDescription || 'CANCELLED'
        }), { EX: 600 });
        
        console.log(`[Webhook] Failure/Cancel processed for ${requestID}`);

        // Send Failure Nudge (Optional)
        const failMsg = `Dear Customer, the transaction was cancelled. To activate your ${serviceType === 'FULIZA' ? 'Fuliza Boost' : 'Quick Loan'}, please retry the payment on the website.`;
        await sendFluxSMS(msisdn, failMsg);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}