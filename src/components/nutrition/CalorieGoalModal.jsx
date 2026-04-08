import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Target } from 'lucide-react';

const PRESETS = [
  { label: 'Weight Loss', kcal: 1500, desc: 'Deficit diet' },
  { label: 'Maintenance', kcal: 2000, desc: 'Stay the same' },
  { label: 'Muscle Gain', kcal: 2500, desc: 'Caloric surplus' },
  { label: 'Athlete',     kcal: 3000, desc: 'High performance' },
];

export default function CalorieGoalModal({ currentGoal, onSave, onClose }) {
  const [value, setValue] = useState(String(currentGoal));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Target className="h-5 w-5 text-purple-600" /> Set Daily Goal
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setValue(String(p.kcal))}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  value === String(p.kcal)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-sm text-gray-900">{p.kcal} kcal</div>
                <div className="text-xs text-gray-500">{p.label}</div>
                <div className="text-[10px] text-gray-400">{p.desc}</div>
              </button>
            ))}
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1">Custom goal (kcal)</Label>
            <Input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              min={500}
              max={10000}
              placeholder="e.g. 2200"
            />
          </div>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => { onSave(parseInt(value) || 2000); onClose(); }}
          >
            Save Goal
          </Button>
        </div>
      </div>
    </div>
  );
}