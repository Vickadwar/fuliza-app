import React from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Lock,
  ChevronRight,
  Star,
  CreditCard,
  BarChart,
  Target,
  Percent,
  Clock,
  RefreshCw,
  Users,
  Check
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Financial Freedom Cards</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Beautiful designs for your financial service marketing
          </p>
        </div>

        {/* --- SECTION 1: SQUARE CARDS --- */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Social Media Ready</h2>
            <p className="text-slate-500">Perfect 1:1 ratio cards for Instagram & Facebook</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
            {/* CARD 1: Limit Increase */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Fuliza Limit Boost</span>
                      <div className="text-blue-100 text-xs">Fuliza Loans</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Popular
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Instant Processing</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-slate-800 mb-2">KES 25,000</div>
                    <div className="text-sm text-slate-500">Fuliza limit boost</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-slate-500 mb-1">Current Limit</div>
                      <div className="font-bold text-blue-700">KES 3,000</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-slate-500 mb-1">After Fuliza Boost</div>
                      <div className="font-bold text-emerald-700">12,500</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">No physical documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">Mobile-first application</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">24/7 access</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Check Eligibility
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2: Quick Cash Loan */}
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-200 rounded-full blur-xl opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-20"></div>
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Get Quick Cash</span>
                      <div className="text-emerald-100 text-xs">Instant Mobile Loans</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Mobile Loans
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-center relative z-10">
                <div className="text-center mb-8">
                  <div className="mb-6">
                    <div className="text-5xl font-bold text-slate-800 mb-2">KES 15,000</div>
                    <div className="text-sm text-slate-500">Instant loan amount</div>
                  </div>
                  
                  <div className="inline-flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Term</div>
                      <div className="font-bold text-emerald-700">30 Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Rate</div>
                      <div className="font-bold text-emerald-700">10%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Repay</div>
                      <div className="font-bold text-emerald-700">KES 16,500</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Disbursement time</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">2-4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Approval rate</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-slate-700">Guarantor</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">Not required</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 relative z-10">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 3: Credit Building */}
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl overflow-hidden relative flex flex-col w-full max-w-md mx-auto border border-slate-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <BarChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-bold text-lg">Credit Builder</span>
                      <div className="text-purple-100 text-xs">Financial Growth</div>
                    </div>
                  </div>
                  <div className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                    Smart
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="text-center mb-6">
                  <div className="mb-8">
                    <div className="text-3xl font-bold text-slate-800 mb-4">Build Better Credit</div>
                    <p className="text-slate-600 text-sm">
                      Improve your financial profile with responsible usage patterns
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Current</div>
                      <div className="font-bold text-purple-700">Fair</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-xs text-slate-500">Potential</div>
                      <div className="font-bold text-purple-700">Good</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Timely payments tracking</div>
                      <div className="text-xs text-slate-500">Build positive history</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Limit increase opportunities</div>
                      <div className="text-xs text-slate-500">Based on performance</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-800">Financial insights</div>
                      <div className="text-xs text-slate-500">Monthly progress reports</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2">
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: LANDSCAPE BANNERS --- */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Website Banners</h2>
            <p className="text-slate-500">Horizontal layouts perfect for web headers</p>
          </div>
          
          <div className="space-y-10">
            {/* BANNER 1: Hero Banner */}
            <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              
              <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between">
                {/* Left Content */}
                <div className="lg:w-1/2 mb-10 lg:mb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-300 font-medium">Trusted & Secure</div>
                      <div className="text-2xl font-bold text-white">Digital Financial Services</div>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Financial solutions<br />
                    that work for<br />
                    <span className="text-blue-300">your lifestyle</span>
                  </h1>
                  
                  <p className="text-slate-300 text-lg mb-8 max-w-lg">
                    Access smart financial tools designed for modern mobile users. 
                    Simple, fast, and built around your needs.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                      Explore Services
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="bg-white/10 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
                      How It Works
                    </button>
                  </div>
                </div>

                {/* Right Stats */}
                <div className="lg:w-2/5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                      <div className="text-sm text-slate-300 mb-2">Average User Results</div>
                      <div className="text-4xl font-bold text-white mb-1">87%</div>
                      <div className="text-slate-300 text-sm">satisfaction rate</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Quick Access</div>
                        <div className="font-semibold text-white">2-4 hours</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Digital Process</div>
                        <div className="font-semibold text-white">100% Online</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-slate-300">Support</div>
                        <div className="font-semibold text-white">24/7 Available</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-slate-300 text-sm ml-2">4.8/5 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BANNER 2: Features Grid */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Us</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Designed with your convenience and security in mind
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <Smartphone className="w-6 h-6 text-blue-600" />,
                    title: "Mobile First",
                    desc: "Access everything from your smartphone",
                    color: "from-blue-50 to-white"
                  },
                  {
                    icon: <Zap className="w-6 h-6 text-emerald-600" />,
                    title: "Fast Processing",
                    desc: "Quick decisions and disbursements",
                    color: "from-emerald-50 to-white"
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
                    title: "Secure & Private",
                    desc: "Bank-level security measures",
                    color: "from-purple-50 to-white"
                  },
                  {
                    icon: <CreditCard className="w-6 h-6 text-orange-600" />,
                    title: "No Hidden Fees",
                    desc: "Transparent pricing always",
                    color: "from-orange-50 to-white"
                  }
                ].map((feature, index) => (
                  <div key={index} className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all duration-200 hover:shadow-md`}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center shadow-sm mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                  Learn more about our features
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: VERTICAL STORIES --- */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Story Format</h2>
            <p className="text-slate-500">Vertical layouts for Instagram & Facebook Stories</p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gradient-to-b from-slate-900 to-blue-900 rounded-3xl shadow-2xl overflow-hidden relative w-full max-w-sm min-h-[700px]">
              {/* Top Content */}
              <div className="p-8 pt-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                  Ready for<br />
                  <span className="text-blue-300">financial growth?</span>
                </h1>
                
                <div className="text-slate-300 text-base mb-8">
                  Take the first step toward better financial access
                </div>
              </div>
              
              {/* Steps */}
              <div className="px-6 space-y-6 mb-10">
                {[
                  {
                    step: "1",
                    title: "Simple Application",
                    desc: "Share basic details through our secure platform",
                    color: "bg-blue-500/20 border-blue-500/30"
                  },
                  {
                    step: "2",
                    title: "Instant Analysis",
                    desc: "Get personalized options in minutes",
                    color: "bg-emerald-500/20 border-emerald-500/30"
                  },
                  {
                    step: "3",
                    title: "Access Funds",
                    desc: "Quick disbursement to your preferred method",
                    color: "bg-purple-500/20 border-purple-500/30"
                  }
                ].map((step, index) => (
                  <div key={index} className={`${step.color} backdrop-blur-sm rounded-2xl p-5 border`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <div className="text-white font-bold">{step.step}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-lg">{step.title}</div>
                        <div className="text-slate-300 text-sm">{step.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center shadow-xl shadow-blue-600/30">
                  <div className="text-white text-2xl font-bold mb-3">Start Today</div>
                  <p className="text-blue-100 text-sm mb-6">
                    No commitment, just see what you qualify for
                  </p>
                  
                  <button className="w-full bg-white text-blue-700 font-bold py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 mb-3">
                    Begin Free Assessment
                  </button>
                  
                  <div className="text-xs text-blue-200">
                    Takes only 2 minutes • No credit check required
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}