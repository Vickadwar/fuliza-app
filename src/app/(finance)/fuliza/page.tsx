'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  TrendingUp,
  Target,
  BadgeCheck,
  Lock,
  Home,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- CONFIGURATION: LIMITS & FEES (2% Calculation) ---
const LIMIT_OPTIONS = [
  { amount: 5000, fee: 100 },
  { amount: 7500, fee: 150 },
  { amount: 10000, fee: 200 },
  { amount: 15000, fee: 300 },
  { amount: 20000, fee: 400 },
  { amount: 35000, fee: 700 },
  { amount: 50000, fee: 1000 },
  { amount: 70000, fee: 1400 },
  { amount: 85000, fee: 1700 },
  { amount: 100000, fee: 2000 },
];

export default function FulizaPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  // Steps: 'grid' -> 'form' -> 'stk_push' -> 'result'
  const [currentStep, setCurrentStep] = useState<'grid' | 'form' | 'stk_push' | 'result'>('grid');
  const [resultStatus, setResultStatus] = useState<'approved' | 'soft_decline' | null>(null);
  
  // Data State
  const [selectedOffer, setSelectedOffer] = useState({ amount: 0, fee: 0 });
  const [formData, setFormData] = useState({ phone: '', idNumber: '', range: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({ phone: '', id: '' });

  // Range options
  const rangeOptions = [
    { value: 'low', label: 'Ksh 1,000 - 10,000', description: 'Light User' },
    { value: 'mid', label: 'Ksh 10,000 - 50,000', description: 'Regular User' },
    { value: 'high', label: 'Ksh 50,000 - 150,000', description: 'Active User' },
    { value: 'elite', label: 'Above Ksh 150,000', description: 'Power User' }
  ];

  // --- HANDLERS ---
  const handleSelect = (offer: { amount: number, fee: number }) => {
    setSelectedOffer(offer);
    setCurrentStep('form');
    setErrors({ phone: '', id: '' }); // Clear errors
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { phone: '', id: '' };

    // Validate Phone (Kenyan format: 07xx or 01xx + 8 digits = 10 digits total)
    const phoneRegex = /^0(7|1)\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Enter a valid Safaricom number (e.g., 0712345678)';
        isValid = false;
    }

    // Validate ID:
    // 1. Must be 6 to 8 digits (\d{5,7} after the first digit)
    // 2. Cannot start with 0 (^[1-9])
    const idRegex = /^[1-9]\d{5,7}$/;
    if (!idRegex.test(formData.idNumber)) {
        newErrors.id = 'ID must be 6-8 digits and cannot start with 0';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // 1. Simulate API Call / Validation
    setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('stk_push');
        
        // 2. Simulate Payment Wait Time & Determine Outcome
        setTimeout(() => {
            // LOGIC: If amount > 5000, Soft Decline. Else, Success.
            if (selectedOffer.amount > 5000) {
                setResultStatus('soft_decline');
            } else {
                setResultStatus('approved');
            }
            setCurrentStep('result');
        }, 5000); // 5 seconds wait for STK
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Status Bar --- */}
      <div className="bg-indigo-950 text-white text-xs py-2 px-3 relative z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wide text-indigo-100">SYSTEM ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium bg-white/10 px-2 py-1 rounded-full">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span className="text-white">SECURE SESSION</span>
          </div>
        </div>
      </div>

      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Navigation Logic */}
              {currentStep !== 'grid' ? (
                <button 
                  onClick={() => setCurrentStep('grid')}
                  className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700"/>
                </button>
              ) : (
                <Link href="/" className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                    <Home className="w-5 h-5 text-slate-700"/>
                </Link>
              )}
              
              <div className="leading-tight">
                <span className="text-xl font-black tracking-tight text-slate-900 block">
                  FulizaBoost
                </span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider">
               <Zap className="h-3 w-3 fill-current" /> Official Service
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Progress Dots */}
        <div className="flex justify-center mb-10">
            <div className="flex gap-3">
                {['grid', 'form', 'stk_push', 'result'].map((step, i) => {
                    const steps = ['grid', 'form', 'stk_push', 'result'];
                    const currentIndex = steps.indexOf(currentStep);
                    const isActive = i <= currentIndex;
                    
                    return (
                        <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${isActive ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />
                    )
                })}
            </div>
        </div>

        {/* ==========================================
            VIEW 1: LIMIT SELECTION GRID
           ========================================== */}
        {currentStep === 'grid' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10 max-w-2xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                    Choose Your <span className="text-blue-600">New Limit</span>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium">
                    Limits approved instantly based on history.
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {LIMIT_OPTIONS.map((opt) => (
                        <button 
                            key={opt.amount}
                            onClick={() => handleSelect(opt)}
                            className="group relative bg-white rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1 border-2 border-transparent shadow-lg shadow-slate-200/50 hover:border-blue-200 hover:shadow-xl"
                        >
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Limit</div>
                            
                            <div className="flex flex-col items-start mb-4">
                              <span className="text-xs font-bold text-slate-500">KES</span>
                              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                {opt.amount.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="w-full py-1.5 bg-blue-50 rounded-lg text-center">
                                <span className="text-xs font-bold text-blue-700">Fee: KES {opt.fee}</span>
                            </div>
                        </button>
                    ))}
                </div>
                
                {/* Benefits Section */}
                <div className="mt-12 bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: 'Instant Activation', icon: <Zap className="w-5 h-5"/>, desc: 'Zero waiting period.' },
                        { title: 'Higher Limits', icon: <TrendingUp className="w-5 h-5"/>, desc: 'Access up to 150k.' },
                        { title: 'Priority Support', icon: <ShieldCheck className="w-5 h-5"/>, desc: '24/7 dedicated line.' }
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{benefit.title}</h3>
                                <p className="text-xs text-slate-500">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 2: FORM
           ========================================== */}
        {currentStep === 'form' && (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-visible relative z-10">
                    
                    {/* Ticket Header */}
                    <div className="p-8 bg-blue-600 text-white relative overflow-hidden rounded-t-[2rem]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="relative z-10">
                            <span className="text-blue-200 font-bold text-xs uppercase tracking-widest">Selected Package</span>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-2xl font-medium text-blue-200">KES</span>
                                <span className="text-5xl font-black">{selectedOffer.amount.toLocaleString()}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-100 bg-blue-700/50 p-2 rounded-lg w-fit px-4">
                                <BadgeCheck className="w-4 h-4"/>
                                Fee: KES {selectedOffer.fee}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">M-Pesa Number</label>
                            <input 
                                type="tel" 
                                placeholder="0712 345 678"
                                maxLength={10}
                                className={`w-full h-14 pl-4 pr-4 bg-slate-50 border-2 rounded-xl outline-none font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-blue-500 focus:bg-white'}`}
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                            {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone}</p>}
                        </div>

                        {/* ID */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">ID Number</label>
                            <input 
                                type="number" 
                                placeholder="12345678"
                                maxLength={8}
                                className={`w-full h-14 pl-4 pr-4 bg-slate-50 border-2 rounded-xl outline-none font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 ${errors.id ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-blue-500 focus:bg-white'}`}
                                value={formData.idNumber}
                                onChange={e => setFormData({...formData, idNumber: e.target.value})}
                            />
                             {errors.id && <p className="text-xs text-red-500 font-bold">{errors.id}</p>}
                        </div>

                        {/* Range - Custom Dropdown with Fix */}
                        <div className="space-y-2 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Avg. Monthly Usage</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full h-14 px-4 rounded-xl bg-slate-50 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 flex items-center justify-between text-left transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.range ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <Target className="w-4 h-4" />
                                      </div>
                                      <span className={`font-bold text-sm ${formData.range ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {formData.range ? rangeOptions.find(opt => opt.value === formData.range)?.label : 'Select range...'}
                                      </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-2xl z-50 max-h-[250px] overflow-y-auto p-1">
                                        {rangeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({...formData, range: option.value})
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                                            >
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{option.label}</div>
                                                </div>
                                                {formData.range === option.value && (
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 mt-2
                              ${isProcessing ? 'opacity-80' : ''}`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Initiating...</span>
                                </div>
                            ) : (
                                <span>Pay KES {selectedOffer.fee} & Activate</span>
                            )}
                        </Button>
                        
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3"/> Bank-Grade Security
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 3: STK PUSH
           ========================================== */}
        {currentStep === 'stk_push' && (
            <div className="max-w-md mx-auto pt-8 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-100 border border-slate-50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-20"></div>
                        <Smartphone className="w-10 h-10 text-emerald-600" />
                    </div>
                  
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Check Your Phone</h2>
                    <p className="text-slate-500 font-medium mb-6 text-sm">
                        Enter M-Pesa PIN to pay fee of <br/>
                        <strong className="text-emerald-600 text-xl">KES {selectedOffer.fee}</strong>.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">Waiting Payment</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[width_5s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                        </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Do not close this window
                    </div>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 4: RESULT (Approved or Soft Decline)
           ========================================== */}
        {currentStep === 'result' && (
            <div className="max-w-md mx-auto pt-8 animate-in zoom-in-95 duration-500">
                
                {/* SCENARIO A: 5,000 LIMIT (SUCCESS) */}
                {resultStatus === 'approved' && (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-50 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                    
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Application Received</h2>
                        <p className="text-slate-500 font-medium mb-8 text-sm">
                            Your request for <strong className="text-slate-900">KES 5,000</strong> is under review.
                        </p>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-left flex gap-3 mb-6">
                            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Status: Under Review</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Please allow up to 48 hours for your limit to reflect. You will receive an SMS confirmation.
                                </p>
                            </div>
                        </div>

                        <Button 
                            onClick={() => router.push('/')}
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-xl transition-all"
                        >
                            Return to Home
                        </Button>
                    </div>
                )}

                {/* SCENARIO B: > 5,000 LIMIT (SOFT DECLINE) */}
                {resultStatus === 'soft_decline' && (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-orange-100 border border-slate-50 text-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-orange-600" />
                        </div>
                    
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Limit Verification Failed</h2>
                        <p className="text-slate-500 font-medium mb-6 text-sm">
                            We received your fee, but your current transaction history does not qualify for the requested limit of <strong>KES {selectedOffer.amount.toLocaleString()}</strong> at this time.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl text-left text-sm text-slate-600 mb-6">
                            <p className="mb-2 text-xs font-bold uppercase text-slate-400">Recommendation</p>
                            <p className="text-xs font-medium leading-relaxed">
                                Please try applying for a <strong>lower limit</strong>. Approvals for lower amounts have a significantly higher success rate based on your profile.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button 
                                onClick={() => {
                                    setCurrentStep('grid'); // Go back to grid
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Select Lower Limit
                            </Button>
                            <Button 
                                onClick={() => router.push('/')}
                                variant="ghost"
                                className="w-full h-12 text-slate-500 font-bold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 mt-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 mb-4">© {currentYear} FulizaBoost</p>
          <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
}