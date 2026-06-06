/**
 * CHANGES vs original Dashboard.jsx:
 *
 * 1. ABORTCONTROLLER (High) — All three parallel API calls now share a single
 *    AbortController. When the user navigates away before the data arrives,
 *    all in-flight requests are cancelled and setState is never called on the
 *    unmounted component.
 *
 * 2. STALE STATE GUARD (High) — Added explicit mounted check in catch/finally
 *    so even non-aborting errors don't update state after unmount.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPropertyStats, getProperties, getInquiries } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  Building2, TrendingUp, Eye, MessageSquare, Plus,
  Settings, Star, CheckCircle, Clock,
} from 'lucide-react';

function StatCard({ icon, label, value, sub, color, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid',
        borderColor: hov ? color : 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        transition: 'all 0.35s',
        cursor: 'default',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px ${color}22` : 'none',
        animation: `fadeInUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, transition: 'transform 0.3s',
          transform: hov ? 'scale(1.15) rotate(5deg)' : 'none',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 600, color, lineHeight: 1, marginBottom: '0.35rem' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]       = useState(null);
  const [recent, setRecent]     = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // ADDED: AbortController shared across all three parallel requests
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getPropertyStats(signal),
      getProperties({ limit: 5, sort: '-createdAt' }, signal),
      getInquiries(signal),
    ])
      .then(([s, p, i]) => {
        setStats(s.data);
        setRecent(p.data.properties);
        setInquiries(i.data.slice(0, 5));
      })
      .catch((err) => {
        // Silently ignore intentional cancellations
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        console.error('Dashboard load error:', err);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    // ADDED: cleanup cancels all in-flight requests on unmount
    return () => controller.abort();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem' }}>
      <div className="loader-ring" style={{ width: 48, height: 48 }} />
    </div>
  );

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Admin Panel</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 600 }}>
              Welcome, {user?.name?.split(' ')[0]} 👋
            </h1>
            <div className="gold-divider" style={{ marginTop: '0.75rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/add-property" className="btn btn-gold">
              <Plus size={16} /> Add Property
            </Link>
            <Link to="/admin/properties" className="btn btn-ghost">
              <Settings size={16} /> Manage
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
            <StatCard icon={<Building2 size={20} />} label="Total Properties" value={stats.total}    sub="All listings"    color="var(--gold)"   delay={0}   />
            <StatCard icon={<TrendingUp size={20} />} label="For Sale"        value={stats.forSale}  sub={`${stats.available} available`} color="#6495ED"  delay={0.1} />
            <StatCard icon={<Eye size={20} />}         label="For Rent"        value={stats.forRent}  sub="Active rentals"  color="#9B59B6"  delay={0.2} />
            <StatCard icon={<CheckCircle size={20} />} label="Sold"            value={stats.sold}     sub="Completed"       color="var(--success)" delay={0.3} />
            <StatCard icon={<Star size={20} />}        label="Featured"        value={stats.featured} sub="Highlighted"     color="#E8C97A"  delay={0.4} />
            <StatCard icon={<MessageSquare size={20} />} label="Inquiries"     value={inquiries.length} sub="Total received" color="#E67E22" delay={0.5} />
          </div>
        )}

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Recent Properties */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', animation: 'fadeInLeft 0.6s ease 0.3s both' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>Recent Properties</h2>
              <Link to="/admin/properties" style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>View All →</Link>
            </div>
            {recent.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Building2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <p>No properties yet</p>
                <Link to="/admin/add-property" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>Add First Property</Link>
              </div>
            ) : (
              <div>
                {recent.map((p, i) => (
                  <div key={p._id}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-card)', flexShrink: 0 }}>
                      {/* ADDED: loading="lazy" to avoid eager image fetching */}
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=60'}
                        alt=""
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.location?.city} • {p.category}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.88rem', color: 'var(--gold)', fontWeight: 600 }}>
                        ₹{p.price >= 100000 ? `${(p.price / 100000).toFixed(1)}L` : p.price?.toLocaleString()}
                      </div>
                      <span style={{
                        fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 100,
                        background: p.status === 'available' ? 'rgba(76,175,124,0.15)' : 'rgba(201,168,76,0.15)',
                        color: p.status === 'available' ? 'var(--success)' : 'var(--gold)',
                      }}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', animation: 'fadeInRight 0.6s ease 0.3s both' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>Recent Inquiries</h2>
              <span style={{ fontSize: '0.78rem', background: 'rgba(230,126,34,0.15)', color: '#E67E22', padding: '0.2rem 0.6rem', borderRadius: 100 }}>
                {inquiries.filter(i => i.status === 'pending').length} pending
              </span>
            </div>
            {inquiries.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <p>No inquiries yet</p>
              </div>
            ) : (
              <div>
                {inquiries.map((inq, i) => (
                  <div key={inq._id} style={{ padding: '1rem 1.5rem', borderBottom: i < inquiries.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0A0A0F', flexShrink: 0 }}>
                      {inq.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{inq.name}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 100, background: inq.status === 'pending' ? 'rgba(230,126,34,0.15)' : 'rgba(76,175,124,0.15)', color: inq.status === 'pending' ? '#E67E22' : 'var(--success)', flexShrink: 0 }}>
                          {inq.status === 'pending' ? <><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />Pending</> : 'Resolved'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {inq.property?.title || 'Property'} • {inq.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { to: '/admin/add-property', icon: '➕', label: 'Add New Property',    desc: 'List a new property',       color: 'var(--gold)' },
            { to: '/admin/properties',   icon: '📋', label: 'Manage Properties',  desc: 'Edit or delete listings',   color: '#6495ED' },
            { to: '/properties',         icon: '🏠', label: 'View Frontend',      desc: 'See user-facing site',      color: '#9B59B6' },
          ].map(a => (
            <Link key={a.to} to={a.to}
              style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: '1.75rem' }}>{a.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: a.color }}>{a.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}