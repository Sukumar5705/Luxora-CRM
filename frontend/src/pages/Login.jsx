import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, ...user } = res.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--ivory)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'var(--navy)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem',
        position: 'relative', overflow: 'hidden',
      }} className="hide-md">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(13,27,42,0.8) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 400, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={28} color="#c9a84c" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
            Welcome to<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>EstateX</em>
          </h2>
          <p style={{ color: 'rgba(248,245,240,0.55)', fontSize: '0.95rem', lineHeight: 1.75 }}>
            India's most sophisticated real estate platform. Sign in to access premium properties and exclusive listings.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem', textAlign: 'left' }}>
            {['2,400+ Properties', '98% Satisfaction', '15+ Cities', '1,800+ Clients'].map(stat => (
              <div key={stat} style={{ padding: '1rem', background: 'rgba(248,245,240,0.05)', border: '1px solid rgba(248,245,240,0.08)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.85rem', color: 'rgba(248,245,240,0.6)' }}>{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3rem', background: 'var(--white)' }}>
        {/* Logo (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} color="#c9a84c" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>
            Estate<span style={{ color: 'var(--gold)' }}>X</span>
          </span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.5rem' }}>Sign In</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your credentials to continue</p>
        </div>

        {/* Demo credentials */}
        <div style={{ background: 'var(--ivory)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Demo Credentials</p>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>
            <strong>Admin:</strong> admin@luxestate.com / admin123
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="admin@luxestate.com" className="form-input" style={{ paddingLeft: '2.75rem' }} required />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="••••••••" className="form-input" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-navy btn-full btn-lg" style={{ borderRadius: 10, marginTop: '0.5rem', opacity: loading ? 0.75 : 1 }} disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(248,245,240,0.3)', borderTopColor: '#fff' }} /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
