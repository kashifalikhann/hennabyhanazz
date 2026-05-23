import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const t = {
  en: {
    step: 'Step', of: 'of', selectService: 'Select a Service',
    pickDate: 'Pick a Date & Time', yourDetails: 'Your Details',
    payment: 'Payment', next: 'Next', back: 'Back',
    name: 'Full Name', email: 'Email Address', phone: 'Phone Number',
    notes: 'Special Requests', fullPayment: 'Pay Full Amount',
    depositPayment: 'Pay 50% Deposit', complete: 'Complete Booking',
    processing: 'Processing...', success: 'Booking Confirmed!',
    successMsg: 'Check your email for confirmation details.',
    error: 'Something went wrong. Please try again.',
    bookingCode: 'Your booking code',     payWithCard: 'You will be redirected to Stripe to complete payment.',
    noService: 'Please select a service', fillDetails: 'Please fill in all required fields',
    selectDate: 'Please select a date and time', from: 'from',
    privacyConsent: 'I have read and agree to the',
    privacyPolicy: 'Privacy Policy',
  },
  es: {
    step: 'Paso', of: 'de', selectService: 'Selecciona un Servicio',
    pickDate: 'Elige Fecha y Hora', yourDetails: 'Tus Datos',
    payment: 'Pago', next: 'Siguiente', back: 'Atrás',
    name: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono',
    notes: 'Solicitudes Especiales', fullPayment: 'Pagar Importe Total',
    depositPayment: 'Pagar 50% Depósito', complete: 'Completar Reserva',
    processing: 'Procesando...', success: '¡Reserva Confirmada!',
    successMsg: 'Revisa tu correo para los detalles de confirmación.',
    error: 'Algo salió mal. Intenta de nuevo.',
    bookingCode: 'Tu código de reserva',     payWithCard: 'Serás redirigido a Stripe para completar el pago.',
    noService: 'Por favor selecciona un servicio', fillDetails: 'Por favor completa todos los campos requeridos',
    selectDate: 'Por favor selecciona una fecha y hora', from: 'desde',
    privacyConsent: 'He leído y acepto la',
    privacyPolicy: 'Política de Privacidad',
  }
};

const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function BookingWidget({ lang = 'en' }) {
  const s = t[lang];
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState('deposit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [consent, setConsent] = useState(false);

  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    setLoadingServices(true);
    supabase.from('services').select('*').order('sort_order').then(({ data, error }) => {
      if (!error && data) setServices(data);
      setLoadingServices(false);
    });
  }, []);

  const nextStep = () => {
    if (step === 1 && !selectedService) { setError(s.noService); return; }
    if (step === 2 && (!date || !time)) { setError(s.selectDate); return; }
    if (step === 3 && (!name || !email)) { setError(s.fillDetails); return; }
    if (step === 3 && !consent) { setError(lang === 'en' ? 'Please accept the Privacy Policy' : 'Por favor acepta la Política de Privacidad'); return; }
    setError('');
    setStep(prev => Math.min(prev + 1, 4));
  };

  const submitBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const amount = paymentMode === 'deposit'
        ? selectedService.price * (selectedService.deposit_percentage / 100)
        : selectedService.price;

      const res = await fetch(
        `${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: selectedService.id,
            amount: Math.round(amount * 100),
            client_name: name,
            client_email: email,
            client_phone: phone,
            booking_date: date,
            booking_time: time,
            notes,
          }),
        }
      );

      const data = await res.json();
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error(data.error || 'No session URL');
      }
    } catch (err) {
      setError(err.message || s.error);
    } finally {
      setLoading(false);
    }
  };

  const amount = selectedService?.price || 0;
  const deposit = selectedService ? amount * (selectedService.deposit_percentage / 100) : 0;

  return (
    <div>
      {confirmed ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold">{s.success}</h3>
          <p className="text-muted mt-2">{s.successMsg}</p>
          {confirmed && (
            <p className="mt-4 text-sm text-gold font-mono">{s.bookingCode}: <strong>{confirmed}</strong></p>
          )}
        </div>
      ) : (
        <>
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
              {loadingServices ? (
                <div className="text-center py-12 text-muted">
                  <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-sm">Loading services...</p>
                </div>
              ) : services.filter(sv => sv.active !== false).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted text-sm">Services are being set up. Please check back soon or contact us via WhatsApp.</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.filter(sv => sv.active !== false).map(sv => (
                      <button
                        key={sv.id}
                        onClick={() => { setSelectedService(sv); setError(''); }}
                        className={`text-left p-6 rounded-xl border transition-all duration-500 ${
                          selectedService?.id === sv.id
                            ? 'border-gold bg-gold/5'
                            : 'border-border bg-surface hover:border-gold/50'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-muted">{sv.category}</span>
                        <h4 className="font-display font-semibold mt-1">{lang === 'en' ? sv.name_en : sv.name_es}</h4>
                        <p className="text-sm text-muted mt-1">{lang === 'en' ? sv.description_en : sv.description_es}</p>
                        <p className="font-display text-lg font-bold text-gold mt-3">€{sv.price}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <button onClick={nextStep} className="btn-primary">{s.next}<span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span></button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-6">{s.pickDate}</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted block mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted block mb-2">Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          time === slot
                            ? 'bg-gold text-bg'
                            : 'bg-surface border border-border text-muted hover:border-gold/50'
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

          {step === 4 && (
            <div>
              <h3 className="font-display text-xl font-semibold mb-6">{s.payment}</h3>
              <div className="bg-surface rounded-xl p-6 border border-border mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                  <span className="text-muted">{lang === 'en' ? selectedService?.name_en : selectedService?.name_es}</span>
                  <span className="font-display font-bold">€{amount}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted">Date</span>
                  <span>{date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Time</span>
                  <span>{time}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentMode('full')}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-500 ${
                    paymentMode === 'full' ? 'border-gold bg-gold/5' : 'border-border bg-surface'
                  }`}
                >
                  <span className="font-display font-semibold">{s.fullPayment}</span>
                  <p className="text-gold font-display font-bold mt-1">€{amount.toFixed(2)}</p>
                </button>
                <button
                  onClick={() => setPaymentMode('deposit')}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-500 ${
                    paymentMode === 'deposit' ? 'border-gold bg-gold/5' : 'border-border bg-surface'
                  }`}
                >
                  <span className="font-display font-semibold">{s.depositPayment}</span>
                  <p className="text-gold font-display font-bold mt-1">€{deposit.toFixed(2)}</p>
                </button>
              </div>

              <p className="text-xs text-muted mb-6">{s.payWithCard}</p>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="btn-ghost">{s.back}</button>
                <button onClick={submitBooking} disabled={loading} className="btn-primary">
                  {loading ? s.processing : s.complete}
                  {!loading && <span className="icon-wrap !w-6 !h-6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
