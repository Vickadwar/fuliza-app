'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Menu, 
  X, 
  Banknote,
  Lock,
  ChevronDown,
  Sparkles,
  BarChart3,
  Smartphone,
  RefreshCw
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
  
  // FIX: State for Session ID to prevent Hydration Error
  const [sessionId, setSessionId] = useState('')

  // Form States
  const [mpesaRange, setMpesaRange] = useState('') 
  const [predictedLimit, setPredictedLimit] = useState<{ min: string, max: string } | null>(null)
  const [loanAmount, setLoanAmount] = useState('')

  // Generate Session ID only on Client Side
  useEffect(() => {
    setSessionId(Math.random().toString(36).substr(2, 6).toUpperCase())
  }, [])

  // Auto-Clear Logic: Reset forms when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setMpesaRange('')
    setPredictedLimit(null)
    setLoanAmount('')
    setIsDropdownOpen(false)
    // Regenerate session ID on tab switch for effect
    setSessionId(Math.random().toString(36).substr(2, 6).toUpperCase())
  }

  // Fuliza Logic Calculator
  const handleRangeSelect = (value: string) => {
    setMpesaRange(value)
    setIsDropdownOpen(false)
    
    // Simulate logic calculation based on range
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
        router.push('/quick-loans') 
      }
    }, 800)
  }

  const mpesaOptions = [
    { value: 'low', label: 'Ksh 5,000 - 15,000', description: 'Casual User' },
    { value: 'mid', label: 'Ksh 15,000 - 50,000', description: 'Active User' },
    { value: 'high', label: 'Ksh 50,000 - 150,000', description: 'Power User' },
    { value: 'elite', label: 'Above Ksh 150,000', description: 'Elite Tier' }
  ]

  // Live Ticker State
  const [recentBoost, setRecentBoost] = useState({ name: 'David K.', amount: 'Ksh 24,000' })
  useEffect(() => {
    const boosts = [
      { name: 'Sarah M.', amount: 'Ksh 15,000' },
      { name: 'John O.', amount: 'Ksh 45,000' },
      { name: 'Peter W.', amount: 'Ksh 8,500' }
    ]
    let i = 0
    const interval = setInterval(() => {
      setRecentBoost(boosts[i])
      i = (i + 1) % boosts.length
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* --- Mobile-First Status Bar --- */}
      <div className="bg-indigo-950 text-white text-xs py-2 px-3 relative z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wide text-indigo-100">SYSTEM ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] xs:text-xs font-medium bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
             <Sparkles className="h-3 w-3 text-emerald-400" />
            <span className="hidden xs:inline text-indigo-200">RECENT:</span>
            <span className="text-white">{recentBoost.name}</span>
            <span className="text-emerald-400 font-bold">+{recentBoost.amount}</span>
          </div>
        </div>
      </div>

      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-lg md:text-xl font-black tracking-tight text-slate-900 block">
                  LimitBoost
                </span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link href="/fuliza" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Fuliza Boost
                </Link>
                <Link href="/quick-loans" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Quick Cash
                </Link>
              </nav>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 py-2.5 transition-all hover:scale-105">
                Get Started
              </Button>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white md:hidden animate-in fade-in slide-in-from-top-10 pt-20 px-4">
            <nav className="space-y-4">
              <button 
                onClick={() => { router.push('/fuliza'); setIsMenuOpen(false); }}
                className="flex items-center gap-4 w-full p-4 rounded-xl bg-blue-50 border border-blue-100"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-slate-900">Fuliza Boost</span>
              </button>
              
              <button 
                onClick={() => { router.push('/quick-loans'); setIsMenuOpen(false); }}
                className="flex items-center gap-4 w-full p-4 rounded-xl bg-emerald-50 border border-emerald-100"
              >
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg text-slate-900">Quick Cash</span>
              </button>
            </nav>
        </div>
      )}

      {/* --- Hero Section --- */}
      <main>
        <section className="relative pt-8 pb-16 lg:pt-20 lg:pb-32 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-50 rounded-full opacity-60 blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Text Content */}
              <div className="space-y-6 md:space-y-8 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] md:text-xs font-black uppercase tracking-wider mx-auto lg:mx-0">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                  <span>AI-Powered Analysis</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Your M-Pesa. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Supercharged.
                  </span>
                </h1>
                
                <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto lg:mx-0">
                  Stop waiting. We use your transaction history to unlock instant cash and higher limits.
                </p>
                
                {/* Stats - Grid layout to fix squeezing */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-black text-slate-900">98%</div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Approval Rate</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-black text-slate-900">15s</div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Decision Time</div>
                  </div>
                </div>
              </div>
              
              {/* Interactive Card */}
              <div className="relative w-full max-w-md mx-auto lg:max-w-full">
                {/* Floating Badge */}
                <div className="absolute -top-4 right-0 lg:-right-4 z-20 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/30 font-bold flex items-center gap-2 animate-bounce text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Rates Dropped!</span>
                </div>

                <Card className="border-0 shadow-2xl shadow-slate-200/60 bg-white rounded-3xl overflow-hidden relative z-10 ring-1 ring-slate-100">
                  <CardHeader className="pb-2 pt-6 px-6">
                    <CardTitle className="text-2xl font-black text-slate-900 text-center">
                      Check Your Limit
                    </CardTitle>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-slate-400 font-normal border-slate-200 bg-slate-50">
                            <Lock className="w-3 h-3 mr-1"/> Private & Secure
                        </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
                      <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100 p-1 rounded-xl mb-6">
                        <TabsTrigger 
                          value="fuliza" 
                          className="rounded-lg font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                        >
                          Fuliza
                        </TabsTrigger>
                        <TabsTrigger 
                          value="loan" 
                          className="rounded-lg font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
                        >
                          Cash Loan
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Fuliza Tab with Enhanced Logic Visualization */}
                      <TabsContent value="fuliza" className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-900 block">
                            Step 1: Select Monthly M-Pesa Usage
                          </label>
                          
                          <div className="relative">
                            <button
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-2xl transition-all text-left group ${isDropdownOpen ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors ${mpesaRange ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  <BarChart3 className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className={`font-bold text-base ${mpesaRange ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {mpesaRange ? mpesaOptions.find(opt => opt.value === mpesaRange)?.label : 'Select Range...'}
                                  </div>
                                </div>
                              </div>
                              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                              <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                {mpesaOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => handleRangeSelect(option.value)}
                                    className="w-full p-4 text-left hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                                  >
                                    <div>
                                      <div className="font-bold text-slate-800 text-sm">{option.label}</div>
                                      <div className="text-xs text-slate-500">{option.description}</div>
                                    </div>
                                    {mpesaRange === option.value && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Dynamic Logic Visualization */}
                          <div className={`transition-all duration-500 ease-out overflow-hidden ${predictedLimit ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                                    <span className="text-xs font-bold text-blue-700 uppercase">Estimated Boost Potential</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-slate-900">KES {predictedLimit?.min}</span>
                                    <span className="text-sm font-medium text-slate-400">to</span>
                                    <span className="text-3xl font-black text-blue-600">KES {predictedLimit?.max}</span>
                                </div>
                                <div className="w-full bg-blue-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full w-3/4 animate-in slide-in-from-left duration-1000"></div>
                                </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !mpesaRange}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 md:h-16 text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                          {isLoading ? 'Analyzing...' : 'Boost My Limit'}
                        </Button>
                      </TabsContent>
                      
                      {/* Loan Tab */}
                      <TabsContent value="loan" className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-sm font-bold text-slate-900 block">
                            How much do you need?
                          </label>
                          
                          <div className="relative group">
                            <input
                              type="number"
                              placeholder="0"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              className="w-full pl-4 pr-16 h-16 bg-emerald-50/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all text-2xl font-black text-slate-900 placeholder:text-slate-300"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">KES</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            {['2,000', '5,000', '10,000'].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setLoanAmount(amount.replace(',', ''))}
                                className="py-2 px-1 text-sm font-bold rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all truncate"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleStart}
                          disabled={isLoading || !loanAmount}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black h-14 md:h-16 text-lg rounded-2xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                          {isLoading ? 'Processing...' : 'Get Instant Cash'}
                        </Button>
                      </TabsContent>
                    </Tabs>
                    
                     {/* Data Privacy Note with Fixed Session ID */}
                     <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        {sessionId && <span>Session ID: {sessionId}</span>}
                        <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Auto-clears</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Grid (Mobile Responsive) --- */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Fast. Simple. <span className="text-blue-600">Done.</span>
              </h2>
              <p className="text-slate-600 font-medium">
                We stripped away the bank bureaucracy.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Connect',
                  desc: 'Link your number securely.',
                  icon: <Smartphone className="h-6 w-6 text-white" />,
                  bg: 'bg-blue-600'
                },
                {
                  title: 'Analyze',
                  desc: 'AI checks history instantly.',
                  icon: <Sparkles className="h-6 w-6 text-white" />,
                  bg: 'bg-violet-600'
                },
                {
                  title: 'Receive',
                  desc: 'Money in M-Pesa now.',
                  icon: <CheckCircle2 className="h-6 w-6 text-white" />,
                  bg: 'bg-emerald-500'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex md:block items-center gap-6"
                >
                  <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 md:mt-4">{item.title}</h3>
                    <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-20 bg-blue-600 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
              Don't Let Low Limits <br className="hidden md:block"/> Stop You.
            </h2>
            <Button
              onClick={() => router.push('/fuliza')}
              className="w-full md:w-auto bg-white text-blue-600 hover:bg-slate-100 font-black px-10 py-8 h-auto rounded-2xl shadow-xl text-lg transform active:scale-95 transition-all"
            >
              Boost My M-Pesa Now
            </Button>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center md:text-left">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-black text-slate-900">LimitBoost</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-4">
                Modern financial tools for the modern African economy.
              </p>
            </div>
            
            <div className="text-sm space-y-2">
              <h4 className="font-bold text-slate-900">Support</h4>
              <p className="text-slate-500">help@limitboost.co.ke</p>
              <p className="text-slate-500">+254 700 000 000</p>
            </div>
            
            <div className="text-sm space-y-2">
              <h4 className="font-bold text-slate-900">Legal</h4>
              <p className="text-slate-500">Privacy Policy</p>
              <p className="text-slate-500">Terms of Service</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-2 text-xs font-medium text-slate-400">
            <p>&copy; {new Date().getFullYear()} LimitBoost.</p>
            <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Licensed by Central Bank of Kenya
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}