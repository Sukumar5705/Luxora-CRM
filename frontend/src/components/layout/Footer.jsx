import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--navy)', color: 'var(--text-inv)', position: 'relative', overflow: 'hidden' }}>
      {/* Top gold line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 60%, transparent 100%)' }} />

      {/* Decorative circle */}
      <div style={{
        position: 'absolute', top: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ padding: '4.5rem 2rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={17} color="#c9a84c" />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                Estate<span style={{ color: 'var(--gold)' }}>X</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.88rem', color: 'rgba(248,245,240,0.55)', lineHeight: 1.8, marginBottom: '1.75rem', maxWidth: 280 }}>
              India's most sophisticated real estate platform — connecting discerning buyers and sellers with premium properties across the country.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid rgba(248,245,240,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(248,245,240,0.4)', transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(248,245,240,0.1)'; e.currentTarget.style.color = 'rgba(248,245,240,0.4)'; e.currentTarget.style.background = 'transparent'; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>Navigate</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[['/', 'Home'], ['/properties', 'Browse Properties'], ['/properties?type=sale', 'Buy Property'], ['/properties?type=rent', 'Rent Property']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{
                    fontSize: '0.87rem', color: 'rgba(248,245,240,0.55)',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--ivory)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,245,240,0.55)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h5 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>Property Types</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Apartments', 'Villas', 'Houses', 'Commercial', 'Land', 'Condos'].map(type => (
                <li key={type}>
                  <Link to={`/properties?category=${type.toLowerCase()}`} style={{
                    fontSize: '0.87rem', color: 'rgba(248,245,240,0.55)', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--ivory)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,245,240,0.55)'}>
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>Contact</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { Icon: MapPin, text: '123 Jubilee Hills, Hyderabad, Telangana 500033' },
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@estatex.in' },
              ].map(({ Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Icon size={14} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'rgba(248,245,240,0.55)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.1rem',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 10,
              }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(248,245,240,0.7)' }}>Schedule a call</span>
                <ArrowUpRight size={16} style={{ color: 'var(--gold)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(248,245,240,0.06)',
          paddingTop: '1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(248,245,240,0.35)' }}>
            © {year} EstateX. All rights reserved. India's Premium Real Estate CRM.
          </p>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(t => (
              <a key={t} href="#" style={{
                fontSize: '0.8rem', color: 'rgba(248,245,240,0.35)', transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(248,245,240,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,245,240,0.35)'}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  );
}
