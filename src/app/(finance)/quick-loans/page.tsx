'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Banknote, 
  ShieldCheck, 
  Wallet,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'

function QuickLoansContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<'calculator' | 'form' | 'fee_payment' | 'success'>('calculator')

  // Calculator State
  const [amount, setAmount] = useState(15000)
  const [months, setMonths] = useState(1)
  
  // Set initial amount from URL only once on mount
  useEffect(() => {
    const paramAmount = searchParams.get('amount')
    if (paramAmount) {
        const parsed = Number(paramAmount.replace(/,/g, ''))
        if (!isNaN(parsed)) {
            // FIX: Enforce min 500, max 50000
            const clamped = Math.max(500, Math.min(parsed, 50000))
            setAmount(clamped)
        }
    }
  }, [searchParams])

  // Derived Financial State
  const [processingFee, setProcessingFee] = useState(0)
  const [totalRepayable, setTotalRepayable] = useState(0)
  const [interestRate, setInterestRate] = useState(12)
  
  // Form Data
  const [formData, setFormData] = useState({ phone: '', idNumber: '', purpose: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Logic
  useEffect(() => {
    const newRate = 12 + ((months - 1) * 2.5) 
    setInterestRate(Math.round(newRate))

    const calculatedFee = Math.max(150, Math.ceil((amount * 0.025) / 10) * 10)
    setProcessingFee(calculatedFee)

    const total = amount + (amount * (newRate / 100))
    setTotalRepayable(Math.ceil(total / 10) * 10)
  }, [amount, months])

  const handleFeePayment = () => {
    setIsSubmitting(true)
    setTimeout(() => {
        setIsSubmitting(false)
        setStep('fee_payment')
        setTimeout(() => {
            setStep('success')
        }, 6000)
    }, 1500)
  }

  // Helper to handle slider change ensuring min 500
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value)
    if (val < 500) val = 500
    setAmount(val)
  }

  return (
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {step === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">
                        Customize Your <span className="text-emerald-500">Loan</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Funds sent directly to M-Pesa.</p>
                </div>

                {/* --- CALCULATOR --- */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                    <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">I want to borrow</p>
                            <div className="flex justify-center items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-500">KES</span>
                                <span className="text-6xl font-black tracking-tighter">{amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                                <span>500</span> {/* FIX: Min Label 500 */}
                                <span className="text-emerald-500">Slide amount</span>
                                <span>50k</span>
                            </div>
                            <input 
                                type="range" 
                                min="500" // FIX: Min 500
                                max="50000" 
                                step="500" 
                                value={amount}
                                onChange={handleAmountChange}
                                className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                 <label className="text-sm font-bold text-slate-900 uppercase">Duration</label>
                                 <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{months} Month{months > 1 ? 's' : ''}</span>
                             </div>
                             <div className="grid grid-cols-6 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMonths(m)}
                                        className={`h-12 rounded-xl font-bold text-sm transition-all border-2 
                                            ${months === m 
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' 
                                                : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
                                    >
                                        {m}M
                                    </button>
                                ))}
                             </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-500">Interest ({interestRate}%)</span>
                                <span className="font-bold text-slate-900">KES {(totalRepayable - amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-500">Processing Fee</span>
                                <span className="font-bold text-slate-900">KES {processingFee}</span>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-900 uppercase">Total Repayable</span>
                                <span className="text-2xl font-black text-emerald-600">
                                    KES {totalRepayable.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <Button 
                            onClick={() => {
                                setStep('form')
                                window.scrollTo(0,0)
                            }}
                            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
                        >
                            Get KES {amount.toLocaleString()} Now
                        </Button>
                    </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 bg-white py-3 px-4 rounded-full shadow-sm border border-slate-100 w-fit mx-auto">
                    <ShieldCheck className="w-4 h-4 text-emerald-500"/>
                    <span>No guarantors required • Instant M-Pesa transfer</span>
                </div>
            </div>
        )}

        {step === 'form' && (
            <div className="animate-in slide-in-from-right duration-500 max-w-md mx-auto space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-emerald-500 p-8 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Loan Amount</p>
                                <p className="text-4xl font-black tracking-tight">KES {amount.toLocaleString()}</p>
                            </div>
                            <div className="bg-emerald-600/50 p-3 rounded-2xl backdrop-blur-md">
                                <Wallet className="w-6 h-6 text-white"/>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">M-Pesa Number</label>
                            <input 
                                type="tel" 
                                placeholder="07XX XXX XXX"
                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-xl text-slate-900 placeholder:text-slate-300 transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">ID Number</label>
                            <input 
                                type="number" 
                                placeholder="12345678"
                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-xl text-slate-900 placeholder:text-slate-300 transition-all"
                                value={formData.idNumber}
                                onChange={e => setFormData({...formData, idNumber: e.target.value})}
                            />
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">Security & Processing Fee</h4>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                        To process your loan of <span className="font-bold">KES {amount.toLocaleString()}</span>, a fee of <span className="font-bold bg-blue-100 px-1 rounded">KES {processingFee}</span> is required. This will be triggered via M-Pesa immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleFeePayment}
                            disabled={isSubmitting || !formData.phone || !formData.idNumber}
                            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl shadow-xl transition-all"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <span>Pay KES {processingFee} & Get Loan</span>
                            )}
                        </Button>
                    </div>
                </div>
                
                <button onClick={() => setStep('calculator')} className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                    Cancel and go back
                </button>
            </div>
        )}

        {step === 'fee_payment' && (
            <div className="text-center pt-8 animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-100 border border-slate-50 relative overflow-hidden">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                         <Smartphone className="w-10 h-10 text-emerald-600 relative z-10" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Check Your Phone</h2>
                    <p className="text-slate-500 font-medium mb-6">
                        Enter PIN to pay the processing fee of <br/>
                        <span className="text-emerald-600 text-xl font-black">KES {processingFee}</span>
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                            <span>Status</span>
                            <span className="text-emerald-500 animate-pulse">Waiting for Payment</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-2/3 animate-[width_3s_ease-in-out_infinite]"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>Secure Transaction</span>
                    </div>
                </div>
            </div>
        )}

        {step === 'success' && (
            <div className="text-center pt-8 animate-in zoom-in-95 duration-500 max-w-md mx-auto">
                 <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mb-2">Fee Received!</h2>
                <p className="text-slate-500 font-medium mb-8">
                    Your loan application for <span className="text-slate-900 font-bold">KES {amount.toLocaleString()}</span> is now being processed.
                </p>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 text-left">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-slate-900">Fee Confirmation</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Processing fee payment confirmed.</p>
                            </div>
                        </div>
                        <div className="w-0.5 h-6 bg-slate-100 ml-5"></div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-slate-900">Final Review</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    System is verifying your details. You will receive an SMS with the loan disbursement within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                        <p className="text-xs text-yellow-800 font-bold leading-relaxed">
                            Funds usually arrive within 24-48 Hours.
                        </p>
                    </div>
                </div>

                <Button 
                    onClick={() => router.push('/')}
                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                    Back to Home
                </Button>
            </div>
        )}
      </main>
  )
}

export default function QuickLoansPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <div className="bg-indigo-950 text-white text-xs py-2 px-3 relative z-50">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="font-bold tracking-wide text-indigo-100">INSTANT DISBURSEMENT ACTIVE</span>
                    </div>
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-700"/>
                        </Link>
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Banknote className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">QuickCash</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instant Loan</span>
                        </div>
                    </div>
                </div>
            </header>

            <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <QuickLoansContent />
            </Suspense>
        </div>
    )
}