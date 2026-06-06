import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, ArrowRight, CheckCircle } from 'lucide-react';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      const { token, ...user } = res.data;
      login(user, token);
      toast.success(`Welcome to EstateX, ${user.name?.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Access to 2,400+ premium listings', 'Save favourite properties', 'Direct agent communication', 'Priority property alerts'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--ivory)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem', position: 'relative', overflow: 'hidden' }} className="hide-md">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(13,27,42,0.8) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={28} color="#c9a84c" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', textAlign: 'center' }}>
            Join <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>EstateX</em><br />Today
          </h2>
          <p style={{ color: 'rgba(248,245,240,0.55)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '2.5rem', textAlign: 'center' }}>
            Create your free account and unlock access to India's finest property listings.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {perks.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={13} color="#c9a84c" />
                </div>
                <span style={{ fontSize: '0.87rem', color: 'rgba(248,245,240,0.7)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', background: 'var(--white)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} color="#c9a84c" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>Estate<span style={{ color: 'var(--gold)' }}>X</span></span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.4rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Free forever. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {[
            { label: 'Full Name *', key: 'name', type: 'text', icon: User, placeholder: 'Your full name' },
            { label: 'Email Address *', key: 'email', type: 'email', icon: Mail, placeholder: 'your@email.com' },
            { label: 'Phone Number', key: 'phone', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
          ].map(({ label, key, type, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
                <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                  placeholder={placeholder} className="form-input" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          ))}

          <div>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Min. 6 characters" className="form-input" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                placeholder="Re-enter password" className="form-input" style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-navy btn-full btn-lg" style={{ borderRadius: 10, marginTop: '0.5rem', opacity: loading ? 0.75 : 1 }} disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(248,245,240,0.3)', borderTopColor: '#fff' }} /> Creating account...</>
            ) : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.77rem', color: 'var(--text-faint)' }}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
