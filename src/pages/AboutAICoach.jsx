import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Brain, Target, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Section = ({
  icon: Icon,
  title,
  children,
  iconColor = 'text-purple-600',
  iconBg = 'bg-purple-100',
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className={`${iconBg} p-2.5 rounded-xl`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const BulletItem = ({ text }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0 ml-1" />
    <span className="text-gray-700 text-sm font-medium">{text}</span>
  </div>
);

export default function AboutAICoach() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link
          to={createPageUrl('Settings')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <span className="font-semibold text-gray-800 text-base">About AI Coach</span>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Hero */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl shadow-lg mb-4">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            About Your AI Fitness Coach
          </h1>
          <p className="text-gray-500 text-sm">
            Personalized workout guidance powered by AI
          </p>
        </div>

        {/* How it works */}
        <Section icon={Brain} title="How It Works">
          <p className="text-gray-600 text-sm leading-relaxed">
            Our AI Fitness Coach uses the information you provide, such as your goals,
            activity history, and workout preferences, to generate personalized fitness
            recommendations. These suggestions are designed to support your training,
            but they should not replace professional medical or fitness advice.
          </p>
        </Section>

        {/* What the AI uses */}
        <Section
          icon={Target}
          title="What the AI Uses"
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        >
          <div>
            <BulletItem text="Your fitness goals" />
            <BulletItem text="Workout selections" />
            <BulletItem text="Training progress" />
            <BulletItem text="Exercise preferences" />
          </div>
        </Section>

        {/* Privacy */}
        <Section
          icon={ShieldCheck}
          title="Privacy"
          iconColor="text-green-600"
          iconBg="bg-green-100"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            We use your data to provide and improve workout recommendations and app
            features. Your information is handled according to our Privacy Policy.
            We do not use your personal data for unrelated purposes without your consent.
          </p>
        </Section>

        {/* CTA */}
        <div className="pt-2 pb-8">
          <Link to={createPageUrl('PrivacyPolicy')}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-semibold flex items-center justify-center gap-2">
              Learn More About Privacy
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}