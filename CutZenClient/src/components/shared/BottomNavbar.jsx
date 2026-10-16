import { Moon, Sun } from 'lucide-react';

export default function BottomNavbar({
  items,
  currentTab,
  onChange,
  pendingCount = 0,
  isDarkMode = false,
  onToggleDarkMode,
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch justify-around gap-1 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
        {items.map(({ key, label, icon: Icon }) => {
          const active = currentTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-stone-100 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:text-[11px] ${
                active ? 'bg-amber-100 text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              <span className={`absolute top-0 h-1 w-8 rounded-full transition-all duration-200 ${active ? 'bg-amber-500 opacity-100' : 'bg-transparent opacity-0'}`} />
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform duration-150 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                {key === 'appointments' && pendingCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className={`w-full truncate text-center ${active ? 'font-semibold' : ''}`}>{label}</span>
            </button>
          );
        })}
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
            className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-stone-500 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-stone-100 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:text-[11px]"
          >
            <span className="absolute top-0 h-1 w-8 rounded-full bg-transparent opacity-0" />
            {isDarkMode ? (
              <Sun className="h-5 w-5 transition-transform duration-150 group-hover:scale-105" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-150 group-hover:scale-105" />
            )}
            <span className="w-full truncate text-center">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        )}
      </div>
    </nav>
  );
}
