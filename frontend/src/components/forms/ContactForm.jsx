import { useState } from 'react';
import { submitInquiry } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, Phone, Mail, User, MessageSquare, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function ContactForm({ propertyId, propertyTitle }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: `Hi, I'm interested in "${propertyTitle || 'this property'}". Please provide more details.`
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      await submitInquiry({ ...form, property: propertyId });
      toast.success("Inquiry sent! We'll contact you within 24 hours.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem 2rem',
        background: 'var(--success-bg)',
        border: '1px solid rgba(46,125,82,0.2)',
        borderRadius: 'var(--r-xl)',
        animation: 'scaleIn 0.4s ease',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--success)', margin: '0 auto 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CheckCircle2 size={30} color="white" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
          Inquiry Submitted!
        </h3>
        <p style={{ color: 'var(--success)', opacity: 0.8, fontSize: '0.9rem' }}>
          Our team will reach out within 24 hours.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm"
          style={{ marginTop: '1.5rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem 1.75rem',
        background: 'var(--navy)',
        borderBottom: '1px solid rgba(248,245,240,0.08)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--ivory)', marginBottom: '0.25rem' }}>
          Contact Agent
        </h3>
        <p style={{ color: 'rgba(248,245,240,0.55)', fontSize: '0.83rem' }}>
          We'll respond within 24 hours
        </p>
      </div>

      <div style={{ padding: '1.75rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', icon: User, placeholder: 'Your full name' },
            { label: 'Email Address', key: 'email', type: 'email', icon: Mail, placeholder: 'your@email.com' },
            { label: 'Phone Number', key: 'phone', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
          ].map(({ label, key, type, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="form-label">{label} *</label>
              <div className="form-input-icon">
                <Icon size={14} className="icon" />
                <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                  placeholder={placeholder} className="form-input" required
                  style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          ))}

          <div>
            <label className="form-label">Message *</label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={14} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-faint)', pointerEvents: 'none' }} />
              <textarea value={form.message} onChange={e => set('message', e.target.value)}
                rows={4} placeholder="Write your message..." className="form-textarea"
                required style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-navy btn-full btn-lg"
            style={{ gap: '0.5rem', opacity: loading ? 0.75 : 1, borderRadius: 10 }}
            disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending...</>
            ) : (
              <><Send size={15} /> Send Inquiry</>
            )}
          </button>
        </form>

        {/* Trust badges */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '1.5rem',
          marginTop: '1.25rem', paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
        }}>
          {[
            { icon: <Shield size={12} />, text: 'Secure' },
            { icon: <Zap size={12} />, text: 'Fast Response' },
            { icon: <CheckCircle2 size={12} />, text: 'Verified Agents' },
          ].map(({ icon, text }) => (
            <span key={text} style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.75rem', color: 'var(--text-faint)',
            }}>
              {icon} {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
