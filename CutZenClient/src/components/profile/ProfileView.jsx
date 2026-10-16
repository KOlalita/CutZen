import React, { useEffect, useState } from 'react';
import { User, Phone, Calendar, LogOut } from 'lucide-react';
import { api } from '../../api/client';

export function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        console.log('RAW DATA:', JSON.stringify(data, null, 2));
        
        setProfile({
          userName: data.username || data.userName || '',
          names: data.name || data.names || '',
          lastNames: data.lastName || data.lastNames || '',
          age: data.age ?? null,
          phoneNumber: data.phone || data.phoneNumber || '',
          role: data.role || 'client',
        });
      })
      .catch((err) => {
        console.error('Error:', err);
        const stored = localStorage.getItem('user_name') || '';
        setProfile({
          userName: stored,
          names: stored,
          lastNames: '',
          age: null,
          phoneNumber: '',
          role: localStorage.getItem('user_role') || 'client',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-stone-500">Cargando...</div>;
  if (!profile) return <div className="p-8 text-center text-red-600">Error al cargar perfil</div>;

  const initials = `${profile.names?.charAt(0) || ''}${profile.lastNames?.charAt(0) || ''}`.toUpperCase() 
                || profile.userName?.charAt(0).toUpperCase() 
                || 'U';

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#5d4037] via-[#795548] to-[#a1887f] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {initials}
        </div>
        <h2 className="text-xl font-bold text-stone-900">{profile.names} {profile.lastNames}</h2>
        <p className="text-sm text-stone-500 capitalize mt-1">{profile.role}</p>
        <p className="text-xs text-stone-400 mt-0.5">@{profile.userName}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-stone-500">Usuario</p>
            <p className="font-semibold text-stone-900">{profile.userName || 'No disponible'}</p>
          </div>
        </div>

        {profile.phoneNumber && (
          <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-stone-500">Teléfono</p>
              <p className="font-semibold text-stone-900">{profile.phoneNumber}</p>
            </div>
          </div>
        )}

        {profile.age !== null && profile.age !== undefined && (
          <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-stone-500">Edad</p>
              <p className="font-semibold text-stone-900">{profile.age} años</p>
            </div>
          </div>
        )}

        <button
          onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}