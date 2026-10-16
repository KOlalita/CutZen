import React from 'react';
import { ChevronRight, Scissors, Clock3, Banknote, User } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { Card } from '../shared/Card';
import { InfoBadge } from '../shared/InfoBadge';

const statusMap = {
  1: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  2: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  3: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  canceled: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
};

export function AppointmentList({ appointments }) {
  return (
    <div className="space-y-3">
      {appointments.map((item) => {
        const statusKey = typeof item.status === 'number' ? item.status : item.status?.toLowerCase();
        const status = statusMap[statusKey] || statusMap[1];

        return (
          <Card key={item.id} className="border border-stone-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-stone-400">{formatDate(item.startTime)}</span>
                </div>
                <h4 className="font-bold text-stone-900">{item.service?.name || 'Service'}</h4>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {/* Service name next to scissors */}
                  <InfoBadge icon={Scissors} label={item.service?.name || 'TBD'} />
                  {/* Barber name */}
                  <InfoBadge icon={User} label={item.barber?.names || item.barber?.name || 'TBD'} color="stone" />
                  <InfoBadge icon={Clock3} label={formatTime(item.startTime)} />
                  <InfoBadge icon={Banknote} label={formatCurrency(item.service?.price)} color="emerald" />
                </div>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}