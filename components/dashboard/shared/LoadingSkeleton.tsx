'use client';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'chart';
}

export { LoadingSkeleton };
export default function LoadingSkeleton({ className = '', variant = 'text' }: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse rounded-lg bg-dash-card';

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} border border-dash-border p-5 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-lg bg-dash-border" />
          <div className="h-5 w-16 rounded-full bg-dash-border" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-20 rounded bg-dash-border" />
          <div className="h-8 w-28 rounded bg-dash-border" />
        </div>
        <div className="mt-3 h-10 rounded bg-dash-border" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`${baseClasses} border border-dash-border p-5 ${className}`}>
        <div className="mb-4 h-5 w-32 rounded bg-dash-border" />
        <div className="h-64 rounded bg-dash-border" />
      </div>
    );
  }

  // text variant
  return <div className={`${baseClasses} h-4 bg-dash-border ${className}`} />;
}
