export const formatNow = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const statusConfig = {
  confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'CheckCircle2' },
  upcoming: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'CalendarClock' },
  completed: { color: 'bg-stone-100 text-stone-600 border-stone-200', icon: 'CheckCircle2' },
  cancelled: { color: 'bg-red-50 text-red-700 border-red-200', icon: 'X' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'Clock3' },
};