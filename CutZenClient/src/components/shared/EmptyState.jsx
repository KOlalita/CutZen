import React from 'react';
import { CalendarClock } from 'lucide-react';

export function EmptyState({ message, submessage }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
      <div className="mb-4 inline-flex rounded-full bg-amber-50 p-4 text-amber-600">
        <CalendarClock className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{message}</h3>
      <p className="mt-2 text-sm text-stone-500">{submessage}</p>
    </div>
  );
}