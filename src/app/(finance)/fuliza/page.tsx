'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  CreditCard,
  AlertCircle,
  Wifi,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Star,
  Target,
  Banknote,
  BadgeCheck,
  Clock,
  Shield,
  Check,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- CONFIGURATION: LIMITS & FEES ---
const LIMIT_OPTIONS = [
  { amount: 5000, fee: 49 },
  { amount: 7500, fee: 75 },
  { amount: 10000, fee: 120 },
  { amount: 15000, fee: 180 },
  { amount: 20000, fee: 250 },
  { amount: 35000, fee: 380 },
  { amount: 50000, fee: 550 },
  { amount: 70000, fee: 750 },
  { amount: 85000, fee: 890 },
  { amount: 100000, fee: 1050 },
];

export default function FulizaPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  // Steps: 'grid' -> 'form' -> 'stk_push' -> 'success'
  const [currentStep, setCurrentStep] = useState<'grid' | 'form' | 'stk_push' | 'success'>('grid');
  
  // Data State
  const [selectedOffer, setSelectedOffer] = useState({ amount: 0, fee: 0 });
  const [formData, setFormData] = useState({ phone: '', idNumber: '', range: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Range options for custom dropdown
  const rangeOptions = [
    { value: 'low', label: 'Ksh 1k - 10k', description: 'Light User' },
    { value: 'mid', label: 'Ksh 10k - 50k', description: 'Regular User' },
    { value: 'high', label: 'Ksh 50k - 150k', description: 'Active User' },
    { value: 'elite', label: 'Above Ksh 150k', description: 'Power User' }
  ];

  // --- HANDLERS ---
  const handleSelect = (offer: { amount: number, fee: number }) => {
    setSelectedOffer(offer);
    setCurrentStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('stk_push');
        setTimeout(() => {
            setCurrentStep('success');
        }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- Status Bar (Matched to Home) --- */}
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

      {/* --- Header (Matched to Home) --- */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back Button Logic */}
              {currentStep !== 'grid' ? (
                <button 
                  onClick={() => setCurrentStep('grid')}
                  className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700"/>
                </button>
              ) : (
                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
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
        <div className="flex justify-center mb-12">
            <div className="flex gap-3">
                {['grid', 'form', 'stk_push', 'success'].map((step, i) => {
                    const steps = ['grid', 'form', 'stk_push', 'success'];
                    const currentIndex = steps.indexOf(currentStep);
                    const isActive = i <= currentIndex;
                    
                    return (
                        <div key={step} className={`h-2 rounded-full transition-all duration-500 ${isActive ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />
                    )
                })}
            </div>
        </div>

        {/* ==========================================
            VIEW 1: LIMIT SELECTION GRID (Pop Style)
           ========================================== */}
        {currentStep === 'grid' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                    Choose Your <span className="text-blue-600">New Limit</span>
                  </h1>
                  <p className="text-lg text-slate-500 font-medium">
                    Tap a limit to instantly upgrade. 
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {LIMIT_OPTIONS.map((opt) => (
                        <button 
                            key={opt.amount}
                            onClick={() => handleSelect(opt)}
                            className={`group relative bg-white rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-2 border-2 
                              ${opt.amount === 35000 
                                ? 'border-blue-500 shadow-2xl shadow-blue-200 ring-4 ring-blue-50' 
                                : 'border-transparent shadow-xl shadow-slate-200/50 hover:border-blue-200'}`}
                        >
                            {opt.amount === 35000 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                                  <Star className="w-3 h-3 fill-current" />
                                  Popular
                                </div>
                            )}
                            
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Limit</div>
                            
                            <div className="flex flex-col items-start mb-4">
                              <span className="text-sm font-bold text-slate-500">KES</span>
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                {opt.amount >= 1000 ? `${opt.amount/1000}k` : opt.amount}
                              </span>
                            </div>
                            
                            <div className="w-full py-2 bg-slate-50 rounded-xl text-center">
                                <span className="text-xs font-bold text-slate-600">Fee: KES {opt.fee}</span>
                            </div>
                        </button>
                    ))}
                </div>
                
                {/* Benefits Section */}
                <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Instant Activation', icon: <Zap className="w-5 h-5"/>, desc: 'Zero waiting period.' },
                        { title: 'Higher Limits', icon: <TrendingUp className="w-5 h-5"/>, desc: 'Access up to 150k.' },
                        { title: 'Priority Support', icon: <ShieldCheck className="w-5 h-5"/>, desc: '24/7 dedicated line.' }
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{benefit.title}</h3>
                                <p className="text-sm text-slate-500">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 2: FORM (Pop Style)
           ========================================== */}
        {currentStep === 'form' && (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                    
                    {/* Ticket Header */}
                    <div className="p-8 bg-blue-600 text-white relative overflow-hidden">
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

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">M-Pesa Number</label>
                            <div className="relative">
                                <input 
                                    type="tel" 
                                    placeholder="07XX XXX XXX"
                                    className="w-full h-16 pl-4 pr-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-xl text-slate-900 transition-all placeholder:text-slate-300 placeholder:font-medium"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* ID */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">ID Number</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="12345678"
                                    className="w-full h-16 pl-4 pr-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-xl text-slate-900 transition-all placeholder:text-slate-300 placeholder:font-medium"
                                    value={formData.idNumber}
                                    onChange={e => setFormData({...formData, idNumber: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Range - Custom Dropdown */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">Avg. Monthly Usage</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full h-16 px-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 flex items-center justify-between text-left transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.range ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <Target className="w-4 h-4" />
                                      </div>
                                      <span className={`font-bold text-lg ${formData.range ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {formData.range ? rangeOptions.find(opt => opt.value === formData.range)?.label : 'Select range...'}
                                      </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-2">
                                        {rangeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({...formData, range: option.value})
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="w-full p-4 text-left hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                                            >
                                                <div>
                                                    <div className="font-bold text-slate-900">{option.label}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{option.description}</div>
                                                </div>
                                                {formData.range === option.value && (
                                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
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
                            className={`w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 mt-4
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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3"/> Bank-Grade Security
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 3: STK PUSH (Pop Style)
           ========================================== */}
        {currentStep === 'stk_push' && (
            <div className="max-w-md mx-auto pt-8 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-100 border border-slate-50 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-20"></div>
                        <Smartphone className="w-10 h-10 text-emerald-600" />
                    </div>
                  
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Check Your Phone</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Enter your M-Pesa PIN to complete the fee payment of <strong className="text-emerald-600">KES {selectedOffer.fee}</strong>.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md animate-pulse">Waiting</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[width_5s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                        </div>
                    </div>

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Do not close this window
                    </div>
                </div>
            </div>
        )}

        {/* ==========================================
            VIEW 4: SUCCESS (Pop Style)
           ========================================== */}
        {currentStep === 'success' && (
            <div className="max-w-md mx-auto pt-8 animate-in zoom-in-95 duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-50 text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                  
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Success!</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Your request to boost limit to <strong className="text-slate-900">KES {selectedOffer.amount.toLocaleString()}</strong> has been received.
                    </p>

                    <div className="space-y-4 text-left bg-slate-50 p-6 rounded-3xl mb-8">
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-slate-900">Processing</h4>
                                <p className="text-xs text-slate-500 font-medium">System is updating your profile.</p>
                            </div>
                        </div>
                        <div className="w-0.5 h-4 bg-slate-200 ml-4"></div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-slate-900">Activation</h4>
                                <p className="text-xs text-slate-500 font-medium">New limit active within 1-2 hours.</p>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={() => router.push('/')}
                        className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all hover:-translate-y-1"
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 mt-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 mb-4">© {currentYear} FulizaBoost</p>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
}