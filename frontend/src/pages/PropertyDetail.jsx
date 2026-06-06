import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../api/axios';
import ContactForm from '../components/forms/ContactForm';
import {
  MapPin, Bed, Bath, Square, Car, Sofa, Wind, Droplets, Dumbbell,
  ChevronLeft, ChevronRight, Eye, Star, Calendar, Share2, Heart,
  ArrowLeft, CheckCircle, Building2
} from 'lucide-react';

const fmt = (n) => {
  if (!n) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n?.toLocaleString()}`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [imgIdx, setImgIdx]     = useState(0);
  const [liked, setLiked]       = useState(false);

  useEffect(() => {
    setLoading(true);
    getPropertyById(id)
      .then(r => setProperty(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading property...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div style={{ paddingTop: '8rem', textAlign: 'center', minHeight: '60vh' }}>
      <div className="empty-state-icon" style={{ margin: '0 auto 1rem' }}><Building2 size={32} /></div>
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)' }}>Property Not Found</h2>
      <Link to="/properties" className="btn btn-navy" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Back to Listings</Link>
    </div>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80'];
  const statusColors = { available: { bg: 'var(--success-bg)', color: 'var(--success)' }, sold: { bg: 'var(--error-bg)', color: 'var(--error)' }, rented: { bg: 'var(--warning-bg)', color: 'var(--warning)' } };
  const sc = statusColors[property.status] || statusColors.available;

  const featureIcons = [
    { key: 'parking', icon: <Car size={16} />, label: 'Parking' },
    { key: 'furnished', icon: <Sofa size={16} />, label: 'Furnished' },
    { key: 'balcony', icon: <Wind size={16} />, label: 'Balcony' },
    { key: 'pool', icon: <Droplets size={16} />, label: 'Pool' },
    { key: 'gym', icon: <Dumbbell size={16} />, label: 'Gym' },
  ];

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--ivory)' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0.875rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to="/properties" style={{ color: 'var(--text-muted)' }}>Properties</Link>
          <span>/</span>
          <span style={{ color: 'var(--navy)', fontWeight: 500 }} className="truncate">{property.title}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        {/* Back + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/properties" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--navy)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={16} /> Back to Listings
          </Link>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={() => setLiked(!liked)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              border: '1.5px solid var(--border)', background: liked ? 'var(--error-bg)' : 'var(--white)',
              color: liked ? 'var(--error)' : 'var(--text-muted)',
              fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.25s',
            }}>
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> Save
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              border: '1.5px solid var(--border)', background: 'var(--white)',
              color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer',
            }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
          {/* LEFT COLUMN */}
          <div>
            {/* Image Gallery */}
            <div style={{ position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--navy)' }}>
              <img src={images[imgIdx]} alt={property.title}
                style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80'} />

              {/* Gradient overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(13,27,42,0.7) 0%, transparent 100%)' }} />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem' }}>
                <span style={{ padding: '0.28rem 0.8rem', background: property.type === 'sale' ? 'var(--navy)' : 'rgba(29,78,216,0.9)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 100 }}>
                  {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span style={{ padding: '0.28rem 0.8rem', background: sc.bg, color: sc.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'capitalize', borderRadius: 100 }}>{property.status}</span>
                {property.featured && <span style={{ padding: '0.28rem 0.8rem', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.7rem', fontWeight: 700, borderRadius: 100, display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Star size={9} fill="currentColor" /> Featured</span>}
              </div>

              {/* Views */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: 100, color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                <Eye size={12} /> {property.views} views
              </div>

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', padding: '0.3rem 0.75rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 100, color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                  {imgIdx + 1} / {images.length}
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--navy)' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--navy)' }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{
                    width: 80, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, padding: 0,
                    border: `2px solid ${i === imgIdx ? 'var(--navy)' : 'transparent'}`,
                    transition: 'border-color 0.2s', cursor: 'pointer',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = images[0]} />
                  </button>
                ))}
              </div>
            )}

            {/* Title & price */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2, marginBottom: '0.6rem' }}>{property.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    <MapPin size={14} style={{ color: 'var(--gold)' }} />
                    {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.zipCode}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                    {fmt(property.price)}
                  </div>
                  {property.type === 'rent' && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>per month</div>}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: 'flex', gap: '0', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
                {[
                  property.features?.bedrooms > 0 && { icon: <Bed size={18} />, val: property.features.bedrooms, label: 'Bedrooms' },
                  property.features?.bathrooms > 0 && { icon: <Bath size={18} />, val: property.features.bathrooms, label: 'Bathrooms' },
                  property.features?.area > 0 && { icon: <Square size={18} />, val: `${property.features.area?.toLocaleString()} sqft`, label: 'Area' },
                ].filter(Boolean).map(({ icon, val, label }, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0.75rem 1rem', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ color: 'var(--navy)', marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>{val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1rem' }}>About This Property</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.8 }}>{property.description}</p>
            </div>

            {/* Features & amenities */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1.5rem' }}>Features & Amenities</h2>

              {/* Boolean features */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {featureIcons.map(({ key, icon, label }) => property.features?.[key] && (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--ivory)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-body)' }}>
                    <span style={{ color: 'var(--navy)' }}>{icon}</span> {label}
                  </div>
                ))}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <>
                  <div style={{ height: 1, background: 'var(--border)', margin: '1.25rem 0' }} />
                  <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>Additional Amenities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {property.amenities.map(a => (
                      <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.875rem', background: 'var(--ivory-warm)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.82rem', color: 'var(--text-body)' }}>
                        <CheckCircle size={12} style={{ color: 'var(--gold)' }} /> {a}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Agent info */}
            {property.postedBy && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '1.75rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '1.25rem' }}>Listed By</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                    {property.postedBy?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '0.2rem' }}>{property.postedBy?.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{property.postedBy?.email}</div>
                    {property.postedBy?.phone && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{property.postedBy?.phone}</div>}
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="var(--gold)" style={{ color: 'var(--gold)' }} />)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.25rem' }}>Verified Agent</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — sticky contact */}
          <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Price card */}
            <div style={{ background: 'var(--navy)', borderRadius: 'var(--r-xl)', padding: '1.75rem', color: 'var(--ivory)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,245,240,0.5)', marginBottom: '0.4rem' }}>
                {property.type === 'sale' ? 'Sale Price' : 'Monthly Rent'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.75rem', lineHeight: 1 }}>
                {fmt(property.price)}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'rgba(248,245,240,0.6)' }}>
                  <Calendar size={13} /> Listed recently
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'rgba(248,245,240,0.6)' }}>
                  <Eye size={13} /> {property.views} views
                </span>
              </div>
            </div>

            <ContactForm propertyId={property._id} propertyTitle={property.title} />
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.prop-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
