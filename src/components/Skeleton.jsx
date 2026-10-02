import React from 'react';
import { cn } from '../lib/utils';

/** Shimmering placeholder block. */
export function SkeletonLine({ className, style }) {
  return <span className={cn('skeleton block h-3', className)} style={style} />;
}

/** Skeleton that mirrors the snippet viewer layout while it loads. */
export function SnippetSkeleton() {
  return (
    <div className="animate-fade-in space-y-5" aria-hidden="true">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-9 w-72 max-w-full" />
          <SkeletonLine className="h-3 w-56 max-w-full" />
        </div>
        <div className="panel p-4">
          <SkeletonLine className="h-3 w-20" />
          <SkeletonLine className="mt-3 h-8 w-full" />
          <SkeletonLine className="mt-2 h-8 w-2/3" />
        </div>
      </div>

      <div className="code-surface">
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-ink-900/70 px-4 py-3">
          <SkeletonLine className="h-3 w-3 rounded-full" />
          <SkeletonLine className="h-3 w-3 rounded-full" />
          <SkeletonLine className="h-3 w-3 rounded-full" />
          <SkeletonLine className="ml-2 h-3 w-40" />
        </div>
        <div className="space-y-3 p-5">
          {[92, 74, 84, 46, 66, 88, 58, 40].map((width, index) => (
            <SkeletonLine
              key={index}
              className="h-3.5"
              style={{ width: `${width}%`, animationDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SnippetSkeleton;
