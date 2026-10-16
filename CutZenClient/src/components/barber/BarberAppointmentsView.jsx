import React, { useEffect, useState } from 'react';
import { Calendar, Search, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

const statusConfig = {
  1: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', icon: Clock },
  2: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled', icon: XCircle },
  3: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed', icon: CheckCircle2 },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', icon: Clock },
  canceled: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Canceled', icon: XCircle },
  completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed', icon: CheckCircle2 },
};

function AppointmentCard({ appointment, onStatusChange }) {
  const statusKey = typeof appointment.status === 'number' ? appointment.status : appointment.status?.toLowerCase();
  const status = statusConfig[statusKey] || statusConfig[1];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#5d4037] to-[#a1887f] flex items-center justify-center text-white font-bold text-lg">
            {(appointment.client?.names || appointment.client?.userName || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-stone-900">
              {appointment.client?.names || appointment.client?.userName || 'Client'}
            </h3>
            <p className="text-xs text-stone-500">{appointment.client?.phoneNumber || 'No phone'}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.color}`}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
          <p className="text-xs text-stone-500 mb-1">Service</p>
          <p className="font-semibold text-stone-900">{appointment.service?.name || 'Service'}</p>
          <p className="text-xs text-amber-700 mt-1 font-medium">{formatCurrency(appointment.service?.price)}</p>
        </div>
        <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
          <p className="text-xs text-stone-500 mb-1">Date & Time</p>
          <p className="font-semibold text-stone-900">{formatDate(appointment.startTime)}</p>
          <p className="text-xs text-stone-400 mt-1">{formatTime(appointment.startTime)}</p>
        </div>
      </div>

      {statusKey === 1 || statusKey === 'pending' ? (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusChange(appointment.id, 'completed')}
            className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-[0.98]"
          >
            <CheckCircle2 className="inline h-4 w-4 mr-1" />
            Complete
          </button>
          <button
            onClick={() => onStatusChange(appointment.id, 'canceled')}
            className="flex-1 rounded-xl bg-red-50 border border-red-200 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-[0.98]"
          >
            <XCircle className="inline h-4 w-4 mr-1" />
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function BarberAppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBarberAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = appointments.filter(a => {
    const statusString = typeof a.status === 'number'
      ? ['', 'pending', 'canceled', 'completed'][a.status]
      : a.status?.toLowerCase();
    const matchesFilter = filter === 'all' || statusString === filter;
    const clientName = (a.client?.names || a.client?.userName || '').toLowerCase();
    const serviceName = (a.service?.name || '').toLowerCase();
    const matchesSearch = search === '' || clientName.includes(search.toLowerCase()) || serviceName.includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Your Appointments</h2>
        <p className="text-sm text-stone-500 mt-1">Manage your schedule</p>
      </div>

      <div className="relative">
        <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients or services..."
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-stone-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'pending', 'completed', 'canceled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-gradient-to-r from-[#5d4037] to-[#a1887f] text-white shadow-md'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300'
            }`}
          >
            {f}
          </button>
        ))}
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
            <p className="text-stone-400 text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}