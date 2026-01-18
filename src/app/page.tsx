'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Zap, Menu, X, Banknote, Lock, ChevronDown, 
  Sparkles, ShieldCheck, CheckCircle2, Users, Clock, 
  Star, ArrowRight, TrendingUp, Check, Activity, BarChart2, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('fuliza')
  
  // Form States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mpesaRange, setMpesaRange] = useState('') 
  const [predictedLimit, setPredictedLimit] = useState<{ min: string, max: string } | null>(null)
  const [loanAmount, setLoanAmount] = useState('')

  // Theme Config
  const isFuliza = activeTab === 'fuliza';
  const themeClass = isFuliza ? 'text-blue-700' : 'text-emerald-700';
  const btnClass = isFuliza ? 'bg-blue-700 hover:bg-blue-800' : 'bg-emerald-700 hover:bg-emerald-800';

  // Live Ticker Data
  const [boostIndex, setBoostIndex] = useState(0)
  const boosts = [
    { name: 'Sarah M.', amount: 'Limit +15k', type: 'boost' },
    { name: 'David K.', amount: 'Loan 24k', type: 'loan' },
    { name: 'John O.', amount: 'Limit +45k', type: 'boost' },
    { name: 'Peter W.', amount: 'Loan 8.5k', type: 'loan' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setBoostIndex((prev) => (prev + 1) % boosts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [boosts.length])

  // Handlers
  const handleRangeSelect = (value: string) => {
    setMpesaRange(value)
    setIsDropdownOpen(false)
    const limits: Record<string, { min: string, max: string }> = {
      'low': { min: '2,500', max: '4,500' },
      'mid': { min: '7,500', max: '12,000' },
      'high': { min: '25,000', max: '45,000' },
      'elite': { min: '80,000', max: '150,000' }
    }
    if (limits[value]) setPredictedLimit(limits[value])
  }

  const handleStart = () => {
    setIsLoading(true)
    setTimeout(() => {
      if (activeTab === 'fuliza') {
        router.push('/fuliza')
      } else {
        router.push('/quick-loans') 
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-900 selection:text-white">
      
      {/* --- SYSTEM STATUS BAR --- */}
      <div className="bg-slate-900 text-slate-400 py-1.5 px-4 text-[10px] font-mono border-b border-slate-800">
        <div className="container mx-auto flex justify-between items-center max-w-5xl">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-500 tracking-wider">SYSTEM ONLINE</span>
             </div>
             <div className="hidden sm:flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>API Latency: 45ms</span>
             </div>
          </div>
          <div key={boostIndex} className="flex items-center gap-2 font-mono">
             <span className="text-slate-500">LATEST:</span>
             <span className={`font-bold ${boosts[boostIndex].type === 'boost' ? 'text-blue-400' : 'text-emerald-400'}`}>
               {boosts[boostIndex].name} - {boosts[boostIndex].amount}
             </span>
          </div>
        </div>
      </div>

      {/* --- DENSE HEADER --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded bg-slate-900 flex items-center justify-center`}>
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
              FLUX<span className="text-blue-700">LOANS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('fuliza')} 
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${isFuliza ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Boost Limit
              </button>
              <button 
                onClick={() => setActiveTab('loan')} 
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${!isFuliza ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Quick Cash
              </button>
            </nav>
          </div>
          
          <div className="flex gap-2">
             <Link href="/quick-loans/track">
                <Button variant="outline" className="h-8 text-xs font-bold border-slate-300 text-slate-600 hidden sm:flex">
                   Track ID
                </Button>
             </Link>
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900 border border-slate-200 rounded">
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
             </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="container mx-auto px-4 max-w-5xl pb-12">
        
        {/* MOBILE TABS (VISIBLE ON SMALL SCREENS) */}
        <div className="md:hidden mt-4 mb-6">
            <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setActiveTab('fuliza')} className={`py-2 text-xs font-bold uppercase rounded ${isFuliza ? 'bg-white shadow text-blue-800' : 'text-slate-500'}`}>Fuliza Boost</button>
                <button onClick={() => setActiveTab('loan')} className={`py-2 text-xs font-bold uppercase rounded ${!isFuliza ? 'bg-white shadow text-emerald-800' : 'text-slate-500'}`}>Quick Loan</button>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start pt-6 md:pt-12">
            
            {/* LEFT COLUMN: THE FORM (UTILITY STYLE) */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <Card className="border-0 shadow-xl bg-white rounded-xl overflow-hidden ring-1 ring-slate-200">
                <div className={`h-2 w-full ${isFuliza ? 'bg-blue-700' : 'bg-emerald-700'}`}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <span className="text-sm font-black text-slate-900 uppercase block">
                            {isFuliza ? 'Limit Optimizer' : 'Loan Request'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">SECURE GATEWAY v4.2</span>
                    </div>
                    <Lock className="w-4 h-4 text-slate-400"/> 
                  </div>
                  
                  <div className="min-h-[220px]">
                      {/* FULIZA FORM */}
                      {isFuliza ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select M-Pesa Band</label>
                                <div className="relative">
                                    <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-4 h-12 bg-slate-50 border rounded-lg text-left transition-all ${isDropdownOpen ? 'border-blue-600 bg-white' : 'border-slate-200'}`}
                                    >
                                    <span className={`font-bold text-xs ${mpesaRange ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {mpesaRange ? [
                                        { value: 'low', label: 'KES 5k - 15k' },
                                        { value: 'mid', label: 'KES 15k - 50k' },
                                        { value: 'high', label: 'KES 50k - 150k' },
                                        { value: 'elite', label: 'Over KES 150k' }
                                        ].find(opt => opt.value === mpesaRange)?.label : 'Choose Range...'}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>
                                    
                                    {isDropdownOpen && (
                                    <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                        {[
                                        { value: 'low', label: 'KES 5k - 15k' },
                                        { value: 'mid', label: 'KES 15k - 50k' },
                                        { value: 'high', label: 'KES 50k - 150k' },
                                        { value: 'elite', label: 'Over KES 150k' }
                                        ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleRangeSelect(option.value)}
                                            className="w-full px-4 py-3 text-left hover:bg-slate-100 flex justify-between items-center border-b border-slate-50 last:border-0"
                                        >
                                            <span className="font-bold text-slate-700 text-xs">{option.label}</span>
                                            {mpesaRange === option.value && <Check className="h-3 w-3 text-blue-600" />}
                                        </button>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* PREDICTION BOX */}
                            {predictedLimit && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between animate-in zoom-in-95">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-700">
                                            <BarChart2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-bold text-blue-600 uppercase">Algorithm Estimate</div>
                                            <div className="text-sm font-black text-slate-900">KES {predictedLimit.max}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <Button
                                onClick={handleStart}
                                disabled={isLoading || !mpesaRange}
                                className={`w-full ${btnClass} text-white font-bold h-12 text-sm rounded-lg shadow-md mt-2`}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Analysis'}
                            </Button>
                        </div>
                      ) : (
                        /* LOAN FORM */
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                    Desired Amount
                                </label>
                                <div className="relative">
                                    <input
                                    type="text"
                                    placeholder="e.g. 5,000"
                                    value={loanAmount}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setLoanAmount(val ? Number(val).toLocaleString() : '');
                                    }}
                                    className="w-full pl-3 pr-10 h-12 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300 font-mono"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className="text-[10px] font-black text-slate-400">KES</span>
                                    </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                {['2,000', '5,000', '10,000'].map((amount) => (
                                  <button
                                    key={amount}
                                    onClick={() => setLoanAmount(amount)}
                                    className="py-2 text-[10px] font-bold rounded border border-slate-200 bg-white hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                                  >
                                    {amount}
                                  </button>
                                ))}
                              </div>
                            
                            <Button
                              onClick={handleStart}
                              disabled={isLoading || !loanAmount}
                              className={`w-full ${btnClass} text-white font-bold h-12 text-sm rounded-lg shadow-md mt-2`}
                            >
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Process Request'}
                            </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
                <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span><ShieldCheck className="w-3 h-3 inline mr-1" /> Verified</span>
                    <span><Clock className="w-3 h-3 inline mr-1" /> 24/7 Instant</span>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN: THE PITCH (DENSE) */}
            <div className="lg:col-span-7 order-1 lg:order-2 pt-4">
                <div className="mb-6">
                    <span className={`inline-block px-2 py-1 mb-3 rounded text-[10px] font-black uppercase tracking-widest ${isFuliza ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {isFuliza ? 'CRB OPTIMIZATION' : 'DIRECT DISBURSEMENT'}
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
                        {isFuliza ? 'Unlock Your Real Limit.' : 'Liquidity on Demand.'}
                    </h1>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md">
                        {isFuliza 
                            ? "Stop settling for low overdrafts. Our algorithm scans your entire M-Pesa history to calculate and activate your true credit potential."
                            : "Business opportunity? Emergency? Get cash in your M-Pesa within 60 seconds. No paperwork. No guarantors. Just data."
                        }
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-lg">
                    {[
                        { label: "Processing", val: "Instant" },
                        { label: "Success Rate", val: "99.4%" },
                        { label: "Security", val: "AES-256" },
                        { label: "Active Users", val: "50k+" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-3 rounded-lg">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</div>
                            <div className="text-lg font-black text-slate-900">{stat.val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- LIVE TABLE SECTION --- */}
        <section className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">Live Transaction Feed</h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-xs">
                            {[
                                { time: 'Just now', type: 'Loan', amt: 'KES 8,500', status: 'PAID' },
                                { time: '1 min ago', type: 'Boost', amt: 'KES 45,000', status: 'ACTIVE' },
                                { time: '2 mins ago', type: 'Loan', amt: 'KES 3,500', status: 'PAID' },
                                { time: '4 mins ago', type: 'Boost', amt: 'KES 12,000', status: 'ACTIVE' },
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-3 text-slate-500">{row.time}</td>
                                    <td className="px-4 py-3 font-bold text-slate-700">{row.type}</td>
                                    <td className="px-4 py-3 font-black text-slate-900">{row.amt}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                            <Check className="w-2 h-2" /> {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
                <div className="text-white font-black text-lg mb-2 uppercase tracking-tight">Flux Loans</div>
                <p className="max-w-xs leading-relaxed opacity-70">
                    Advanced algorithmic financial tools for the modern Kenyan economy. Unlocking liquidity through data.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase mb-4">Platform</h4>
                <ul className="space-y-2">
                    <li><Link href="/fuliza" className="hover:text-white">Fuliza Optimizer</Link></li>
                    <li><Link href="/quick-loans" className="hover:text-white">Quick Loans</Link></li>
                    <li><Link href="/quick-loans/track" className="hover:text-white">Track Application</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase mb-4">Legal</h4>
                <ul className="space-y-2">
                    <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-white">CRB Disclosure</Link></li>
                </ul>
            </div>
        </div>
      </footer>
    </div>
  )
}