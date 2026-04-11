import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { logoutUser } from './lib/auth';
import { Dumbbell, LineChart, Target, Settings, Users, BookOpen, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Layout() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: t('workout'), icon: Dumbbell, page: 'workout' },
    { name: t('exercisecatalog'), icon: BookOpen, page: 'exercisecatalog' },
    { name: t('workoutplan'), icon: Target, page: 'workoutplan' },
    { name: t('community'), icon: Users, page: 'community' },
    { name: t('progress'), icon: LineChart, page: 'progress' },
    { name: t('referral'), icon: Gift, page: 'referral' },
    { name: t('settings'), icon: Settings, page: 'settings' }
  ];

  const currentPageName = location.pathname.replace('/', '') || 'workout';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <div className="fixed top-4 right-4 z-[100]">
        <LanguageSwitcher />
      </div>

      <main className="pb-24 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex flex-col items-center min-w-[60px] ${
                currentPageName === item.page ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="text-center pb-2">
          <button
            onClick={logoutUser}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            {t('sign_out')}
          </button>
        </div>
      </nav>
    </div>
  );
}
