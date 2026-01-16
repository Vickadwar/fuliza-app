'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Zap, 
  Menu, 
  X, 
  Banknote,
  Lock,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  Check
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
  const themeClass = isFuliza ? 'text-blue-600' : 'text-emerald-500';
  const btnClass = isFuliza ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-500 hover:bg-emerald-600';

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
        let finalAmount = Number(loanAmount.replace(/,/g, '')) || 0
        if (finalAmount < 500) finalAmount = 500
        router.push(`/quick-loans?amount=${finalAmount}`) 
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- LIVE TICKER --- */}
      <div className="bg-slate-900 text-white py-2 px-4 relative z-50">
        <div className="container mx-auto flex justify-between items-center max-w-5xl">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
             <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Live Activity</span>
          </div>
          <div key={boostIndex} className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-500">
             <span className="text-[10px] font-medium text-slate-300">{boosts[boostIndex].name}</span>
             <span className={`text-[10px] font-bold ${boosts[boostIndex].type === 'boost' ? 'text-blue-400' : 'text-emerald-400'}`}>
               {boosts[boostIndex].amount}
             </span>
          </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="glass-header transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors duration-500 ${isFuliza ? 'bg-blue-600' : 'bg-emerald-500'}`}>
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              FulizaBoost
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs font-bold text-slate-600">
              <button onClick={() => setActiveTab('fuliza')} className={`transition-colors ${isFuliza ? 'text-blue-600' : 'hover:text-blue-600'}`}>Boost Limit</button>
              <button onClick={() => setActiveTab('loan')} className={`transition-colors ${!isFuliza ? 'text-emerald-600' : 'hover:text-emerald-600'}`}>Quick Cash</button>
            </nav>
            <Button className="bg-slate-900 h-9 px-5 text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
              Login
            </Button>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-in fade-in slide-in-from-top-5">
            <nav className="space-y-4">
              <button onClick={() => { setActiveTab('fuliza'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Zap className="h-5 w-5 fill-current" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-base text-slate-900 block">Fuliza Boost</span>
                    <span className="text-xs text-slate-500 font-medium">Increase overdraft limit</span>
                </div>
              </button>
              <button onClick={() => { setActiveTab('loan'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Banknote className="h-5 w-5" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-base text-slate-900 block">Quick Cash</span>
                    <span className="text-xs text-slate-500 font-medium">Instant M-Pesa loans</span>
                </div>
              </button>
            </nav>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <main className="container mx-auto px-4 max-w-5xl">
        <section className="pt-8 pb-12 md:pt-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            
            {/* Dynamic Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1 animate-in slide-in-from-left-4 duration-700">
               <div className={`inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${isFuliza ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                  <Sparkles className="h-3 w-3 fill-current" />
                  <span>AI Powered Finance</span>
                </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
                {isFuliza ? (
                  <>Grow your <span className="text-blue-600">Fuliza Limit</span> instantly.</>
                ) : (
                  <>Get instant <span className="text-emerald-500">M-Pesa Cash</span> loans.</>
                )}
              </h1>
              
              <p className="text-base text-slate-500 font-medium max-w-sm mx-auto lg:mx-0 mb-8 leading-relaxed">
                {isFuliza 
                  ? "Our algorithm analyzes your transaction history to unlock higher overdraft limits in seconds. Safe, secure, and automated."
                  : "Emergency? Business deal? Access unsecured mobile loans directly to your M-Pesa. No paperwork, just instant disbursement."
                }
              </p>
              
              <div className="flex justify-center lg:justify-start gap-8 border-t border-slate-100 pt-6">
                 <div>
                    <div className="text-2xl font-black text-slate-900">98%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Success Rate</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-slate-900">15s</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Processing</div>
                 </div>
                 <div>
                    <div className="text-2xl font-black text-slate-900">50k+</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Users</div>
                 </div>
              </div>
            </div>
            
            {/* Interactive Card */}
            <div className="w-full max-w-md mx-auto order-1 lg:order-2 perspective-1000">
              <Card className="border-0 shadow-2xl shadow-slate-200 bg-white rounded-3xl overflow-visible ring-1 ring-slate-100 relative z-20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base font-black text-slate-900">Check Eligibility</span>
                    <div className="flex items-center gap-1.5 text-[10px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3"/> Bank Grade Security
                    </div>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 p-1 rounded-xl mb-6">
                      <TabsTrigger value="fuliza" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">Fuliza Boost</TabsTrigger>
                      <TabsTrigger value="loan" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all">Quick Cash</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[220px]">
                      {/* FULIZA FORM */}
                      <TabsContent value="fuliza" className="space-y-4 mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg. Monthly M-Pesa Usage</label>
                          <div className="relative">
                            <button
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className={`w-full flex items-center justify-between px-4 h-14 bg-white border rounded-xl text-left transition-all hover:border-blue-400 ${isDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}
                            >
                              <span className={`font-bold text-sm ${mpesaRange ? 'text-slate-900' : 'text-slate-400'}`}>
                                {mpesaRange ? [
                                  { value: 'low', label: 'Ksh 5,000 - 15,000' },
                                  { value: 'mid', label: 'Ksh 15,000 - 50,000' },
                                  { value: 'high', label: 'Ksh 50,000 - 150,000' },
                                  { value: 'elite', label: 'Above Ksh 150,000' }
                                ].find(opt => opt.value === mpesaRange)?.label : 'Select range...'}
                              </span>
                              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                              <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 p-1">
                                {[
                                  { value: 'low', label: 'Ksh 5,000 - 15,000' },
                                  { value: 'mid', label: 'Ksh 15,000 - 50,000' },
                                  { value: 'high', label: 'Ksh 50,000 - 150,000' },
                                  { value: 'elite', label: 'Above Ksh 150,000' }
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => handleRangeSelect(option.value)}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-50 rounded-lg flex justify-between items-center group"
                                  >
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-blue-700">{option.label}</span>
                                    {mpesaRange === option.value && <Check className="h-4 w-4 text-blue-600" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PREDICTION BOX */}
                        <div className={`transition-all duration-500 ease-out overflow-hidden ${predictedLimit ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                  <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold text-blue-500 uppercase">Estimated Limit</div>
                                  <div className="text-base font-black text-slate-900">KES {predictedLimit?.max}</div>
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-blue-300" />
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !mpesaRange}
                          className={`w-full ${btnClass} text-white font-bold h-14 text-base rounded-xl shadow-lg mt-2 transition-transform active:scale-95`}
                        >
                          {isLoading ? 'Analyzing Profile...' : 'Boost My Limit'}
                        </Button>
                      </TabsContent>
                      
                      {/* LOAN FORM */}
                      <TabsContent value="loan" className="space-y-4 mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                I want to borrow
                            </label>
                            <div className="relative group">
                                <input
                                type="text"
                                placeholder="e.g. 5,000"
                                value={loanAmount}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setLoanAmount(val ? Number(val).toLocaleString() : '');
                                }}
                                className="w-full pl-4 pr-12 h-14 bg-white border border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300 transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <span className="text-xs font-black text-slate-400">KES</span>
                                </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {['2,000', '5,000', '10,000'].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setLoanAmount(amount)}
                                className="py-2.5 text-xs font-bold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !loanAmount}
                          className={`w-full ${btnClass} text-white font-bold h-14 text-base rounded-xl shadow-lg mt-2 transition-transform active:scale-95`}
                        >
                          {isLoading ? 'Processing...' : 'Get Cash Now'}
                        </Button>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- DYNAMIC MARKETING SECTION --- */}
        <section className="py-10 transition-all duration-500">
            {isFuliza ? (
                // FULIZA CONTENT
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-4">
                                <Zap className="w-4 h-4 fill-current" />
                                <span>Fuliza Optimization</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                                Hit your limit? <br/>
                                <span className="text-blue-500">Break through it.</span>
                            </h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-300 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>Algorithmic limit override</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    <span>24/7 Automatic processing</span>
                                </li>
                            </ul>
                            <Button onClick={() => router.push('/fuliza')} className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-1 shadow-xl shadow-blue-600/20">
                                Check My New Limit
                            </Button>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">Fuliza Limit</div>
                                        <div className="text-xs text-slate-400">Updated just now</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Active</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Old Limit</div>
                                    <div className="text-xl font-bold text-slate-500 line-through">KES 500</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-blue-400 uppercase font-bold mb-1">New Limit</div>
                                    <div className="text-4xl font-black text-white">KES 5,500</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // LOAN CONTENT
                <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                     <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                         <div className="order-2 md:order-1">
                             <div className="space-y-4">
                                {[
                                    { name: 'Rent Payment', amount: 'KES 15,000', time: '1 min ago' },
                                    { name: 'School Fees', amount: 'KES 24,500', time: '5 mins ago' },
                                    { name: 'Emergency', amount: 'KES 8,000', time: '12 mins ago' },
                                ].map((tx, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex justify-between items-center transform hover:scale-105 transition-transform duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{tx.name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">{tx.time}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-slate-900">{tx.amount}</div>
                                    </div>
                                ))}
                             </div>
                         </div>

                         <div className="order-1 md:order-2">
                            <div className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs mb-4">
                                <Banknote className="w-4 h-4" />
                                <span>Instant Liquidity</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-slate-900">
                                Cash in your <br/>
                                <span className="text-emerald-500">M-Pesa. Now.</span>
                            </h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Get unsecured loans up to KES 150,000 disbursed directly to your M-Pesa in under 60 seconds.
                            </p>
                            <Button onClick={() => router.push('/quick-loans')} className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-1 shadow-xl shadow-emerald-500/20">
                                Get Cash Now
                            </Button>
                         </div>
                     </div>
                </div>
            )}
        </section>

        {/* --- TRUST SIGNALS --- */}
        <section className="py-12 border-t border-slate-200/60">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                  { icon: ShieldCheck, title: "CRB Certified", desc: "Regulated Partner" },
                  { icon: Users, title: "50,000+", desc: "Active Users" },
                  { icon: Clock, title: "Instant", desc: "24/7 Processing" },
                  { icon: Star, title: "4.9/5", desc: "Customer Rating" },
              ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 mb-3">
                          <badge.icon className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-slate-900 text-sm mb-1">{badge.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{badge.desc}</div>
                  </div>
              ))}
           </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-12 mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 pr-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 bg-slate-900 rounded-xl flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-black text-slate-900">FulizaBoost</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                  The #1 Financial Algorithmic Tool in Kenya. Unlock the true potential of your mobile money profile.
                </p>
            </div>
            
            <div className="space-y-4">
               <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Legal</h4>
               <ul className="space-y-3 text-xs text-slate-500 font-medium">
                 <li><Link href="/legal" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                 <li><Link href="/legal" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
               </ul>
            </div>

            <div className="space-y-4">
               <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Support</h4>
               <ul className="space-y-3 text-xs text-slate-500 font-medium">
                 <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                 <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
               </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-slate-400 font-bold">&copy; 2026 FulizaBoost Analytics Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}