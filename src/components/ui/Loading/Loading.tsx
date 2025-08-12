'use client';

import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ className, size = 'md', text = 'Loading...' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        <div
          className={cn(
            'animate-spin rounded-full border-b-2 border-primary mx-auto mb-4',
            sizeClasses[size]
          )}
        />
        {text && <p className="text-muted-foreground text-sm">{text}</p>}
      </div>
    </div>
  );
}

export function FullScreenLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading size="lg" />
    </div>
  );
}
