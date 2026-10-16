import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingState } from '../shared/LoadingState';
import { ErrorState } from '../shared/ErrorState';
import { EmptyState } from '../shared/EmptyState';
import { NextAppointmentCard } from './NextAppointmentCard';
import { AppointmentList } from './AppointmentList';
import { BookNowCTA } from './BookNowCTA';

export function HomeView({ onOpenBooking }) {
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

  const now = new Date();

  // Normalize status for comparison
  const getStatusString = (status) => {
    if (typeof status === 'number') {
      return ['', 'pending', 'canceled', 'completed'][status] || 'pending';
    }
    return status?.toLowerCase();
  };

  const next = appointments.find((a) => {
    const statusStr = getStatusString(a.status);
    return new Date(a.startTime) > now && statusStr !== 'canceled';
  });

  const previous = appointments.filter((a) => {
    const statusStr = getStatusString(a.status);
    return new Date(a.startTime) < now || statusStr === 'completed';
  });

  return (
    <div className="space-y-4">
      <BookNowCTA onClick={onOpenBooking} />
      {next && <NextAppointmentCard appointment={next} />}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Previous appointments</h2>
          <span className="text-xs text-stone-500">History</span>
        </div>
        {previous.length === 0 ? (
          <EmptyState message="No past appointments" submessage="Your completed appointments will appear here." />
        ) : (
          <AppointmentList appointments={previous} />
        )}
      </section>
    </div>
  );
}