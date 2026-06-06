import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Search,
  ArrowRight,
  ArrowUpRight,
  Building2,
  TreePine,
  Briefcase,
  MapPin,
  TrendingUp,
  Shield,
  Users,
  Star,
  ChevronRight,
  Play,
  CheckCircle
} from 'lucide-react';
import { getProperties } from '../api/axios';
import PropertyCard from '../components/property/PropertyCard';

/* ─── Hero Section ─── */
function HeroSection() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (type) p.set('type', type);
    navigate(`/properties?${p.toString()}`);
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      background: 'var(--navy)',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.25,
      }} />

      {/* Layered overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(120deg, rgba(13,27,42,0.98) 0%, rgba(13,27,42,0.75) 55%, rgba(13,27,42,0.5) 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(to top, var(--navy) 0%, transparent 100%)',
      }} />

      {/* Decorative gold orb */}
      <div style={{
        position: 'absolute', top: '15%', right: '5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Grid lines decoration */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '8rem', paddingBottom: '6rem' }}>
        <div style={{ maxWidth: 700 }}>
          {/* Tag pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.4rem 1.1rem', borderRadius: 100,
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'rgba(201,168,76,0.08)',
            marginBottom: '2rem',
            animation: 'fadeLeft 0.6s ease 0.1s both',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Premium Real Estate — Est. 2025
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
            fontWeight: 700, color: '#fff',
            lineHeight: 1.08, marginBottom: '1.5rem',
            animation: 'fadeUp 0.7s ease 0.2s both',
          }}>
            Find Your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Perfect</em> Home<br />
            <span style={{ color: 'rgba(255,255,255,0.75)' }}>Today</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
            color: 'rgba(248,245,240,0.65)', lineHeight: 1.75,
            maxWidth: 520, marginBottom: '2.75rem',
            fontWeight: 300,
            animation: 'fadeUp 0.7s ease 0.35s both',
          }}>
            We provide tailored real estate solutions, guiding you through every step with personalised experiences that meet your unique needs and aspirations.
          </p>

          {/* Search box */}
          <form onSubmit={handleSearch} style={{
            display: 'flex', gap: '0.6rem', flexWrap: 'wrap',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14, padding: '0.9rem',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            animation: 'fadeUp 0.7s ease 0.5s both',
            maxWidth: 620,
          }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="City, address, keyword..."
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 9, color: '#fff', fontSize: '0.92rem', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <select value={type} onChange={e => setType(e.target.value)} style={{
              padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9,
              color: type ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '0.88rem', outline: 'none', minWidth: 130,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}>
              <option value="" style={{ background: '#0d1b2a' }}>Any Type</option>
              <option value="sale" style={{ background: '#0d1b2a' }}>For Sale</option>
              <option value="rent" style={{ background: '#0d1b2a' }}>For Rent</option>
            </select>
            <button type="submit" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              background: 'var(--gold)', color: 'var(--navy)',
              borderRadius: 9, fontWeight: 700, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
              transition: 'all 0.25s',
            }}>
              <Search size={14} /> Explore
            </button>
          </form>

          {/* Quick tags */}
          <div style={{
            display: 'flex', gap: '0.6rem', marginTop: '1.5rem', flexWrap: 'wrap',
            animation: 'fadeUp 0.7s ease 0.65s both',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(248,245,240,0.4)', alignSelf: 'center' }}>Popular:</span>
            {['Apartments', 'Villas', 'Commercial', 'Land'].map(tag => (
              <Link key={tag} to={`/properties?category=${tag.toLowerCase()}`} style={{
                padding: '0.3rem 0.85rem', borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(248,245,240,0.65)', fontSize: '0.78rem',
                background: 'rgba(255,255,255,0.04)',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(248,245,240,0.65)'; }}>
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '0', marginTop: '5rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '2.5rem', flexWrap: 'wrap', gap: '2rem',
          animation: 'fadeUp 0.7s ease 0.8s both',
        }}>
          {[
            { val: '2,400+', label: 'Properties Listed' },
            { val: '1,800+', label: 'Happy Clients' },
            { val: '98%', label: 'Satisfaction Rate' },
            { val: '15+', label: 'Cities Covered' },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'left', paddingRight: '2rem', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.77rem', color: 'rgba(248,245,240,0.45)', marginTop: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Agent avatars */}
        <div style={{
          position: 'absolute', bottom: '3rem', right: '2rem',
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14, padding: '0.875rem 1.25rem',
          animation: 'fadeRight 0.6s ease 1s both',
        }} className="hide-md">
          <div style={{ display: 'flex' }}>
            {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80',
            ].map((src, i) => (
              <img key={i} src={src} alt="" style={{
                width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid rgba(13,27,42,0.5)',
                marginLeft: i > 0 ? -10 : 0,
              }} onError={e => e.target.style.display='none'} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>10+ Featured Agents</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={11} style={{ color: 'var(--gold)' }} fill="#c9a84c" />)}
              <span style={{ fontSize: '0.75rem', color: 'rgba(248,245,240,0.6)' }}>5 / 5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
function ServicesSection() {
  const services = [
    { icon: <HomeIcon size={22} />, title: 'Property Sales', desc: 'Expert guidance through every step of buying or selling your property.' },
    { icon: <Building2 size={22} />, title: 'Rentals Management', desc: 'Full-service rental management from listings to tenant relations.' },
    { icon: <TrendingUp size={22} />, title: 'Investment Advisory', desc: 'Data-driven investment strategies for maximum returns.' },
    { icon: <Shield size={22} />, title: 'Legal Assistance', desc: 'Complete legal support for all property transactions and documentation.' },
    { icon: <Users size={22} />, title: 'Buyer Representation', desc: 'Dedicated representation prioritising your interests throughout.' },
    { icon: <Briefcase size={22} />, title: 'Commercial Properties', desc: 'Premium commercial spaces for businesses of every scale.' },
  ];

  return (
    <section style={{ background: 'var(--white)', padding: '6rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div className="section-pill">What We Offer</div>
            <h2 className="section-title-lg" style={{ marginBottom: '1.25rem' }}>
              Comprehensive<br />Real Estate Solutions
            </h2>
            <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
              Our comprehensive services encompass luxury property sales, sustainable green building investments, and premium vacation rentals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {['200+ Projects Completed', '70+ Happy Clients', '$10M+ Project Value', '90% Retention Rate'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/properties" className="btn btn-navy btn-lg">
              Browse Properties <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right - service grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {services.map((s, i) => (
              <div key={i} style={{
                padding: '1.5rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                background: i % 2 === 0 ? 'var(--white)' : 'var(--ivory)',
                transition: 'all 0.3s',
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', marginBottom: '1rem',
                }}>{s.icon}</div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '0.4rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){section .container>div:first-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─── Featured Properties ─── */
function FeaturedSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties({ featured: true, limit: 6 })
      .then(r => setProperties(r.data.properties || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: 'var(--ivory)', padding: '6rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-pill">Featured Properties</div>
            <h2 className="section-title-lg">
              Discover Homes Tailored<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>to Your Lifestyle</em>
            </h2>
          </div>
          <Link to="/properties" className="btn btn-outline" style={{ flexShrink: 0 }}>
            View All Properties <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: 230 }} />
                <div style={{ padding: '1.25rem', background: 'var(--white)' }}>
                  <div className="skeleton" style={{ height: 14, marginBottom: 8, width: '60%' }} />
                  <div className="skeleton" style={{ height: 20, marginBottom: 12, width: '85%' }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Building2 size={32} /></div>
            <h3>No Featured Properties</h3>
            <p>Check back soon for our curated selections.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Stats / About Section ─── */
function AboutSection() {
  return (
    <section style={{ background: 'var(--navy)', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <div style={{
        position: 'absolute', top: -200, right: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.35rem 1rem', borderRadius: 100,
              border: '1px solid rgba(201,168,76,0.3)',
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '1.25rem',
            }}>Who We Are</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Redefining Excellence<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>in Real Estate</em>
            </h2>
            <p style={{ color: 'rgba(248,245,240,0.6)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              We specialise in luxury properties, sustainable homes, and vacation rentals — driven by a passion for exceptional living and a commitment to quality, innovation, and client satisfaction.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { val: '200+', label: 'Projects Complete' },
                { val: '70+', label: 'Happy Clients' },
                { val: '$10M+', label: 'Project Value' },
                { val: '90%', label: 'Client Retention' },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  padding: '1.25rem',
                  border: '1px solid rgba(248,245,240,0.08)',
                  borderRadius: 12, background: 'rgba(248,245,240,0.04)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(248,245,240,0.45)', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link to="/properties" className="btn btn-gold btn-lg">
                Explore Properties <ArrowRight size={16} />
              </Link>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.95rem 1.5rem',
                border: '1.5px solid rgba(248,245,240,0.2)',
                borderRadius: 10, color: 'rgba(248,245,240,0.8)', fontSize: '0.92rem',
                transition: 'all 0.25s',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(248,245,240,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Play size={12} fill="rgba(248,245,240,0.8)" />
                </div>
                Watch Story
              </a>
            </div>
          </div>

          {/* Right - image grid */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" alt=""
                style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 16, gridRow: 'span 2' }}
                onError={e => e.target.style.display='none'} />
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" alt=""
                style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 16 }}
                onError={e => e.target.style.display='none'} />
              <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" alt=""
                style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 16 }}
                onError={e => e.target.style.display='none'} />
            </div>
            {/* Gold accent */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              width: 100, height: 100, borderRadius: 16,
              background: 'var(--gold)', opacity: 0.12,
              pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){section .container>div{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─── Property Types ─── */
function TypesSection() {
  const types = [
    { icon: <HomeIcon size={24} />, label: 'Residential', desc: 'Houses, Apartments & Condos', link: '/properties?category=apartment', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80' },
    { icon: <Building2 size={24} />, label: 'Commercial', desc: 'Offices & Retail Spaces', link: '/properties?category=commercial', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80' },
    { icon: <TreePine size={24} />, label: 'Luxury Villas', desc: 'Premium & Exclusive Living', link: '/properties?category=villa', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' },
    { icon: <MapPin size={24} />, label: 'Land & Plots', desc: 'Develop Your Dream Project', link: '/properties?category=land', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80' },
  ];

  return (
    <section style={{ background: 'var(--white)', padding: '6rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-pill" style={{ margin: '0 auto 1rem' }}>Why Choose Us</div>
          <h2 className="section-title-lg">
            Explore Our Range of<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Expert Real Estate Services</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {types.map((t, i) => (
            <Link key={i} to={t.link} style={{
              display: 'block', borderRadius: 'var(--r-xl)',
              overflow: 'hidden', position: 'relative',
              border: '1px solid var(--border)',
              transition: 'all 0.4s',
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
              textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img src={t.img} alt={t.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onError={e => e.target.style.opacity='0.3'}
                  onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'} />
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--white)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--ivory)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--navy)', marginBottom: '0.875rem'
                }}>{t.icon}</div>
                <h4 style={{ fontWeight: 600, fontSize: '0.97rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>{t.label}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─── */
function CTASection() {
  return (
    <section style={{ background: 'var(--ivory)', padding: '4rem 0' }}>
      <div className="container">
        <div style={{
          background: 'var(--navy)',
          borderRadius: 'var(--r-2xl)',
          padding: '4rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '2rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=60')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.07,
          }} />
          <div style={{
            position: 'absolute', top: -100, right: -100,
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Ready to Begin?</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15 }}>
              Find Your Dream Property<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>with EstateX Today</em>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/properties" className="btn btn-gold btn-lg" style={{ borderRadius: 10 }}>
              Browse Properties <ArrowUpRight size={16} />
            </Link>
            <Link to="/register" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.95rem 1.75rem',
              border: '1.5px solid rgba(248,245,240,0.2)',
              borderRadius: 10, color: 'rgba(248,245,240,0.85)',
              fontSize: '0.92rem', transition: 'all 0.25s',
            }}>
              Create Account <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <FeaturedSection />
      <AboutSection />
      <TypesSection />
      <CTASection />
    </div>
  );
}
