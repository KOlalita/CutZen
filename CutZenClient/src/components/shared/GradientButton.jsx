import React from 'react';

export function GradientButton({ children, onClick, icon: Icon, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] px-6 py-4 text-center shadow-lg shadow-amber-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-900/20 active:scale-[0.98] ${className}`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex items-center justify-center gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-all group-hover:bg-white/25 group-hover:scale-110">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="text-left">
          <h4 className="text-base font-bold text-white">{children}</h4>
          <p className="mt-0.5 text-sm text-amber-100/80">Tap to book your next session</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-all group-hover:bg-white/25">
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}