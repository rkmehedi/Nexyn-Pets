import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white">
      <div className="h-48 rounded-lg bg-[var(--color-background-alt)]/50 shimmer"></div>
      <div className="mt-4">
        <div className="h-8 bg-[var(--color-secondary)]/40 rounded w-3/4 mb-3 shimmer"></div>
        <div className="h-4 bg-[var(--color-muted)]/50 rounded w-full mb-2 shimmer"></div>
        <div className="h-4 bg-[var(--color-muted)]/50 rounded w-5/6 shimmer"></div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-5 bg-[var(--color-secondary)]/30 rounded w-1/4 shimmer"></div>
          <div className="h-10 bg-[var(--color-accent)]/50 rounded-lg w-1/3 shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
