import React, { useEffect, useState } from 'react';
import { ChevronRight, Scissors, Clock3, Banknote, User } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { LoadingState } from '../shared/LoadingState';
import { ErrorState } from '../shared/ErrorState';
import { EmptyState } from '../shared/EmptyState';
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

export function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAppointments()
      .then(setAppointments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Your appointments</h2>
          <p className="text-sm text-stone-500">Manage your visits</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {appointments.length} total
        </span>
      </div>

      {appointments.length === 0 ? (
        <EmptyState message="No bookings yet" submessage="Your upcoming trims will appear here once you book one." />
      ) : (
        <div className="space-y-3">
          {appointments.map((item) => {
            const statusKey = typeof item.status === 'number' ? item.status : item.status?.toLowerCase();
            const status = statusMap[statusKey] || statusMap[1];

            return (
              <Card key={item.id} className="border border-stone-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-stone-400">{formatDate(item.startTime)}</span>
                    </div>
                    <h3 className="font-bold text-stone-900">{item.service?.name || 'Service'}</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      {/* Service name next to scissors */}
                      <InfoBadge icon={Scissors} label={item.service?.name || 'TBD'} />
                      {/* Barber name */}
                      <InfoBadge icon={User} label={item.barber?.names || item.barber?.name || 'TBD'} color="stone" />
                      <InfoBadge icon={Clock3} label={formatTime(item.startTime)} />
                      <InfoBadge icon={Banknote} label={formatCurrency(item.service?.price)} color="emerald" />
                    </div>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-colors group-hover:bg-amber-50 group-hover:text-amber-600">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}