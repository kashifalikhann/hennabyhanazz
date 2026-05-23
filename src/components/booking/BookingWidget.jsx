import { useState } from 'react';
import { services, paymentLinks } from '../../lib/payments';

const t = {
  en: {
    step: 'Step', of: 'of', selectService: 'Select a Service',
    pickDate: 'Pick a Date & Time', yourDetails: 'Your Details',
    confirm: 'Confirm & Pay', next: 'Next', back: 'Back',
    name: 'Full Name', email: 'Email Address', phone: 'Phone Number',
    notes: 'Special Requests',
    complete: 'Complete Booking',
    noService: 'Please select a service', fillDetails: 'Please fill in all required fields',
    selectDate: 'Please select a date and time',
    privacyConsent: 'I have read and agree to the',
    privacyPolicy: 'Privacy Policy',
    dateLabel: 'Preferred Date', timeLabel: 'Preferred Time',
    summaryTitle: 'Booking Summary',
    payMsg: 'You will be redirected to Stripe to complete payment.',
    bookingCode: 'Your booking code',
  },
  es: {
    step: 'Paso', of: 'de', selectService: 'Selecciona un Servicio',
    pickDate: 'Elige Fecha y Hora', yourDetails: 'Tus Datos',
    confirm: 'Confirmar y Pagar', next: 'Siguiente', back: 'Atrás',
    name: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono',
    notes: 'Solicitudes Especiales',
    complete: 'Completar Reserva',
    noService: 'Por favor selecciona un servicio', fillDetails: 'Por favor completa todos los campos',
    selectDate: 'Por favor selecciona una fecha y hora',
    privacyConsent: 'He leído y acepto la',
    privacyPolicy: 'Política de Privacidad',
    dateLabel: 'Fecha Preferida', timeLabel: 'Hora Preferida',
    summaryTitle: 'Resumen de Reserva',
    payMsg: 'Serás redirigido a Stripe para completar el pago.',
    bookingCode: 'Tu código de reserva',
  }
};

const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function generateCode() {
  return 'HBH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function BookingWidget({ lang = 'en' }) {
  const s = t[lang];
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const selectedService = services.find(s => s.id === selectedId);

  const nextStep = () => {
    if (step === 1 && !selectedId) { setError(s.noService); return; }
    if (step === 2 && (!date || !time)) { setError(s.selectDate); return; }
    if (step === 3 && (!name || !email)) { setError(s.fillDetails); return; }
    if (step === 3 && !consent) { setError(lang === 'en' ? 'Please accept the Privacy Policy' : 'Por favor acepta la Política de Privacidad'); return; }
    setError('');
    setStep(prev => Math.min(prev + 1, 4));
  };

  const submitBooking = () => {
    const code = generateCode();
    const booking = {
      service: selectedService.id,
      serviceName: lang === 'en' ? selectedService.nameEn : selectedService.nameEs,
      date, time, name, email, phone, notes, code, lang
    };
    localStorage.setItem('hbnb_booking', JSON.stringify(booking));
    window.location.href = paymentLinks[selectedService.id];
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
              i <= step ? 'bg-gold text-bg' : 'bg-surface text-muted border border-border'
            }`}>{i}</div>
            {i < 4 && <div className={`w-8 h-0.5 transition-all duration-500 ${i < step ? 'bg-gold' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {step === 1 && (
        <div>
          <h3 className="font-display text-xl font-semibold mb-6">{s.selectService}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map(sv => (
              <button
                key={sv.id}
                onClick={() => { setSelectedId(sv.id); setError(''); }}
                className={`text-left p-6 rounded-xl border transition-all duration-500 ${
                  selectedId === sv.id ? 'border-gold bg-gold/5' : 'border-border bg-surface hover:border-gold/50'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-muted">{sv.category}</span>
                <h4 className="font-display font-semibold mt-1">{lang === 'en' ? sv.nameEn : sv.nameEs}</h4>
                <p className="text-sm text-muted mt-1">{lang === 'en' ? sv.descriptionEn : sv.descriptionEs}</p>
                <p className="font-display text-lg font-bold text-gold mt-3">€{sv.price}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <button onClick={nextStep} className="btn-primary">{s.next}<span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-display text-xl font-semibold mb-6">{s.pickDate}</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted block mb-2">{s.dateLabel}</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-muted block mb-2">{s.timeLabel}</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      time === slot ? 'bg-gold text-bg' : 'bg-surface border border-border text-muted hover:border-gold/50'
                    }`}
                  >{slot}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(1)} className="btn-ghost">{s.back}</button>
            <button onClick={nextStep} className="btn-primary">{s.next}<span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-display text-xl font-semibold mb-6">{s.yourDetails}</h3>
          <div className="space-y-4">
            <input type="text" placeholder={s.name} value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors" />
            <input type="email" placeholder={s.email} value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors" />
            <input type="tel" placeholder={s.phone} value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors" />
            <textarea placeholder={s.notes} value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors resize-none" />
            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 shrink-0 accent-gold" />
              <span className="text-xs text-muted/70 leading-relaxed">
                {s.privacyConsent} <a href={lang === 'es' ? '/es/privacidad' : '/privacy'} target="_blank" rel="noopener noreferrer" className="text-gold underline hover:no-underline">{s.privacyPolicy}</a>.
              </span>
            </label>
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(2)} className="btn-ghost">{s.back}</button>
            <button onClick={nextStep} className="btn-primary">{s.next}<span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></button>
          </div>
        </div>
      )}

      {step === 4 && selectedService && (
        <div>
          <h3 className="font-display text-xl font-semibold mb-6">{s.summaryTitle}</h3>
          <div className="bg-surface rounded-xl p-6 border border-border mb-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted">{lang === 'en' ? selectedService.nameEn : selectedService.nameEs}</span>
              <span className="font-display font-bold text-gold">€{selectedService.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted text-sm">{s.dateLabel}</span>
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted text-sm">{s.timeLabel}</span>
              <span className="text-sm">{time}</span>
            </div>
            {name && <div className="flex justify-between"><span className="text-muted text-sm">{s.name}</span><span className="text-sm">{name}</span></div>}
            {email && <div className="flex justify-between"><span className="text-muted text-sm">{s.email}</span><span className="text-sm">{email}</span></div>}
          </div>

          <p className="text-xs text-muted mb-6">{s.payMsg}</p>

          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="btn-ghost">{s.back}</button>
            <button onClick={submitBooking} className="btn-primary">
              {s.complete}
              <span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
