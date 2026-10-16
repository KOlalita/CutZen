import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Clock, Calendar, CheckCircle2, User } from 'lucide-react';
import { api } from '../../api/client';

const DAYS = [
  { key: 0, label: 'Sunday', short: 'Sun' },
  { key: 1, label: 'Monday', short: 'Mon' },
  { key: 2, label: 'Tuesday', short: 'Tue' },
  { key: 3, label: 'Wednesday', short: 'Wed' },
  { key: 4, label: 'Thursday', short: 'Thu' },
  { key: 5, label: 'Friday', short: 'Fri' },
  { key: 6, label: 'Saturday', short: 'Sat' },
];

const DEFAULT_SCHEDULE = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: false },
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isActive: true },
];


function BarberCard({ barber, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold text-lg">
          {(barber.names || barber.userName || 'B').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-stone-900 truncate">{barber.names} {barber.lastNames}</h4>
          <p className="text-xs text-stone-500">@{barber.userName}</p>
          <p className="text-xs text-amber-600 mt-0.5">{barber.phoneNumber || 'No phone'}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(barber)} className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700 transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(barber.id)} className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-red-100 hover:text-red-700 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleEditor({ schedule, onChange }) {
  const updateDay = (index, field, value) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-amber-600" />
        <h4 className="font-bold text-stone-900">Weekly Schedule</h4>
        <span className="text-xs text-stone-500">(Mon-Sat default: 9am-5pm)</span>
      </div>
      
      {schedule.map((day, idx) => (
        <div key={idx} className={`rounded-xl border p-3 transition-all ${day.isActive ? 'border-amber-200 bg-amber-50/50' : 'border-stone-200 bg-stone-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateDay(idx, 'isActive', !day.isActive)}
                className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${day.isActive ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-500'}`}
              >
                {day.isActive ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </button>
              <span className={`font-semibold text-sm ${day.isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                {DAYS[idx].label}
              </span>
            </div>
            <span className="text-xs text-stone-400">{day.isActive ? 'Working' : 'Day Off'}</span>
          </div>

          {day.isActive && (
            <div className="grid grid-cols-4 gap-2 ml-8">
              <div>
                <label className="text-[10px] text-stone-500 uppercase">Start</label>
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => updateDay(idx, 'startTime', e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 uppercase">End</label>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => updateDay(idx, 'endTime', e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 uppercase">Break Start</label>
                <input
                  type="time"
                  value={day.breakStart || ''}
                  onChange={(e) => updateDay(idx, 'breakStart', e.target.value || null)}
                  className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 uppercase">Break End</label>
                <input
                  type="time"
                  value={day.breakEnd || ''}
                  onChange={(e) => updateDay(idx, 'breakEnd', e.target.value || null)}
                  className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BarberModal({ barber, onClose, onSave, onSuccess }) {
  const [form, setForm] = useState({
    userName: '',
    password: '',
    names: '',
    lastNames: '',
    age: '',
    phoneNumber: '',
    desciption: '',
    ...barber,
  });

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    if (barber?.id) {
      setLoadingSchedule(true);
      api.getBarberSchedule(barber.id)
        .then((data) => {
          if (data && data.length > 0) {
            const mapped = DEFAULT_SCHEDULE.map((defaultDay) => {
              const found = data.find(d => d.dayOfWeek === defaultDay.dayOfWeek);
              if (found) {
                return {
                  dayOfWeek: found.dayOfWeek,
                  startTime: found.startTime?.substring(0, 5) || '09:00',
                  endTime: found.endTime?.substring(0, 5) || '17:00',
                  breakStart: found.breakStart ? found.breakStart.substring(0, 5) : null,
                  breakEnd: found.breakEnd ? found.breakEnd.substring(0, 5) : null,
                  isActive: found.isActive,
                };
              }
              return defaultDay;
            });
            setSchedule(mapped);
          }
        })
        .catch((err) => console.error('Error loading schedule:', err))
        .finally(() => setLoadingSchedule(false));
    }
  }, [barber?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const barberData = {
      ...form,
      age: parseInt(form.age) || null,
    };

    if (!barber && !form.password) {
      alert('Password is required for new barbers');
      return;
    }

    try {
      console.log('🔵 Step 1: Saving barber data...', barberData);
      const savedBarber = await onSave(barberData);
      console.log('🟢 Step 2: Barber saved, response:', savedBarber);
      
      const barberId = barber?.id || savedBarber?.id;
      console.log('🔵 Step 3: Barber ID for schedule:', barberId);
      
      if (barberId) {
        const scheduleDto = schedule.map(s => ({
          startTime: s.startTime + ':00',
          endTime: s.endTime + ':00',
          breakStart: s.breakStart ? s.breakStart + ':00' : null,
          breakEnd: s.breakEnd ? s.breakEnd + ':00' : null,
          isActive: s.isActive,
        }));
        
        console.log('🔵 Step 4: Saving schedule...', JSON.stringify(scheduleDto, null, 2));
        const result = await api.updateBarberSchedule(barberId, scheduleDto);
        console.log('🟢 Step 5: Schedule saved!', result);
      }
      
      onSuccess?.(); // 🔴 RECARGAR LISTA
      onClose();
    } catch (err) {
      console.error('🔴 ERROR in handleSubmit:', err);
      alert('Error: ' + err.message);
    }
  };

  const resetToDefault = () => {
    if (confirm('Reset to default schedule? (Mon-Sat 9am-5pm, break 1-2pm)')) {
      setSchedule(DEFAULT_SCHEDULE);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">{barber ? 'Edit Barber' : 'New Barber'}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-stone-900 flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" />
              Basic Info
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
              <input type="text" value={form.userName} onChange={e => setForm(p => ({...p, userName: e.target.value}))} required className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
            
            {!barber && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required={!barber} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                <input type="text" value={form.names} onChange={e => setForm(p => ({...p, names: e.target.value}))} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                <input type="text" value={form.lastNames} onChange={e => setForm(p => ({...p, lastNames: e.target.value}))} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                <input type="number" value={form.age} onChange={e => setForm(p => ({...p, age: e.target.value}))} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input type="tel" value={form.phoneNumber} onChange={e => setForm(p => ({...p, phoneNumber: e.target.value}))} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea value={form.desciption} onChange={e => setForm(p => ({...p, desciption: e.target.value}))} rows={2} className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-stone-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                Schedule
              </h4>
              <button
                type="button"
                onClick={resetToDefault}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                Reset to default
              </button>
            </div>
            
            {loadingSchedule ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : (
              <ScheduleEditor schedule={schedule} onChange={setSchedule} />
            )}
          </div>

          <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#5d4037] to-[#a1887f] py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
            {barber ? 'Update Barber & Schedule' : 'Create Barber & Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminBarbersView() {
  const [barbers, setBarbers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = () => {
    setLoading(true);
    api.getUsers('Barber', search)
      .then(data => setBarbers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (data) => {
    try {
      const result = await api.createBarber(data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (data) => {
    try {
      const cleanData = { ...data };
      if (!cleanData.password || cleanData.password.trim() === '') {
        delete cleanData.password;
      }

      console.log('🔵 handleEdit: Updating user...', editingBarber.id, cleanData);
      await api.updateUser(editingBarber.id, { 
        ...cleanData, 
        role: 'Barber',
        isActive: true 
      });
      console.log('🟢 handleEdit: User updated');
      
      return { id: editingBarber.id };
    } catch (err) {
      console.error('🔴 handleEdit error:', err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this barber?')) return;
    try {
      await api.deleteBarber(id);
      loadBarbers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Barbers</h2>
          <p className="text-sm text-stone-500 mt-1">Manage your team & schedules</p>
        </div>
        <button 
          onClick={() => { setEditingBarber(null); setModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5d4037] to-[#a1887f] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Barber
        </button>
      </div>

      <div className="relative">
        <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search barbers..."
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-stone-400"
        />
      </div>

      <div className="space-y-3">
        {barbers.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white border border-stone-200">
            <User className="mx-auto h-12 w-12 text-stone-300 mb-3" />
            <p className="text-stone-500 text-sm">No barbers found</p>
          </div>
        ) : (
          barbers.map(barber => (
            <BarberCard 
              key={barber.id} 
              barber={barber} 
              onEdit={(b) => { setEditingBarber(b); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <BarberModal
          barber={editingBarber}
          onClose={() => { setModalOpen(false); setEditingBarber(null); }}
          onSave={editingBarber ? handleEdit : handleCreate}
          onSuccess={loadBarbers} // 🔴 PASAR CALLBACK PARA RECARGAR
        />
      )}
    </div>
  );
}