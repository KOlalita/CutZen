import React from 'react';

const colorMap = {
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  stone: 'bg-stone-100 text-stone-600',
};

export function InfoBadge({ icon: Icon, label, color = 'amber' }) {
  return (
    <div className="flex items-center gap-1.5 text-stone-600">
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${colorMap[color] || colorMap.amber}`}>
        <Icon className="h-3 w-3" />
      </div>
      <span className={color === 'emerald' ? 'font-semibold text-emerald-700' : 'font-medium'}>{label}</span>
    </div>
  );
}