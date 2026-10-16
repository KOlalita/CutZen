import React from 'react';
import { Badge, Button } from 'flowbite-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

const statusConfig = {
  1: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  2: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  3: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  canceled: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
};

export function NextAppointmentCard({ appointment, onEdit }) {
  const statusKey = typeof appointment?.status === 'number' 
    ? appointment.status 
    : appointment?.status?.toLowerCase();
  const status = statusConfig[statusKey] || statusConfig[1];

  return (
    <div className="overflow-hidden rounded-2xl bg-stone-900 text-white shadow-lg">
      <div className="bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.3),transparent_35%),linear-gradient(135deg,#1c1917,#292524)] p-1">
        <div className="space-y-4 rounded-xl bg-white/5 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Next appointment</p>
            <Badge color="warning" className="border border-amber-300/30 bg-amber-300/10 text-amber-100">
              {status?.label || appointment?.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Barber', value: appointment?.barber?.names || appointment?.barber?.name || 'TBD' },
              { label: 'Service', value: appointment?.service?.name || 'TBD' },
              { label: 'Date', value: formatDate(appointment?.startTime) },
              { label: 'Time', value: formatTime(appointment?.startTime) },
              { label: 'Cost', value: formatCurrency(appointment?.service?.price) },
              { label: 'Status', value: status?.label || appointment?.status, highlight: true },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">{item.label}</p>
                <p className={`mt-1 text-base font-bold ${item.highlight ? 'text-emerald-400' : ''}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={onEdit} className="flex-1 !bg-amber-400 !text-stone-900 hover:!bg-amber-300">
              Edit
            </Button>
            <Button color="light" className="flex-1 !border-white/10 !bg-white/10 !text-white hover:!bg-white/20">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}