import React from 'react';
import { CalendarDays } from 'lucide-react';

export function BookNowCTA({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] px-6 py-5 shadow-lg shadow-amber-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/20 active:scale-[0.98]"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150" />
      <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150" />
      <div className="relative flex items-center justify-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm text-white transition-all duration-300 group-hover:bg-white/25 group-hover:scale-110">
          <CalendarDays className="h-7 w-7" />
        </div>
        <div className="text-left">
          <h4 className="text-lg font-bold text-white">Make an appointment</h4>
          <p className="mt-0.5 text-sm text-amber-100/80">Book your next fresh cut with our top barbers</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:bg-white/25 group-hover:translate-x-1">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}