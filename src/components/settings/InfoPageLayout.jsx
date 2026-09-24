import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createPageUrl } from '@/utils';

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
    <div className="space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      {children}
    </div>
  </section>
);

export default function InfoPageLayout({ icon: Icon, title, subtitle, sections, backLabel }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('settings')}>
            <Button variant="ghost" size="icon" type="button" aria-label={backLabel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
              {subtitle ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="space-y-8 p-6 md:p-8">
            {sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.content}
              </Section>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
