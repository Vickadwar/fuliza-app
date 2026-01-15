'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  Zap, 
  Menu, 
  X, 
  Banknote,
  Lock,
  ChevronDown,
  Sparkles,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Star,
  Users,
  Clock,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('fuliza')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Form States
  const [mpesaRange, setMpesaRange] = useState('') 
  const [predictedLimit, setPredictedLimit] = useState<{ min: string, max: string } | null>(null)
  const [loanAmount, setLoanAmount] = useState('')

  // Live Ticker Data
  const [boostIndex, setBoostIndex] = useState(0)
  const boosts = [
    { name: 'Sarah M.', amount: '+ Ksh 15,000', type: 'Fuliza' },
    { name: 'David K.', amount: 'Ksh 24,000', type: 'Loan' },
    { name: 'John O.', amount: '+ Ksh 45,000', type: 'Fuliza' },
    { name: 'Peter W.', amount: 'Ksh 8,500', type: 'Loan' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setBoostIndex((prev) => (prev + 1) % boosts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [boosts.length])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setMpesaRange('')
    setPredictedLimit(null)
    setLoanAmount('')
    setIsDropdownOpen(false)
  }

  const handleRangeSelect = (value: string) => {
    setMpesaRange(value)
    setIsDropdownOpen(false)
    
    const limits: Record<string, { min: string, max: string }> = {
      'low': { min: '2,500', max: '4,500' },
      'mid': { min: '7,500', max: '12,000' },
      'high': { min: '25,000', max: '45,000' },
      'elite': { min: '80,000', max: '150,000' }
    }
    
    if (limits[value]) {
      setPredictedLimit(limits[value])
    }
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      if (activeTab === 'fuliza') {
        router.push('/fuliza')
      } else {
        let finalAmount = Number(loanAmount) || 0
        if (finalAmount < 500) finalAmount = 500
        router.push(`/quick-loans?amount=${finalAmount}`) 
      }
    }, 800)
  }

  const mpesaOptions = [
    { value: 'low', label: 'Ksh 5,000 - 15,000' },
    { value: 'mid', label: 'Ksh 15,000 - 50,000' },
    { value: 'high', label: 'Ksh 50,000 - 150,000' },
    { value: 'elite', label: 'Above Ksh 150,000' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- LIVE TICKER (Compact) --- */}
      <div className="bg-slate-900 text-white py-2 px-4 shadow-sm z-50 relative">
        <div className="container mx-auto flex justify-between items-center max-w-md md:max-w-5xl">
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-bold opacity-80">Live</span>
          </div>
          
          {/* UPDATED: Optimized max-w class */}
          <div className="relative overflow-hidden w-full max-w-50 h-5 flex flex-col justify-center items-end">
            <div key={boostIndex} className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-500">
               <span className="font-medium text-[10px] text-slate-300">{boosts[boostIndex].name}</span>
               <span className="text-[10px] font-bold text-emerald-400">
                 {boosts[boostIndex].amount}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Header (Sticky) --- */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-blue-600 fill-current" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">
              FulizaBoost
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4 text-xs font-bold text-slate-600">
              <Link href="/fuliza" className="hover:text-blue-600 transition-colors">Fuliza boost</Link>
              <Link href="/quick-loans" className="hover:text-blue-600 transition-colors">Quick cash</Link>
            </nav>
            <Button onClick={() => window.scrollTo(0,0)} className="bg-slate-900 h-9 px-4 text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
              Get started
            </Button>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-700">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white md:hidden pt-20 px-4 animate-in fade-in slide-in-from-top-5">
            <nav className="space-y-3">
              <button onClick={() => { router.push('/fuliza'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-4 rounded-xl bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Zap className="h-4 w-4 fill-current" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-sm text-slate-900 block">Fuliza boost</span>
                    <span className="text-[10px] text-slate-500 font-medium">Increase your limit</span>
                </div>
              </button>
              <button onClick={() => { router.push('/quick-loans'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-4 rounded-xl bg-slate-50 border border-slate-100 active:scale-95 transition-transform">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Banknote className="h-4 w-4" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-sm text-slate-900 block">Quick cash</span>
                    <span className="text-[10px] text-slate-500 font-medium">Instant M-Pesa loans</span>
                </div>
              </button>
            </nav>
        </div>
      )}

      {/* --- Hero Section (Compact) --- */}
      <main className="container mx-auto px-4 max-w-5xl">
        <section className="pt-6 pb-8 md:pt-12 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
               <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold">
                  <Sparkles className="h-3 w-3 fill-current" />
                  <span>AI powered finance</span>
                </div>
              
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.1] mb-3">
                We grow your <br />
                <span className="text-blue-600">M-Pesa limits.</span>
              </h1>
              
              <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto lg:mx-0 mb-6 leading-relaxed">
                Use your transaction history to unlock higher Fuliza limits or access instant cash loans.
              </p>
              
              <div className="flex justify-center lg:justify-start gap-6 border-t border-slate-100 pt-4">
                 <div className="text-left">
                    <div className="text-xl font-black text-slate-900 flex items-center gap-1">
                        98%
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Approval rate</div>
                 </div>
                 <div className="text-left">
                    <div className="text-xl font-black text-slate-900 flex items-center gap-1">
                        15s
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Avg. speed</div>
                 </div>
              </div>
            </div>
            
            {/* Interactive Card (Matching Inner Pages) */}
            <div className="w-full max-w-sm mx-auto order-1 lg:order-2 perspective-1000">
              <Card className="border-0 shadow-xl shadow-slate-200 bg-white rounded-xl overflow-visible ring-1 ring-slate-100 relative z-20">
                <CardHeader className="pb-0 pt-5 px-5">
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-base font-black text-slate-900">
                      Check eligibility
                    </CardTitle>
                    <div className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-lg">
                      <Lock className="w-3 h-3"/> Secure
                    </div>
                  </div>
                  
                  <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-100 p-1 rounded-lg">
                      <TabsTrigger value="fuliza" className="text-xs font-bold rounded-md">Fuliza boost</TabsTrigger>
                      <TabsTrigger value="loan" className="text-xs font-bold rounded-md">Quick cash</TabsTrigger>
                    </TabsList>

                    <div className="mt-5">
                      {/* Fuliza Tab */}
                      <TabsContent value="fuliza" className="space-y-3 mt-0 overflow-visible">
                        <div className="relative">
                          <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase">
                            Monthly M-Pesa usage
                          </label>
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full flex items-center justify-between px-3 h-12 bg-white border rounded-xl text-left transition-all ${isDropdownOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}
                          >
                            <span className={`font-bold text-sm ${mpesaRange ? 'text-slate-900' : 'text-slate-400'}`}>
                              {mpesaRange ? mpesaOptions.find(opt => opt.value === mpesaRange)?.label : 'Select range...'}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* UPDATED: Optimized max-h class */}
                          {isDropdownOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-62.5 overflow-y-auto p-1 animate-in fade-in zoom-in-95">
                              {mpesaOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleRangeSelect(option.value)}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg flex justify-between items-center"
                                >
                                  <span className="font-bold text-slate-700 text-sm">{option.label}</span>
                                  {mpesaRange === option.value && <Check className="h-4 w-4 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Prediction Result */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden ${predictedLimit ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center">
                              <div className="text-[10px] font-bold text-blue-500 uppercase mb-1">Estimated new limit</div>
                              <div className="flex items-center justify-center gap-2">
                                  <span className="text-sm font-bold text-slate-400">KES {predictedLimit?.min}</span>
                                  <span className="text-slate-300">-</span>
                                  <span className="text-xl font-black text-blue-600">KES {predictedLimit?.max}</span>
                              </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !mpesaRange}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 text-sm rounded-xl shadow-lg shadow-blue-500/20 mt-1"
                        >
                          {isLoading ? 'Analyzing...' : 'Boost my limit'}
                        </Button>
                      </TabsContent>
                      
                      {/* Loan Tab */}
                      <TabsContent value="loan" className="space-y-3 mt-0">
                         <div className="relative group">
                            <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase">
                                I want to borrow
                            </label>
                            <div className="relative">
                                <input
                                type="number"
                                placeholder="e.g. 5,000"
                                min="500"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="w-full pl-4 pr-12 h-12 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300 transition-all"
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
                                onClick={() => setLoanAmount(amount.replace(',', ''))}
                                className="py-2 text-xs font-bold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !loanAmount || Number(loanAmount) < 500}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-12 text-sm rounded-xl shadow-lg shadow-emerald-500/20 mt-1 disabled:opacity-50"
                        >
                          {isLoading ? 'Processing...' : 'Get cash now'}
                        </Button>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardHeader>
                  
                <CardContent className="px-5 pb-5 pt-2">
                   <div className="flex justify-center items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-50 py-2 rounded-lg">
                      <Lock className="w-3 h-3"/> 
                      <span>256-bit bank grade security</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Trust Badges (Compact) --- */}
        <section className="py-6 border-t border-slate-100">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                  { icon: ShieldCheck, title: "CRB certified", desc: "Official partner" },
                  { icon: Users, title: "50k+ users", desc: "Trusted in Kenya" },
                  { icon: Clock, title: "Instant", desc: "24/7 processing" },
                  { icon: Star, title: "4.9/5", desc: "User rating" },
              ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
                          <badge.icon className="w-4 h-4" />
                      </div>
                      <div>
                          <div className="font-bold text-slate-900 text-xs">{badge.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{badge.desc}</div>
                      </div>
                  </div>
              ))}
           </div>
        </section>

        {/* --- Fuliza Marketing Section (Compact) --- */}
        <section className="py-10">
            <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Fuliza boost</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
                            Hit your limit? <br/>
                            <span className="text-blue-400">Break through it.</span>
                        </h2>
                        <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">
                            Our algorithmic review checks your M-Pesa history to safely override and increase your overdraft capacity instantly.
                        </p>
                        <Button onClick={() => router.push('/fuliza')} className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-0.5">
                            Check my new limit
                        </Button>
                    </div>
                    
                    {/* Visual Graphic */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm relative">
                        <div className="flex justify-between items-end pb-3 border-b border-white/10 mb-3">
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Current limit</div>
                                <div className="text-xl font-bold text-slate-500 line-through">KES 500</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-blue-400 uppercase font-bold mb-1">New limit</div>
                                <div className="text-3xl font-black text-white">KES 5,500</div>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            *Based on typical regular user activity
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- Loan Marketing Section (Compact) --- */}
        <section className="py-8 border-t border-slate-100">
             <div className="grid md:grid-cols-2 gap-8 items-center">
                 {/* Visual */}
                 <div className="order-2 md:order-1 bg-emerald-50 rounded-xl p-6">
                     <div className="space-y-3">
                        {[
                            { name: 'Rent Payment', amount: 'KES 15,000' },
                            { name: 'School Fees', amount: 'KES 24,500' },
                        ].map((tx, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{tx.name}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sent just now</div>
                                    </div>
                                </div>
                                <div className="font-black text-slate-900 text-sm">{tx.amount}</div>
                            </div>
                        ))}
                     </div>
                 </div>

                 {/* Text */}
                 <div className="order-1 md:order-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Banknote className="w-3 h-3" />
                        <span>Quick cash</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black mb-4 text-slate-900 leading-tight">
                        Instant M-Pesa cash.
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed">
                        Emergency? Business deal? Get instant unsecured loans directly to your M-Pesa. Low interest rates and flexible repayment.
                    </p>
                    <Button onClick={() => router.push('/quick-loans')} className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20">
                        Get cash now
                    </Button>
                 </div>
             </div>
        </section>

      </main>

      {/* --- Footer (Compact) --- */}
      <footer className="bg-white py-8 border-t border-slate-100 mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-lg font-black text-slate-900">FulizaBoost</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                  The #1 Financial Algorithmic Tool in Kenya. Unlock the true potential of your mobile money profile.
                </p>
            </div>
            
            <div className="space-y-3">
               <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Legal</h4>
               {/* UPDATED: Links now point to /legal */}
               <ul className="space-y-2 text-[10px] text-slate-500 font-bold">
                 <li><Link href="/legal" className="hover:text-blue-600 transition-colors">Privacy policy</Link></li>
                 <li><Link href="/legal" className="hover:text-blue-600 transition-colors">Terms of service</Link></li>
               </ul>
            </div>

            <div className="space-y-3">
               <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Support</h4>
               {/* UPDATED: Links now point to /contact */}
               <ul className="space-y-2 text-[10px] text-slate-500 font-bold">
                 <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Help center</Link></li>
                 <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact us</Link></li>
               </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-slate-400 font-bold">&copy; 2026 FulizaBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}