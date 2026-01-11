'use client'

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
  TrendingUp
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
    { name: 'Sarah M.', amount: '+ Ksh 15,000' },
    { name: 'David K.', amount: '+ Ksh 24,000' },
    { name: 'John O.', amount: '+ Ksh 45,000' },
    { name: 'Peter W.', amount: '+ Ksh 8,500' }
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
    
    // Quick validation for Loan Tab
    if (activeTab === 'loan') {
        const amount = Number(loanAmount)
        if (!amount || amount < 500) {
            // If they try to proceed with < 500, we just set it to 500 or alert. 
            // For smoother UI, we'll just not proceed or default to 500 in the push.
            if(amount < 500 && amount > 0) {
                 // optionally alert user
            }
        }
    }

    setIsLoading(true)
    setTimeout(() => {
      if (activeTab === 'fuliza') {
        router.push('/fuliza')
      } else {
        // Enforce min 500 for URL
        let finalAmount = Number(loanAmount)
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
      
      {/* --- LIVE TICKER --- */}
      <div className="bg-slate-900 text-white py-3 px-4 shadow-md z-50 relative">
        <div className="container mx-auto flex justify-between items-center max-w-md md:max-w-5xl">
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-70">Live Boosts</span>
          </div>
          
          <div className="relative overflow-hidden w-full max-w-[200px] h-6 flex flex-col justify-center items-end">
            <div 
               key={boostIndex}
               className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-500"
            >
               <span className="font-semibold text-sm md:text-base text-slate-200">{boosts[boostIndex].name}</span>
               <span className="font-black text-sm md:text-base text-emerald-400 bg-white/10 px-2 rounded">
                 {boosts[boostIndex].amount}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-blue-500/20 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              FulizaBoost
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-5 text-sm font-bold text-slate-600">
              <Link href="/fuliza" className="hover:text-blue-600">Fuliza Boost</Link>
              <Link href="/quick-loans" className="hover:text-blue-600">Quick Cash</Link>
            </nav>
            <Button className="bg-slate-900 h-9 px-6 text-xs font-bold rounded-lg hover:scale-105 transition-all">
              Start
            </Button>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1">
            {isMenuOpen ? <X className="h-6 w-6 text-slate-800" /> : <Menu className="h-6 w-6 text-slate-800" />}
          </button>
        </div>
      </header>

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white md:hidden pt-24 px-4 animate-in fade-in slide-in-from-top-5">
            <nav className="space-y-3">
              <button onClick={() => { router.push('/fuliza'); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-4 rounded-xl bg-blue-50 border border-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-lg text-slate-900">Fuliza Boost</span>
              </button>
              <button onClick={() => { router.push('/quick-loans'); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <Banknote className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-lg text-slate-900">Quick Cash</span>
              </button>
            </nav>
        </div>
      )}

      {/* --- Main Section --- */}
      <main className="container mx-auto px-4 max-w-5xl">
        <section className="pt-4 pb-8 md:pt-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
               <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 fill-current" />
                  <span>AI Analysis 2.0</span>
                </div>
              
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-3">
                Increase M-Pesa. <br />
                <span className="text-blue-600">Fuliza Limit.</span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xs mx-auto lg:mx-0 mb-4">
                Unlock higher Fuliza limits instantly using your transaction history.
              </p>
              
              <div className="flex justify-center lg:justify-start gap-8 border-t border-slate-100 pt-3">
                 <div>
                    <div className="text-lg font-black text-slate-900">98%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Approval</div>
                 </div>
                 <div>
                    <div className="text-lg font-black text-slate-900">15s</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Speed</div>
                 </div>
              </div>
            </div>
            
            {/* Interactive Card */}
            <div className="w-full max-w-sm mx-auto order-1 lg:order-2">
              {/* NOTE: 'overflow-visible' added here to allow dropdown to spill out */}
              <Card className="border-0 shadow-xl shadow-slate-200 bg-white rounded-2xl overflow-visible ring-1 ring-slate-100 relative z-20">
                <CardHeader className="pb-0 pt-4 px-4">
                  <div className="flex justify-between items-center mb-3">
                    <CardTitle className="text-base font-black text-slate-900">
                      Check Your Limit
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 border-slate-200">
                      <Lock className="w-2.5 h-2.5 mr-1"/> Private
                    </Badge>
                  </div>
                  
                  <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 h-9 bg-slate-100 p-1 rounded-lg">
                      <TabsTrigger value="fuliza" className="text-xs font-bold">Fuliza Boost</TabsTrigger>
                      <TabsTrigger value="loan" className="text-xs font-bold">Quick Cash</TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                      {/* Fuliza Tab */}
                      {/* NOTE: overflow-visible on content to allow dropdown spill */}
                      <TabsContent value="fuliza" className="space-y-3 mt-0 overflow-visible">
                        <div className="relative">
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block uppercase">
                            Monthly M-Pesa Range
                          </label>
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full flex items-center justify-between p-3 bg-white border rounded-xl text-left ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-200'}`}
                          >
                            <span className={`font-bold text-sm ${mpesaRange ? 'text-slate-900' : 'text-slate-400'}`}>
                              {mpesaRange ? mpesaOptions.find(opt => opt.value === mpesaRange)?.label : 'Select Range...'}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* DROPDOWN: Absolute positioned, high Z-index, scrolling enabled */}
                          {isDropdownOpen && (
                            <div className="absolute top-full mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                              {mpesaOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleRangeSelect(option.value)}
                                  className="w-full p-3 text-left hover:bg-blue-50 border-b border-slate-50 last:border-0 flex justify-between items-center"
                                >
                                  <span className="font-bold text-slate-800 text-sm">{option.label}</span>
                                  {mpesaRange === option.value && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Prediction Result */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden ${predictedLimit ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-1">
                                  <TrendingUp className="w-3 h-3 text-blue-600" />
                                  <span className="text-[10px] font-bold text-blue-700 uppercase">Estimated Boost</span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                  <span className="text-lg font-bold text-slate-900">KES {predictedLimit?.min}</span>
                                  <span className="text-xs text-slate-400">-</span>
                                  <span className="text-2xl font-black text-blue-600">KES {predictedLimit?.max}</span>
                              </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !mpesaRange}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 text-base rounded-xl shadow-lg shadow-blue-500/20 mt-1"
                        >
                          {isLoading ? 'Analyzing...' : 'Boost Limit'}
                        </Button>
                      </TabsContent>
                      
                      {/* Loan Tab */}
                      <TabsContent value="loan" className="space-y-3 mt-0">
                         <div className="relative group">
                            <input
                              type="number"
                              placeholder="Min KES 500"
                              min="500"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              className="w-full pl-3 pr-10 h-11 bg-emerald-50/50 border border-emerald-100 focus:border-emerald-500 rounded-xl text-lg font-bold text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            <div className="absolute right-3 top-3 pointer-events-none">
                              <span className="text-[10px] font-bold text-emerald-700">KES</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {['2,000', '5,000', '10,000'].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setLoanAmount(amount.replace(',', ''))}
                                className="py-1.5 text-xs font-bold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        
                        <Button
                          onClick={handleStart}
                          // Disable if amount is less than 500
                          disabled={isLoading || !loanAmount || Number(loanAmount) < 500}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold h-11 text-base rounded-xl shadow-lg shadow-emerald-500/20 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Processing...' : 'Get Cash'}
                        </Button>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardHeader>
                  
                <CardContent className="px-4 pb-4 pt-2">
                   <div className="flex justify-center items-center gap-1 text-[10px] text-slate-400 font-medium">
                      <Lock className="w-2.5 h-2.5"/> 
                      <span>Bank-Grade Encryption</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Features --- */}
        <section className="pb-8">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {[
              { label: 'Connect', icon: Smartphone, bg: 'bg-blue-50', text: 'text-blue-600' },
              { label: 'Analyze', icon: Sparkles, bg: 'bg-violet-50', text: 'text-violet-600' },
              { label: 'Receive', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-1 shadow-sm">
                <div className={`h-8 w-8 rounded-full ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`h-4 w-4 ${item.text}`} />
                </div>
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white py-10 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-lg font-black text-slate-900">FulizaBoost</span>
                </div>
                <p className="text-sm text-slate-500 max-w-xs">
                  Financial freedom at your fingertips. Instant processing, secure data, and real results.
                </p>
            </div>
            
            <div className="space-y-3">
               <h4 className="font-bold text-slate-900 text-sm">Legal</h4>
               <ul className="space-y-2 text-xs text-slate-500 font-medium">
                 <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
                 <li><Link href="#" className="hover:text-blue-600">Terms of Service</Link></li>
                 <li><Link href="#" className="hover:text-blue-600">Cookie Policy</Link></li>
               </ul>
            </div>

            <div className="space-y-3">
               <h4 className="font-bold text-slate-900 text-sm">Support</h4>
               <ul className="space-y-2 text-xs text-slate-500 font-medium">
                 <li><Link href="#" className="hover:text-blue-600">Help Center</Link></li>
                 <li><Link href="#" className="hover:text-blue-600">Contact Us</Link></li>
                 <li><Link href="#" className="hover:text-blue-600">FAQs</Link></li>
               </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-slate-400 font-medium">&copy; 2024 FulizaBoost. All rights reserved.</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>Licensed & Secure Provider</span>
              </div>
          </div>
        </div>
      </footer>
    </div>
  )
}