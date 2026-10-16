import React, { useEffect, useState } from 'react';
import { Calendar, Search, Filter, Scissors, User, Clock } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

const statusConfig = {
  1: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  2: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  3: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
  canceled: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled' },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
};

function AppointmentCard({ appointment }) {
  const statusKey = typeof appointment.status === 'number' ? appointment.status : appointment.status?.toLowerCase();
  const status = statusConfig[statusKey] || statusConfig[1];

  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-700 font-bold">
            {(appointment.client?.names || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-stone-900">{appointment.client?.names} {appointment.client?.lastNames}</h4>
            <p className="text-xs text-stone-500">Client</p>
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-stone-600">
        <Scissors className="h-4 w-4 text-amber-600" />
        <span className="font-medium">{appointment.service?.name}</span>
        <span className="text-amber-700 font-bold ml-auto">{formatCurrency(appointment.service?.price)}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {appointment.barber?.names || 'TBD'}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(appointment.startTime)} {formatTime(appointment.startTime)}
        </div>
      </div>
    </div>
  );
}

export function AdminAppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterService, setFilterService] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAdminAppointments(search)
      .then(data => setAppointments(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const filtered = appointments.filter(a => {
    const matchesBarber = !filterBarber || a.barber?.names?.toLowerCase().includes(filterBarber.toLowerCase());
    const matchesService = !filterService || a.service?.name?.toLowerCase().includes(filterService.toLowerCase());
    return matchesBarber && matchesService;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">All Appointments</h2>
        <p className="text-sm text-stone-500 mt-1">System-wide appointment history</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or barber..."
            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 placeholder:text-stone-400"
          />
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            placeholder="Filter by barber..."
            className="flex-1 rounded-xl border border-stone-300 bg-white py-2.5 px-4 text-sm outline-none focus:border-purple-400 placeholder:text-stone-400"
          />
          <input
            type="text"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            placeholder="Filter by service..."
            className="flex-1 rounded-xl border border-stone-300 bg-white py-2.5 px-4 text-sm outline-none focus:border-purple-400 placeholder:text-stone-400"
          />
        </div>
      </div>

      <p className="text-xs text-stone-500 flex items-center gap-1">
        <Filter className="h-3 w-3" />
        {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
      </p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white border border-stone-200">
            <Calendar className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No appointments found</p>
          </div>
        ) : (
          filtered.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
        )}
      </div>
    </div>
  );
}