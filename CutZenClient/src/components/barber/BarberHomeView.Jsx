import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, DollarSign, Users, Clock, ChevronRight, Scissors } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-amber-700',
    emerald: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700',
    blue: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 text-blue-700',
    purple: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`rounded-2xl border p-4 ${colors[color] || colors.amber}`}>
      <Icon className="h-5 w-5 mb-2 opacity-80" />
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-xs text-stone-500 mt-1">{label}</p>
    </div>
  );
}

function HistoryRow({ appointment }) {
  const statusMap = {
    1: { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Pending' },
    2: { color: 'text-red-700 bg-red-50 border-red-200', label: 'Canceled' },
    3: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Completed' },
    pending: { color: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Pending' },
    canceled: { color: 'text-red-700 bg-red-50 border-red-200', label: 'Canceled' },
    completed: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Completed' },
  };

  const statusKey = typeof appointment.status === 'number' ? appointment.status : appointment.status?.toLowerCase();
  const status = statusMap[statusKey] || statusMap[1];

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white border border-stone-200 p-4 hover:border-amber-300 transition-colors shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
        <Scissors className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-stone-900 truncate">
            {appointment.client?.names || appointment.client?.userName || 'Client'}
          </h4>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase border ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-sm text-stone-500">
          {appointment.service?.name || 'Service'} • {formatCurrency(appointment.service?.price)}
        </p>
        <p className="text-xs text-stone-400 mt-0.5">
          {formatDate(appointment.startTime)} at {formatTime(appointment.startTime)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-stone-400 shrink-0" />
    </div>
  );
}

export function BarberHomeView() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBarberStats(),
      api.getBarberAppointments(),
    ])
      .then(([statsData, appointments]) => {
        setStats(statsData);
        setHistory(appointments.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-stone-900">Welcome back, Barber</h2>
        <p className="text-sm text-stone-500 mt-1">Here's your performance today</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Calendar} label="Total Cuts" value={stats?.totalAppointments || 0} color="amber" />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats?.totalRevenue || 0)} color="emerald" />
        <StatCard icon={Users} label="Clients" value={stats?.uniqueClients || 0} color="blue" />
        <StatCard icon={Clock} label="Hours" value={`${stats?.totalHours || 0}h`} color="purple" />
      </div>

      <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900">Weekly Activity</h3>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex items-end gap-2 h-28">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-lg bg-gradient-to-t from-[#5d4037] to-[#a1887f] transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-stone-400">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900">Recent History</h2>
        </div>
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm rounded-xl bg-white border border-stone-200">
              No appointments yet
            </div>
          ) : (
            history.map((apt) => <HistoryRow key={apt.id} appointment={apt} />)
          )}
        </div>
      </div>
    </div>
  );
}