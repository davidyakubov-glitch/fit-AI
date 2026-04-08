import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, unit = '', icon: Icon, color = 'purple', trend = null }) {
  const colorMap = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  };

  const bgMap = {
    purple: 'bg-purple-50 dark:bg-purple-900/30',
    blue: 'bg-blue-50 dark:bg-blue-900/30',
    green: 'bg-green-50 dark:bg-green-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/30',
    red: 'bg-red-50 dark:bg-red-900/30'
  };

  const trendIcon = trend > 0
    ? <TrendingUp className="h-3.5 w-3.5 text-green-500" />
    : trend < 0
    ? <TrendingDown className="h-3.5 w-3.5 text-red-500" />
    : <Minus className="h-3.5 w-3.5 text-gray-400" />;

  return (
    <Card>
      <CardContent className="pt-5 pb-4 px-4">
        <div className={`inline-flex p-2 rounded-lg ${bgMap[color]} mb-3`}>
          <Icon className={`h-5 w-5 ${colorMap[color]}`} />
        </div>
        <div className={`text-2xl font-extrabold ${colorMap[color]}`}>
          {value}<span className="text-sm font-medium ml-0.5">{unit}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          {trend !== null && (
            <span className="flex items-center gap-0.5 text-xs ml-auto">
              {trendIcon}
              <span className={trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'}>
                {Math.abs(trend).toFixed(1)}{unit}
              </span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}