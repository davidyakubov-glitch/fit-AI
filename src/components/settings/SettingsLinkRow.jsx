import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SettingsLinkRow({
  to,
  icon: Icon,
  title,
  description,
  action,
  danger = false,
}) {
  const colorClass = danger
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-900 dark:text-gray-100';

  const content = (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:bg-gray-800">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className={`font-semibold ${colorClass}`}>{title}</div>
          {description ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
          ) : null}
        </div>
      </div>
      <ChevronRight className={`h-4 w-4 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <button type="button" onClick={action} className="block w-full text-left">
      {content}
    </button>
  );
}
