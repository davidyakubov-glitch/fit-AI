import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { Dumbbell, LineChart, Target, Settings, Users, LogIn, BookOpen, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './components/LanguageSwitcher'; // Импорт переключателя
import { useTranslation } from 'react-i18next'; // Для перевода пунктов меню

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { t } = useTranslation();
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, [location.pathname]);

  // ИСПРАВЛЕНО: ключи page теперь в нижнем регистре для соответствия конфигу
  const navItems = [
    { name: t('workout'), icon: Dumbbell, page: 'workout' },
    { name: t('exercisecatalog'), icon: BookOpen, page: 'exercisecatalog' },
    { name: t('workoutplan'), icon: Target, page: 'workoutplan' },
    { name: t('community'), icon: Users, page: 'community' },
    { name: t('progress'), icon: LineChart, page: 'progress' },
    { name: t('referral'), icon: Gift, page: 'referral' },
    { name: t('settings'), icon: Settings, page: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <style>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --border-color: #e5e7eb;
          --accent-color: #9333ea;
        }
        
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --text-primary: #f9fafb;
            --text-secondary: #9ca3af;
            --border-color: #374151;
            --accent-color: #a855f7;
          }
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        button, a, [role="button"] {
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* КНОПКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА (СВЕРХУ СПРАВА) */}
      <div className="fixed top-4 right-4 z-[100] md:top-6 md:right-8">
        <LanguageSwitcher />
      </div>

      {/* Main Content with Page Transitions */}
      <main className="pb-24 md:pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar (Mobile) / Footer (Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-[env(safe-area-inset-bottom)] z-50 md:relative md:mt-12">
        <div className="flex overflow-x-auto scrollbar-none md:overflow-visible md:justify-around md:max-w-7xl md:mx-auto md:px-4 md:py-6">
          {navItems.map((item) => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-h-[44px] min-w-[52px] flex-shrink-0 transition-colors select-none md:flex-row md:gap-2 md:flex-initial md:min-w-0 md:px-3 ${
                currentPageName === item.page
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className={`h-5 w-5 md:h-6 md:w-6 ${currentPageName === item.page ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] md:text-sm leading-tight ${currentPageName === item.page ? 'font-semibold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Desktop Footer Text */}
        <div className="hidden md:flex items-center justify-center gap-4 pb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI Fitness Coach • Real-time AI form analysis
          </p>
          {user ? (
            <button
              onClick={() => base44.auth.logout(createPageUrl('auth'))}
              className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
            >
              {t('sign_out')}
            </button>
          ) : (
            <Link to={createPageUrl('auth')} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              <LogIn className="h-3 w-3 inline mr-1" />{t('sign_in')}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}