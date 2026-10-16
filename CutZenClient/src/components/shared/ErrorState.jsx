import React from 'react';
import { X } from 'lucide-react';

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <div className="rounded-full bg-red-50 p-4 text-red-600">
        <X className="h-8 w-8" />
      </div>
      <p className="text-sm text-red-600 font-medium">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}