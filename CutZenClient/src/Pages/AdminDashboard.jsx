import { useEffect, useState } from 'react';
import { Shield, Users, Scissors, CalendarDays, User, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Toast } from 'flowbite-react';
import BottomNavbar from '../components/shared/BottomNavbar';
import { AdminHomeView } from '../components/admin/AdminHomeView';
import { AdminBarbersView } from '../components/admin/AdminBarbersView';
import { AdminServicesView } from '../components/admin/AdminServicesView';
import { AdminClientsView } from '../components/admin/AdminClientsView';
import { AdminAppointmentsView } from '../components/admin/AdminAppointmentsView';
import { ProfileView } from '../components/profile/ProfileView';
import { formatNow } from '../utils/formatters';
import { useDarkMode } from '../hooks/useDarkMode';



const navItems = [
  { key: 'home', label: 'Home', icon: Shield },
  { key: 'barbers', label: 'Barbers', icon: Scissors },
  { key: 'services', label: 'Services', icon: Sparkles },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'appointments', label: 'Appointments', icon: CalendarDays },
  { key: 'profile', label: 'Profile', icon: User },
];

function Header({ clock }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f7f3ee]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-700">
            <Shield className="h-3 w-3" />
            Admin
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">CutZen</h1>
        </div>
        <div className="font-mono text-sm font-semibold text-stone-700 tabular-nums">{clock}</div>
      </div>
    </header>
  );
}

const views = {
  home: AdminHomeView,
  barbers: AdminBarbersView,
  services: AdminServicesView,
  clients: AdminClientsView,
  appointments: AdminAppointmentsView,
  profile: ProfileView,
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('home');
  const [clock, setClock] = useState(formatNow());
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

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-stone-900">
      <Header clock={clock} />

      <main className="mx-auto max-w-md px-4 pb-28 pt-4">
        <CurrentView />
      </main>

      <BottomNavbar
        items={navItems}
        currentTab={tab}
        onChange={setTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
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
    </div>
  );
}
