'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <Header showAuth={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                <Sparkles className="w-4 h-4 text-[#10b981]" />
                <span className="text-sm text-[#10b981] font-medium">
                  Next-Gen Educational Platform
                </span>
              </div>

              {/* Heading with Gradient */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Elevate Student
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
                  Collaboration &
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Outcomes.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl">
                Real-time visibility into project progress and structured peer feedback for educational institutions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold hover:shadow-xl hover:shadow-[#10b981]/30 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-700 text-white font-semibold hover:border-[#10b981] hover:bg-[#10b981]/5 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">500+</div>
                  <div className="text-sm text-gray-400 mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">50+</div>
                  <div className="text-sm text-gray-400 mt-1">Institutions</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#10b981]">98%</div>
                  <div className="text-sm text-gray-400 mt-1">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Visualization */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
                {/* Glass morphism container */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#10b981]/20 via-transparent to-[#059669]/20 blur-3xl animate-pulse" />
                
                {/* Animated SVG Visualization */}
                <svg
                  viewBox="0 0 400 400"
                  className="relative w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.3))' }}
                >
                  {/* Center Logo Circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="50"
                    fill="url(#centerGradient)"
                    className="animate-pulse"
                  />
                  
                  {/* Center V */}
                  <text
                    x="200"
                    y="220"
                    fontSize="48"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                  >
                    V
                  </text>

                  {/* Outer Circle Path */}
                  <circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="none"
                    stroke="url(#ringGradient)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-spin-slow"
                    style={{ animationDuration: '20s' }}
                  />

                  {/* User Icons in Circle */}
                  {[0, 60, 120, 180, 240, 300].map((angle, index) => {
                    const radian = (angle * Math.PI) / 180;
                    const x = 200 + 150 * Math.cos(radian);
                    const y = 200 + 150 * Math.sin(radian);
                    
                    return (
                      <g key={index}>
                        {/* Connection Line */}
                        <line
                          x1="200"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke="url(#lineGradient)"
                          strokeWidth="1"
                          opacity="0.3"
                          className="animate-pulse"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        />
                        
                        {/* User Circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r="25"
                          fill="url(#userGradient)"
                          className="animate-float"
                          style={{ animationDelay: `${index * 0.3}s` }}
                        />
                        
                        {/* User Icon */}
                        <g transform={`translate(${x - 10}, ${y - 10})`}>
                          <circle cx="10" cy="7" r="4" fill="white" opacity="0.9" />
                          <path
                            d="M 3 18 Q 3 13 10 13 Q 17 13 17 18"
                            fill="white"
                            opacity="0.9"
                          />
                        </g>
                      </g>
                    );
                  })}

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                    </linearGradient>
                    
                    <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a1a1a" />
                      <stop offset="100%" stopColor="#2a2a2a" />
                    </linearGradient>
                    
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Icons */}
                <div className="absolute top-10 right-10 w-12 h-12 bg-[#10b981]/10 rounded-lg backdrop-blur-sm border border-[#10b981]/20 flex items-center justify-center animate-float">
                  <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>

                <div className="absolute bottom-10 left-10 w-12 h-12 bg-[#10b981]/10 rounded-lg backdrop-blur-sm border border-[#10b981]/20 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <svg className="w-6 h-6 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
