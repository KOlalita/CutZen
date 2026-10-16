import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, DollarSign, Users, Clock, Sparkles } from 'lucide-react';
import { api } from '../../api/client';

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: 'from-purple-50 to-indigo-50 border-purple-200 text-purple-700',
    amber: 'from-amber-50 to-orange-50 border-amber-200 text-amber-700',
    emerald: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700',
    blue: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${colors[color] || colors.purple}`}>
      <Icon className="h-5 w-5 mb-2 opacity-80" />
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-xs text-stone-500 mt-1">{label}</p>
    </div>
  );
}

export function AdminHomeView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUsers('Client', '', 1, 100),
      api.getUsers('Barber', '', 1, 100),
      api.getAdminAppointments('', 1, 100),
      api.getServices(1, 100),
    ])
      .then(([clients, barbers, appointments, services]) => {
        setStats({
          totalClients: clients.length || 0,
          totalBarbers: barbers.length || 0,
          totalServices: services.length || 0,
          totalAppointments: appointments.length || 0,
          totalRevenue: appointments.reduce((sum, a) => sum + (a.service?.price || 0), 0),
        });
      })
      .catch(() => {
        setStats({ totalClients: 0, totalBarbers: 0, totalServices: 0, totalAppointments: 0, totalRevenue: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-stone-900">Welcome back, Admin</h2>
        <p className="text-sm text-stone-500 mt-1">Here's your system overview</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Users} label="Clients" value={stats?.totalClients || 0} color="blue" />
        <StatCard icon={Users} label="Barbers" value={stats?.totalBarbers || 0} color="amber" />
        <StatCard icon={Sparkles} label="Services" value={stats?.totalServices || 0} color="purple" />
        <StatCard icon={Calendar} label="Appointments" value={stats?.totalAppointments || 0} color="emerald" />
      </div>

      <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-900">System Activity</h3>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex items-end gap-2 h-28">
          {[30, 45, 35, 60, 50, 75, 65].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400 transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-stone-400">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium uppercase">Total Revenue</p>
            <p className="text-2xl font-bold text-stone-900">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}