import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e) => {
    if (containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current.scrollTop === 0) {
      setPulling(true);
      setPullDistance(Math.min(diff, PULL_THRESHOLD * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPulling(false);
      
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPulling(false);
      setPullDistance(0);
    }
    startY.current = 0;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refreshing]);

  return (
    <div ref={containerRef} className="relative overflow-auto" style={{ height: '100%' }}>
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center transition-all"
        style={{
          top: refreshing ? '60px' : pulling ? `${pullDistance - 40}px` : '-40px',
          opacity: (pulling || refreshing) ? 1 : 0,
          transform: `scale(${Math.min(pullDistance / PULL_THRESHOLD, 1)})`,
          transition: pulling ? 'none' : 'all 0.3s ease'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
          <Loader2 className={`h-6 w-6 text-purple-600 dark:text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: pulling ? `translateY(${pullDistance}px)` : refreshing ? 'translateY(60px)' : 'translateY(0)',
          transition: pulling ? 'none' : 'transform 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
}