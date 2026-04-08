import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileHeader({ title, showBack = false }) {
  const navigate = useNavigate();

  return (
    <header 
      className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-[env(safe-area-inset-top)]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="select-none min-h-[44px] -ml-2"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Fitness Coach</span>
          </div>
        )}
        
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}