import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard({ lang = 'en' }) {
  const [view, setView] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setAuth(data.session);
        loadData();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [b, s, g] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('gift_certificates').select('*').order('created_at', { ascending: false }),
    ]);
    if (!b.error) setBookings(b.data);
    if (!s.error) setServices(s.data);
    if (!g.error) setGifts(g.data);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); return; }
    setAuth(data.session);
    loadData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuth(null);
  };

  if (!auth) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <div className="bg-surface rounded-2xl border border-border p-8">
          <h2 className="font-display text-xl font-bold mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors" />
            <button type="submit" className="btn-primary w-full justify-center">Login</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-muted">Loading...</div>;
  }

  const tabs = [
    { id: 'bookings', label: 'Bookings', count: bookings.length },
    { id: 'services', label: 'Services', count: services.length },
    { id: 'gifts', label: 'Gift Certs', count: gifts.length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                view === t.id ? 'bg-gold text-bg' : 'bg-surface text-muted border border-border hover:border-gold/50'
              }`}
            >
              {t.label} <span className="opacity-60">({t.count})</span>
            </button>
          ))}
        </div>
        <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
      </div>

      {view === 'bookings' && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-[10px] uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Time</th>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-3">{b.booking_date}</td>
                    <td className="px-4 py-3">{b.booking_time}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.client_name}</div>
                      <div className="text-muted text-xs">{b.client_email}</div>
                    </td>
                    <td className="px-4 py-3">{b.service_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                        b.payment_status === 'paid' ? 'bg-green-500/10 text-green-400' :
                        b.payment_status === 'deposit' ? 'bg-gold/10 text-gold' : 'bg-red-500/10 text-red-400'
                      }`}>{b.payment_status}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">€{b.amount / 100}</td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted">No bookings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'services' && (
        <div className="grid md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-surface rounded-2xl border border-border p-6">
              <span className="text-[10px] uppercase tracking-wider text-muted">{s.category}</span>
              <h3 className="font-display font-semibold mt-1">{lang === 'en' ? s.name_en : s.name_es}</h3>
              <p className="text-sm text-muted mt-1">€{s.price} · {s.duration}min</p>
              <span className={`inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] uppercase font-medium ${
                s.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>{s.active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      )}

      {view === 'gifts' && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted text-[10px] uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Tier</th>
                  <th className="text-left px-4 py-3">From</th>
                  <th className="text-left px-4 py-3">To</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map(g => (
                  <tr key={g.id} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{g.code}</td>
                    <td className="px-4 py-3">{g.tier}</td>
                    <td className="px-4 py-3">{g.sender_name}</td>
                    <td className="px-4 py-3">{g.recipient_email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                        g.redeemed ? 'bg-green-500/10 text-green-400' : 'bg-gold/10 text-gold'
                      }`}>{g.redeemed ? 'Redeemed' : 'Active'}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">€{g.amount / 100}</td>
                  </tr>
                ))}
                {gifts.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted">No gift certificates yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
