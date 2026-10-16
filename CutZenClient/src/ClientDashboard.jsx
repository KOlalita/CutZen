import { useEffect, useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Toast } from 'flowbite-react';
import { Home, CalendarDays, Scissors, Info, User } from 'lucide-react';
// BottomNavbar usa export default
import BottomNavbar from './components/shared/BottomNavbar';
// Estos deben coincidir con export function en cada archivo
import { HomeView } from './components/home/HomeView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { BarbersView } from './components/barbers/BarbersView';
import { InfoView } from './components/info/InfoView';
import { ProfileView } from './components/profile/ProfileView';
import { BookingModal } from './components/booking/BookingModal';
import { useDarkMode } from './hooks/useDarkMode';

import { formatNow } from './utils/formatters';

function Header({ clock }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f7f3ee]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">CutZen</h1>
        </div>
        <div className="font-mono text-sm font-semibold text-stone-700 tabular-nums">{clock}</div>
      </div>
    </header>
  );
}

const navItems = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'appointments', label: 'Appointments', icon: CalendarDays },
  { key: 'barbers', label: 'Barbers', icon: Scissors },
  { key: 'info', label: 'Info', icon: Info },
  { key: 'profile', label: 'Profile', icon: User },
];


const views = {
  home: HomeView,
  appointments: AppointmentsView,
  barbers: BarbersView,
  info: InfoView,
  profile: ProfileView,
};

export default function ClientDashboard() {
  const [tab, setTab] = useState('home');
  const [clock, setClock] = useState(formatNow());
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toast, setToast] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const i = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const CurrentView = views[tab];

  const viewProps = {
    home: { onOpenBooking: () => setBookingOpen(true) },
    barbers: { query: '', setQuery: () => {}, favoriteBarbers: [], onToggleFavorite: () => {} },
    info: { expandedInfo: 'Opening hours', onToggleInfo: () => {} },
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-stone-900">
      <Header clock={clock} />

      <main className="mx-auto max-w-md px-4 pb-28 pt-4">
        {CurrentView ? (
          <CurrentView {...(viewProps[tab] || {})} />
        ) : (
          <div className="text-red-600 p-4">View not found for tab: {tab}</div>
        )}
      </main>

      <BottomNavbar
        items={navItems}
        currentTab={tab}
        onChange={setTab}
        pendingCount={2}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={() => {
          setToast('✅ Appointment booked!');
          setTab('appointments');
        }}
      />

      {toast && (
        <div className="fixed left-1/2 top-4 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
          <Toast className="border border-stone-200 shadow-lg">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="ml-3 text-sm font-medium text-stone-700">{toast}</div>
            <button onClick={() => setToast('')} className="ml-auto rounded-lg p-1.5 text-stone-400 hover:bg-stone-100">
              <X className="h-4 w-4" />
            </button>
          </Toast>
        </div>
      )}

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
