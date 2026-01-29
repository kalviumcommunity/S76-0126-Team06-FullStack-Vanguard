'use client';

import React from 'react';
import { BarChart3, Users, Lightbulb } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <BarChart3 className="w-10 h-10" />,
    title: 'Progress Tracking',
    description: 'Real-time visibility into project progress and structured end-user progress.',
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: 'Peer Feedback',
    description: 'Real-time visibility into projects and structured peer feedback for educational institutions.',
  },
  {
    icon: <Lightbulb className="w-10 h-10" />,
    title: 'Mentor Insights',
    description: 'Reprove mesources to help rent with student engagements and mentor insights.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:border-[#10b981] hover:shadow-lg hover:shadow-[#10b981]/20"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#10b981]/0 via-[#10b981]/0 to-[#10b981]/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              <div className="relative">
                {/* Icon */}
                <div className="text-[#10b981] mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
