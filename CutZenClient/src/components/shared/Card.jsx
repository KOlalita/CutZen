import React from 'react';

export function Card({ children, className = '', hover = true, accent = true }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ${
      hover ? 'hover:-translate-y-0.5 hover:shadow-md' : ''
    } ${className}`}>
      {accent && (
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      {children}
    </div>
  );
}