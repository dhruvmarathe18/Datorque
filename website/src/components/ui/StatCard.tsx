import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, icon, change, changeType = 'neutral', className }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <span className={cn('inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium', changeColors[changeType])}>
              {change}
            </span>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
