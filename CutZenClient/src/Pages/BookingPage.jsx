import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scissors, User, Clock, Calendar, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../api/client';
import { formatCurrency, formatDate } from '../utils/formatters';

function generateDateList() {
  const dates = [];
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    let label;
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = dayNames[d.getDay()];

    dates.push({
      value: d.toISOString().split('T')[0],
      label,
      sublabel: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      isToday: i === 0,
      dayOfWeek: d.getDay(),
    });
  }
  return dates;
}

const DATE_LIST = generateDateList();

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dateExpanded, setDateExpanded] = useState(true);

  const [selection, setSelection] = useState({
    service: null,
    barber: null,
    date: '',
    slot: null,
  });

  const debounceRef = useRef(null);

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
    api.getBarbers().then(setBarbers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selection.barber || !selection.date) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      api.getAvailableSlots(selection.barber.id, selection.date)
        .then((data) => {
          const now = new Date();
          const todayStr = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0');
          const isToday = selection.date === todayStr;

          const timeSlots = data
            .map((slot) => {
              const slotDate = new Date(slot.startTime);
              const isPast = isToday && slotDate.getTime() <= now.getTime();

              return {
                startTime: slot.startTime,
                endTime: slot.endTime,
                label: slot.label,
                available: slot.isAvailable && !isPast,
                isPast,
              };
            })
            .filter((slot) => !slot.isPast); // OCULTAMOS los pasados

          setSlots(timeSlots);
        })
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selection.barber, selection.date]);

  const selectService = (service) => {
    setSelection((p) => ({ ...p, service, barber: null, date: '', slot: null }));
    setStep(2);
  };

  const selectBarber = (barber) => {
    setSelection((p) => ({ ...p, barber, date: '', slot: null }));
    setSlots([]);
    setDateExpanded(true);
    setStep(3);
  };

  const selectDate = useCallback((date) => {
    setSelection((p) => ({ ...p, date, slot: null }));
    setSlots([]);
    setDateExpanded(false);
  }, []);

  const selectSlot = (slot) => {
    setSelection((p) => ({ ...p, slot }));
    setStep(4);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.createAppointment({
        barberId: selection.barber.id,
        serviceId: selection.service.id,
        startTime: selection.slot.startTime,
        payment: 2,
      });
      navigate('/', { state: { toast: '✅ Appointment booked!' } });
    } catch (err) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  const goBack = () => step > 1 ? setStep((p) => p - 1) : navigate(-1);

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f7f3ee]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-4">
          <button onClick={goBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Book Appointment</h1>
            <p className="text-xs text-stone-500">Step {step} of 4</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-amber-500' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-md px-4 pb-8 pt-6">
        {/* STEP 1: Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">What do you need?</h2>
            <div className="grid gap-3">
              {services.map((s) => (
                <button key={s.id} onClick={() => selectService(s)} className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-300">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
                    <Scissors className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-stone-900 group-hover:text-amber-700">{s.name}</h3>
                    <p className="text-sm text-stone-500">{s.description}</p>
                  </div>
                  <p className="text-lg font-bold text-amber-700">{formatCurrency(s.price)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Barber */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">Who's cutting?</h2>
            <div className="grid gap-3">
              {barbers.map((b) => (
                <button key={b.id} onClick={() => selectBarber(b)} className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-300">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-stone-100 group-hover:ring-amber-300">
                    <img src={b.photoUrl || `https://ui-avatars.com/api/?name=${b.names}+${b.lastNames}&background=random`} alt={b.names} className="h-full w-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${b.names}+${b.lastNames}&background=random`; }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-stone-900 group-hover:text-amber-700">{b.names} {b.lastNames}</h3>
                    <p className="text-sm text-amber-600">{b.specialty || 'Master Barber'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Date & Time - REDESIGNED */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-stone-900">When works for you?</h2>

            {/* DATE SELECTOR - Vertical accordion */}
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => setDateExpanded(!dateExpanded)}
                className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-stone-500">Selected date</p>
                    <p className="text-sm font-bold text-stone-900">
                      {selection.date 
                        ? DATE_LIST.find(d => d.value === selection.date)?.label + ' • ' + DATE_LIST.find(d => d.value === selection.date)?.sublabel
                        : 'Pick a date'
                      }
                    </p>
                  </div>
                </div>
                {dateExpanded ? <ChevronUp className="h-5 w-5 text-stone-400" /> : <ChevronDown className="h-5 w-5 text-stone-400" />}
              </button>

              {dateExpanded && (
                <div className="max-h-72 overflow-y-auto">
                  {DATE_LIST.map((dateOpt) => (
                    <button
                      key={dateOpt.value}
                      onClick={() => selectDate(dateOpt.value)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 border-t border-stone-100 transition-all ${
                        selection.date === dateOpt.value
                          ? 'bg-amber-50'
                          : 'bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                          selection.date === dateOpt.value 
                            ? 'bg-amber-200 text-amber-800' 
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          {dateOpt.sublabel.split(' ')[1]}
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-semibold ${selection.date === dateOpt.value ? 'text-amber-700' : 'text-stone-700'}`}>
                            {dateOpt.label}
                          </p>
                          <p className="text-xs text-stone-400">{dateOpt.sublabel}</p>
                        </div>
                      </div>
                      {selection.date === dateOpt.value && (
                        <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TIME SLOTS - pushed down by date list */}
            {selection.date && (
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Available slots</p>
                    <p className="text-xs text-stone-500">
                      {DATE_LIST.find(d => d.value === selection.date)?.label}
                      {loading && <span className="text-amber-600 animate-pulse ml-1">• Loading...</span>}
                    </p>
                  </div>
                </div>

                {slots.length === 0 && !loading ? (
                  <div className="rounded-xl bg-stone-50 p-6 text-center">
                    <Clock className="mx-auto h-8 w-8 text-stone-300 mb-2" />
                    <p className="text-sm text-stone-500">No slots available</p>
                    <p className="text-xs text-stone-400 mt-1">Try selecting another date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => slot.available && selectSlot(slot)} 
                        disabled={!slot.available}
                        className={`rounded-xl border py-3 px-2 text-sm font-semibold transition-all ${
                          slot.available 
                            ? 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 active:scale-95'
                            : 'border-stone-100 bg-stone-100 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <span className="block text-base">{slot.label}</span>
                        {!slot.available && <span className="block text-[10px] text-red-400 mt-1">Booked</span>}
                        {slot.available && <span className="block text-[10px] text-emerald-500 mt-1">Available</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-stone-900">Ready to book?</h2>
              <p className="text-stone-500">Review your appointment details</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Scissors className="h-5 w-5" /></div>
                <div><p className="text-xs text-stone-500">Service</p><p className="font-bold text-stone-900">{selection.service?.name}</p></div>
                <p className="ml-auto font-bold text-amber-700">{formatCurrency(selection.service?.price)}</p>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><User className="h-5 w-5" /></div>
                <div><p className="text-xs text-stone-500">Barber</p><p className="font-bold text-stone-900">{selection.barber?.names} {selection.barber?.lastNames}</p></div>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Clock className="h-5 w-5" /></div>
                <div><p className="text-xs text-stone-500">Date & Time</p><p className="font-bold text-stone-900">{DATE_LIST.find(d => d.value === selection.date)?.label} • {DATE_LIST.find(d => d.value === selection.date)?.sublabel} at {selection.slot?.label}</p></div>
              </div>
            </div>
            <button onClick={submit} disabled={submitting} className="w-full rounded-2xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-50">
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}