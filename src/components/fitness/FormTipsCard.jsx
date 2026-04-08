import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function FormTipsCard() {
  const commonIssues = [
    {
      issue: "Knees caving in",
      fixes: [
        "Widen your stance to shoulder-width or slightly wider",
        "Push your knees out - track them over your toes",
        "Strengthen glutes with band exercises",
        "Focus on engaging outer thighs"
      ]
    },
    {
      issue: "Heels lifting",
      fixes: [
        "Shift weight to your heels - think 'sit back'",
        "Improve ankle mobility with daily stretches",
        "Try squatting with toes slightly elevated first",
        "Ensure shoes are flat and stable"
      ]
    },
    {
      issue: "Shallow depth",
      fixes: [
        "Work on hip and ankle flexibility",
        "Use a box/chair as a depth guide",
        "Practice deep squat holds",
        "Try goblet squats for better form"
      ]
    },
    {
      issue: "Forward lean",
      fixes: [
        "Engage your core throughout the movement",
        "Keep chest up and eyes forward",
        "Strengthen your back and core",
        "Don't rush - control the descent"
      ]
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Lightbulb className="h-5 w-5" />
          Common Form Issues & Fixes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {commonIssues.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2">
              🚫 {item.issue}
            </h4>
            <ul className="space-y-1.5">
              {item.fixes.map((fix, fixIdx) => (
                <li key={fixIdx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}