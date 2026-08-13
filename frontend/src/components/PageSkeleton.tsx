import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Top Banner / Welcome Skeleton */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect">
        <div className="w-28 h-6 bg-white/10 rounded-full mb-4" />
        <div className="w-64 md:w-96 h-8 bg-white/10 rounded-lg mb-2" />
        <div className="w-48 md:w-72 h-4 bg-white/5 rounded" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-white/10 rounded" />
              <div className="w-8 h-8 rounded-lg bg-white/10" />
            </div>
            <div className="w-16 h-8 bg-white/15 rounded" />
            <div className="flex items-center justify-between">
              <div className="w-20 h-3 bg-white/5 rounded" />
              <div className="w-16 h-3 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content / Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-32 h-5 bg-white/10 rounded" />
            <div className="w-6 h-6 bg-white/10 rounded" />
          </div>
          <div className="flex items-end gap-4 h-48 pt-4">
            {[40, 70, 45, 90, 60, 80, 50].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-white/10 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-80 flex flex-col justify-between">
          <div className="w-32 h-5 bg-white/10 rounded mb-4" />
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-3/4 h-3.5 bg-white/10 rounded" />
                  <div className="w-1/2 h-2.5 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
