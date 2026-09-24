import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsSectionCard({ icon: Icon, title, description, children }) {
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-gray-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Icon className="h-5 w-5" />
          </span>
          <span>{title}</span>
        </CardTitle>
        {description ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
