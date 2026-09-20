import React from "react";

export const AdminOverviewSkeleton: React.FC = () => {
  return (
    <div
      className="flex-1 flex flex-col gap-4 pb-6 select-none animate-pulse"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-gray-100 flex items-center justify-between">
        <div className="h-7 bg-gray-200 rounded-lg w-52" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-48 sm:w-64 bg-gray-100 rounded-xl hidden sm:block" />
          <div className="w-9 h-9 rounded-full bg-gray-100" />
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="w-9 h-9 rounded-full bg-gray-100" />
        </div>
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex items-start justify-between"
          >
            <div className="flex flex-col gap-3">
              <div className="h-3.5 bg-gray-200 rounded w-24" />
              <div className="h-7 bg-gray-200 rounded-lg w-28" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-100" />
          </div>
        ))}
      </div>

      {/* Row 3: Financial Analytics & Top Performing Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col gap-4 h-84">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-7 bg-gray-100 rounded-lg w-20" />
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl flex items-end gap-3 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-200 rounded-t-sm"
                style={{ height: `${25 + ((i * 17) % 65)}%` }}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col gap-3 h-84">
          <div className="h-5 bg-gray-200 rounded w-44 mb-2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div className="h-3.5 bg-gray-200 rounded w-36" />
              <div className="h-5 bg-gray-200 rounded-md w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Enrollment Table & Age Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col gap-4 h-80">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
          <div className="flex flex-col divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div className="h-3.5 bg-gray-200 rounded w-28" />
                <div className="h-3.5 bg-gray-100 rounded w-36" />
                <div className="h-3.5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-2xs border border-gray-100 flex flex-col items-center justify-between h-80">
          <div className="w-full flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-32" />
            <div className="h-7 bg-gray-100 rounded-lg w-20" />
          </div>
          <div className="w-36 h-36 rounded-full border-12 border-gray-100 flex items-center justify-center">
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
          <div className="flex gap-4">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
