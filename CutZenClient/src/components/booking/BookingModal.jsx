import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronRight, Scissors, User, Clock, Calendar, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency } from '../../utils/formatters';

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
            idx < current ? 'bg-emerald-500 text-white' :
            idx === current ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
            'bg-stone-200 text-stone-500'
          }`}>
            {idx < current ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-1 w-8 rounded-full transition-all ${idx < current ? 'bg-emerald-400' : 'bg-stone-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

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

export function BookingModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [dateExpanded, setDateExpanded] = useState(true);

  const [selection, setSelection] = useState({
    service: null,
    barber: null,
    date: '',
    slot: null,
  });

  const debounceRef = useRef(null);
  const steps = ['Service', 'Barber', 'Date & Time', 'Confirm'];

  useEffect(() => {
    if (open) {
      setStep(0);
      setSelection({ service: null, barber: null, date: '', slot: null });
      setSlots([]);
      setLoading(false);
      setDateExpanded(true);
      api.getServices().then(setServices).catch(() => {});
      api.getBarbers().then(setBarbers).catch(() => {});
    }
  }, [open]);

  // Fetch slots con debounce
  useEffect(() => {
    if (!selection.barber || !selection.date) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setFetchingSlots(true);
      api.getAvailableSlots(selection.barber.id, selection.date)
        .then((data) => {
          console.log('📦 Slots received:', data);
          // El backend YA decidió disponibilidad. Solo mapeamos para UI.
          const timeSlots = data.map((slot, idx) => ({
            id: idx, // para key único
            startTime: slot.startTime,
            endTime: slot.endTime,
            label: slot.label,
            available: slot.isAvailable === true, // Asegurar booleano
            isPast: slot.isPast === true,
            isTaken: !slot.isAvailable && !slot.isPast, // Ocupado por otra cita
          }));

          setSlots(timeSlots);
        })
        .catch((err) => {
          console.error('❌ Error fetching slots:', err);
          setSlots([]);
        })
        .finally(() => setFetchingSlots(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selection.barber?.id, selection.date]);

  const selectService = (service) => {
    setSelection((p) => ({ ...p, service }));
    setStep(1);
  };

  const selectBarber = (barber) => {
    setSelection((p) => ({ ...p, barber, date: '', slot: null }));
    setSlots([]);
    setDateExpanded(true);
    setStep(2);
  };

  const selectDate = useCallback((date) => {
    setSelection((p) => ({ ...p, date, slot: null }));
    setSlots([]);
    setDateExpanded(false);
  }, []);

  const selectSlot = (slot) => {
    // VALIDACIÓN ESTRICTA: solo avanzar si está disponible
    if (!slot.available) {
      console.log('❌ Slot not available:', slot);
      return;
    }
    setSelection((p) => ({ ...p, slot }));
    setStep(3);
  };

  const submit = async () => {
    if (!selection.slot?.available) {
      alert('Please select an available time slot.');
      return;
    }

    setLoading(true);
    try {
      await api.createAppointment({
        barberId: selection.barber.id,
        serviceId: selection.service.id,
        startTime: selection.slot.startTime,
        payment: 2,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 0) setStep((p) => p - 1);
  };

  const ServiceStep = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-stone-900 text-center">Choose your service</h3>
      <p className="text-sm text-stone-500 text-center">Select the perfect treatment for you</p>
      <div className="space-y-3 mt-4">
        {services.map((service) => (
          <button key={service.id} onClick={() => selectService(service)} className="group w-full rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-300">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 group-hover:from-amber-100 group-hover:to-orange-100">
                <Scissors className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-900 group-hover:text-amber-700">{service.name}</h4>
                <p className="text-sm text-stone-500 line-clamp-1">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-700">{formatCurrency(service.price)}</p>
                <p className="text-xs text-stone-400">{service.durationMinutes || 60} min</p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-amber-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const BarberStep = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-stone-900 text-center">Choose your barber</h3>
      <p className="text-sm text-stone-500 text-center">Pick who will handle your {selection.service?.name}</p>
      <div className="space-y-3 mt-4">
        {barbers.map((barber) => (
          <button key={barber.id} onClick={() => selectBarber(barber)} className="group w-full rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-amber-300">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-stone-100 group-hover:ring-amber-300">
                <img src={barber.photoUrl || `https://ui-avatars.com/api/?name=${barber.names}+${barber.lastNames}&background=random`} alt={barber.names} className="h-full w-full object-cover" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${barber.names}+${barber.lastNames}&background=random`; }} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-900 group-hover:text-amber-700">{barber.names} {barber.lastNames}</h4>
                <p className="text-sm text-amber-600">{barber.specialty || 'Master Barber'}</p>
                <p className="text-xs text-stone-400">{barber.experience || '5+ years experience'}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-amber-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const DateTimeStep = () => {
    // Contar por estado para debug
    const availableCount = slots.filter(s => s.available).length;
    const pastCount = slots.filter(s => s.isPast).length;
    const takenCount = slots.filter(s => s.isTaken).length;
    const allUnavailable = slots.length > 0 && availableCount === 0;

    console.log(`📊 Slots: ${slots.length} total, ${availableCount} available, ${pastCount} past, ${takenCount} taken`);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 text-center">Pick date & time</h3>
        <p className="text-sm text-stone-500 text-center">
          With <span className="font-semibold text-amber-700">{selection.barber?.names}</span> for {selection.service?.name}
        </p>

        {/* DATE SELECTOR */}
        <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
          <button 
            onClick={() => setDateExpanded(!dateExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-stone-700">
                {selection.date 
                  ? DATE_LIST.find(d => d.value === selection.date)?.label + ' • ' + DATE_LIST.find(d => d.value === selection.date)?.sublabel
                  : 'Select a date'
                }
              </span>
            </div>
            {dateExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
          </button>

          {dateExpanded && (
            <div className="max-h-64 overflow-y-auto">
              {DATE_LIST.map((dateOpt) => (
                <button
                  key={dateOpt.value}
                  onClick={() => selectDate(dateOpt.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 border-t border-stone-100 transition-all ${
                    selection.date === dateOpt.value
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      selection.date === dateOpt.value 
                        ? 'bg-amber-200 text-amber-800' 
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      {dateOpt.sublabel.split(' ')[1]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{dateOpt.label}</p>
                      <p className="text-xs text-stone-400">{dateOpt.sublabel}</p>
                    </div>
                  </div>
                  {selection.date === dateOpt.value && (
                    <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TIME SLOTS */}
        {selection.date && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <Clock className="h-4 w-4 text-amber-600" /> 
                Available slots
              </label>
              {fetchingSlots && <span className="text-xs text-amber-600 animate-pulse">Loading...</span>}
              {!fetchingSlots && slots.length > 0 && (
                <span className="text-xs text-stone-400">{availableCount} of {slots.length}</span>
              )}
            </div>

            {slots.length === 0 && !fetchingSlots ? (
              <div className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                No slots available for this date. The barber may be off that day.
              </div>
            ) : allUnavailable && !fetchingSlots ? (
              <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
                {pastCount > 0 && takenCount === 0 ? (
                  "All time slots for today have already passed. Please select another date."
                ) : pastCount > 0 && takenCount > 0 ? (
                  "All slots are either passed or fully booked. Try another day."
                ) : (
                  "All slots are booked for this date. Try another day."
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      if (slot.available) {
                        selectSlot(slot);
                      }
                    }}
                    disabled={!slot.available}
                    className={`rounded-xl border py-3 text-sm font-semibold transition-all select-none ${
                      slot.available 
                        ? 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 active:scale-95 cursor-pointer'
                        : 'border-stone-100 bg-stone-100 text-stone-400 cursor-not-allowed pointer-events-none opacity-60'
                    }`}
                  >
                    <Clock className={`mx-auto mb-1 h-4 w-4 ${slot.available ? 'text-amber-600' : 'text-stone-300'}`} />
                    <span className="block">{slot.label}</span>
                    
                    {/* Badge de estado */}
                    {slot.isPast && (
                      <span className="block text-[10px] text-stone-500 mt-0.5 font-medium">Expired</span>
                    )}
                    {slot.isTaken && !slot.isPast && (
                      <span className="block text-[10px] text-red-400 mt-0.5 font-medium">Booked</span>
                    )}
                    {slot.available && (
                      <span className="block text-[10px] text-emerald-500 mt-0.5 font-medium">Available</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ConfirmStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-stone-900 text-center">Confirm your booking</h3>
      <div className="rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50/50 p-5 border border-stone-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Scissors className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-stone-500">Service</p>
            <p className="font-bold text-stone-900">{selection.service?.name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-bold text-amber-700">{formatCurrency(selection.service?.price)}</p>
          </div>
        </div>
        <div className="h-px bg-stone-200" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><User className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-stone-500">Barber</p>
            <p className="font-bold text-stone-900">{selection.barber?.names} {selection.barber?.lastNames}</p>
          </div>
        </div>
        <div className="h-px bg-stone-200" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Calendar className="h-5 w-5" /></div>
          <div>
            <p className="text-xs text-stone-500">Date & Time</p>
            <p className="font-bold text-stone-900">
              {DATE_LIST.find(d => d.value === selection.date)?.label} • {DATE_LIST.find(d => d.value === selection.date)?.sublabel} at {selection.slot?.label}
            </p>
          </div>
        </div>
      </div>
      <button 
        className="w-full rounded-2xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-50" 
        onClick={submit} 
        disabled={loading}
      >
        {loading ? 'Confirming...' : 'Confirm Appointment'}
      </button>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Book Appointment</h2>
            <p className="text-xs text-stone-500">Step {step + 1} of 4 — {steps[step]}</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 pt-4">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-amber-500' : 'bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <StepIndicator steps={steps} current={step} />
          {step === 0 && <ServiceStep />}
          {step === 1 && <BarberStep />}
          {step === 2 && <DateTimeStep />}
          {step === 3 && <ConfirmStep />}
          <div className="flex gap-3 pt-2">
            {step > 0 && step < 3 && (
              <button onClick={goBack} className="flex-1 rounded-xl border border-stone-300 bg-white py-3 text-sm font-semibold text-stone-700 transition-all hover:bg-stone-50 active:scale-[0.98]">← Back</button>
            )}
            {step === 3 && (
              <button onClick={submit} disabled={loading} className="flex-1 rounded-xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50">
                {loading ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}