import React from 'react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
      <p className="text-sm text-stone-500">Loading...</p>
    </div>
  );
}