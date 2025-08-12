import type React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  description,
}: StatsCardProps) {
  return (
    <Card className='p-3 sm:p-6 card-border hover:shadow-lg transition-shadow duration-200'>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-xs sm:text-sm text-gray-600 mb-1'>{title}</p>
            <p className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>
              {value}
            </p>
            {description && (
              <p className='text-xs text-gray-500 mt-1'>{description}</p>
            )}
            {change && (
              <div className='flex items-center gap-1 mt-2'>
                {change.type === 'increase' ? (
                  <TrendingUp className='w-3 h-3 sm:w-4 sm:h-4 text-green-500' />
                ) : (
                  <TrendingDown className='w-3 h-3 sm:w-4 sm:h-4 text-red-500' />
                )}
                <span
                  className={`text-xs sm:text-sm font-medium ${change.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {change.value}
                </span>
              </div>
            )}
          </div>
          {icon && <div className='text-gray-400 ml-2 sm:ml-4'>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
