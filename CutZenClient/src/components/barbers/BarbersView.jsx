import React, { useEffect, useMemo, useState } from 'react';
import { Search, X, Star, Phone, Sparkles, User, Scissors } from 'lucide-react';
import { api } from '../../api/client';
import { LoadingState } from '../shared/LoadingState';
import { ErrorState } from '../shared/ErrorState';

function InfoPill({ icon: Icon, label, active }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
      active ? 'bg-amber-50 text-amber-700 font-medium' : 'bg-stone-100 text-stone-600'
    }`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// Card estilo admin adaptada para el cliente
function BarberCard({ barber, isFav, onToggleFavorite }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-300">
      <div className="flex items-center gap-3">
        {/* Avatar con foto o inicial */}
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold text-lg overflow-hidden shrink-0">
          {barber.photoUrl ? (
            <img
              src={barber.photoUrl}
              alt={barber.names || barber.name}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            (barber.names || barber.name || barber.userName || 'B').charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-stone-900 truncate">
            {barber.names || barber.name} {barber.lastNames || barber.lastName}
          </h4>
          <p className="text-xs text-amber-600 font-medium">{barber.specialty || 'Master Barber'}</p>
          <p className="text-xs text-stone-500 mt-0.5">{barber.phoneNumber || barber.phone || 'No phone'}</p>
        </div>
        {/* Botón favorito */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(barber.id); }}
          className={`rounded-full p-2 transition-all hover:scale-110 active:scale-95 ${
            isFav ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400 hover:bg-amber-50 hover:text-amber-500'
          }`}
        >
          <Star className={`h-4 w-4 ${isFav ? 'fill-amber-400' : ''}`} />
        </button>
      </div>
      {/* Info pills debajo */}
      <div className="mt-3 flex flex-wrap gap-2">
        <InfoPill icon={Scissors} label={barber.specialty || 'Barber'} active />
        <InfoPill icon={Phone} label={barber.phoneNumber || barber.phone || 'N/A'} />
        <InfoPill icon={Sparkles} label={barber.experience || 'Pro'} />
      </div>
    </div>
  );
}

export function BarbersView({ query, setQuery, selectedBarber, onSelectBarber, favoriteBarbers, onToggleFavorite }) {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getBarbers()
      .then(setBarbers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return barbers.filter((b) =>
      `${b.names || b.name} ${b.lastNames || b.lastName} ${b.specialty} ${b.desciption || b.description}`.toLowerCase().includes(q)
    );
  }, [query, barbers]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Our Barbers</h2>
        <p className="mt-1 text-sm text-stone-500">Find your perfect barber</p>
      </div>

      <div className="relative">
        <Search className="absolute inset-y-0 left-0 ml-4 h-5 w-5 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, specialty, or style..."
          className="w-full rounded-full border border-stone-200 bg-white py-3.5 pl-12 pr-10 text-sm text-stone-800 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute inset-y-0 right-0 mr-4 text-stone-400 hover:text-stone-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && <p className="text-xs text-stone-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>}

      <div className="space-y-3">
        {filtered.map((barber) => {
          const isFav = favoriteBarbers.includes(barber.id);
          const isSelected = selectedBarber === (barber.names || barber.name);

          return (
            <div
              key={barber.id}
              onClick={() => onSelectBarber(barber.names || barber.name)}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-amber-400 ring-offset-2 rounded-2xl' : ''
              }`}
            >
              <BarberCard
                barber={barber}
                isFav={isFav}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}