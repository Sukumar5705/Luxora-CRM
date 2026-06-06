import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Eye, ArrowUpRight, Star } from 'lucide-react';

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80',
];

const fmtPrice = (p, type) => {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)} L`;
  return `₹${p?.toLocaleString()}`;
};

const CAT_COLORS = {
  apartment: { bg: '#dbeafe', color: '#1d4ed8' },
  house:     { bg: '#fef3cd', color: '#b45309' },
  villa:     { bg: '#ede9fe', color: '#7c3aed' },
  commercial:{ bg: '#fee2e2', color: '#b91c1c' },
  land:      { bg: '#dcfce7', color: '#15803d' },
  condo:     { bg: '#f0fdf4', color: '#16a34a' },
};

export default function PropertyCard({ property, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked]     = useState(false);

  const img = property.images?.[0] ||
    PLACEHOLDERS[Math.abs((property._id?.charCodeAt(0) || 0) + index) % PLACEHOLDERS.length];

  const cat = CAT_COLORS[property.category] || { bg: '#f1f5f9', color: '#475569' };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-xl)' : 'var(--shadow-xs)',
        animation: `fadeUp 0.5s ease ${index * 0.07}s both`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}>

      {/* Image */}
      <div style={{ position: 'relative', height: 230, overflow: 'hidden', flexShrink: 0 }}>
        <img src={img} alt={property.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
          onError={e => { e.target.src = PLACEHOLDERS[0]; }}
        />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.65) 0%, transparent 55%)',
        }} />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.22rem 0.7rem',
            background: property.type === 'sale' ? 'var(--navy)' : 'rgba(29,78,216,0.9)',
            color: '#fff',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            borderRadius: 100,
          }}>
            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>

          <span style={{
            padding: '0.22rem 0.7rem',
            background: cat.bg, color: cat.color,
            fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'capitalize',
            borderRadius: 100,
          }}>
            {property.category}
          </span>

          {property.featured && (
            <span style={{
              padding: '0.22rem 0.65rem',
              background: 'var(--gold)', color: 'var(--navy)',
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              borderRadius: 100,
              display: 'flex', alignItems: 'center', gap: '0.2rem'
            }}>
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={e => { e.preventDefault(); setLiked(!liked); }}
          style={{
            position: 'absolute', top: '0.875rem', right: '0.875rem',
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.25s',
            transform: liked ? 'scale(1.15)' : 'scale(1)',
            color: liked ? '#b91c1c' : 'var(--text-muted)',
            boxShadow: 'var(--shadow-sm)',
          }}>
          <Heart size={15} fill={liked ? '#b91c1c' : 'none'} />
        </button>

        {/* Price bottom left */}
        <div style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem', fontWeight: 700,
            color: '#fff', lineHeight: 1,
          }}>
            {fmtPrice(property.price)}
            {property.type === 'rent' && (
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 400, opacity: 0.8 }}>/mo</span>
            )}
          </div>
        </div>

        {/* Views bottom right */}
        {property.views > 0 && (
          <div style={{
            position: 'absolute', bottom: '0.875rem', right: '0.875rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.73rem', color: 'rgba(255,255,255,0.75)',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(6px)',
            padding: '0.2rem 0.55rem', borderRadius: 100,
          }}>
            <Eye size={11} /> {property.views}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Location */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          color: 'var(--text-faint)', fontSize: '0.78rem', marginBottom: '0.5rem',
        }}>
          <MapPin size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <span className="truncate">{property.location?.address}, {property.location?.city}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem', fontWeight: 600,
          color: 'var(--navy)', lineHeight: 1.3,
          marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {property.title}
        </h3>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: '1rem' }} />

        {/* Features */}
        <div style={{ display: 'flex', gap: '1.1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {property.features?.bedrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Bed size={13} style={{ color: 'var(--navy)' }} />
              <span>{property.features.bedrooms} <span style={{ color: 'var(--text-faint)' }}>Beds</span></span>
            </div>
          )}
          {property.features?.bathrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Bath size={13} style={{ color: 'var(--navy)' }} />
              <span>{property.features.bathrooms} <span style={{ color: 'var(--text-faint)' }}>Baths</span></span>
            </div>
          )}
          {property.features?.area > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Square size={13} style={{ color: 'var(--navy)' }} />
              <span>{property.features.area?.toLocaleString()} <span style={{ color: 'var(--text-faint)' }}>sqft</span></span>
            </div>
          )}
        </div>

        {/* Status + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'capitalize',
            padding: '0.2rem 0.65rem', borderRadius: 100,
            background: property.status === 'available' ? 'var(--success-bg)' : property.status === 'sold' ? 'var(--error-bg)' : 'var(--warning-bg)',
            color: property.status === 'available' ? 'var(--success)' : property.status === 'sold' ? 'var(--error)' : 'var(--warning)',
          }}>
            {property.status}
          </span>

          <Link to={`/properties/${property._id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 1rem',
              background: hovered ? 'var(--navy)' : 'var(--ivory-warm)',
              color: hovered ? 'var(--ivory)' : 'var(--navy)',
              fontSize: '0.82rem', fontWeight: 600,
              letterSpacing: '0.04em',
              borderRadius: 8,
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}>
            View <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
