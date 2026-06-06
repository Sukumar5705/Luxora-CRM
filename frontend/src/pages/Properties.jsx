import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../api/axios';
import PropertyCard from '../components/property/PropertyCard';
import SearchBar from '../components/property/SearchBar';
import { Building2, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n?.toLocaleString()}`;
};

function PropertyListItem({ property }) {
  const [hov, setHov] = useState(false);
  const img = property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80';
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', gap: '1.5rem', background: 'var(--white)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
        overflow: 'hidden', transition: 'all 0.3s',
        boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-xs)',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}>
      <div style={{ width: 200, flexShrink: 0, overflow: 'hidden' }}>
        <img src={img} alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hov ? 'scale(1.05)' : 'scale(1)' }}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'} />
      </div>
      <div style={{ flex: 1, padding: '1.5rem 1.5rem 1.5rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <span className="badge badge-sale">{property.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
            <span className="badge badge-navy" style={{ textTransform: 'capitalize' }}>{property.category}</span>
            {property.featured && <span className="badge badge-featured">Featured</span>}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{property.title}</h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {property.location?.address}, {property.location?.city}, {property.location?.state}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {property.features?.bedrooms > 0 && <span>{property.features.bedrooms} Beds</span>}
            {property.features?.bathrooms > 0 && <span>{property.features.bathrooms} Baths</span>}
            {property.features?.area > 0 && <span>{property.features.area?.toLocaleString()} sqft</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>
            {fmt(property.price)}{property.type === 'rent' && <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--text-muted)' }}>/mo</span>}
          </div>
          <a href={`/properties/${property._id}`} className="btn btn-navy btn-sm" style={{ borderRadius: 8 }}>View Details</a>
        </div>
      </div>
    </div>
  );
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData]     = useState({ properties: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(1);
  const [view, setView]     = useState('grid'); // grid | list

  const initFilters = {
    search:   searchParams.get('search')   || '',
    type:     searchParams.get('type')     || '',
    category: searchParams.get('category') || '',
    city:     searchParams.get('city')     || '',
    sort:     searchParams.get('sort')     || '-createdAt',
  };

  const [filters, setFilters] = useState(initFilters);

  const load = (f = filters, pg = 1) => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries({ ...f, page: pg, limit: 9 }).filter(([, v]) => v !== ''));
    getProperties(clean)
      .then(r => { setData(r.data); setPage(pg); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filters, 1); }, []);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    load(newFilters, 1);
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--ivory)' }}>
      {/* Page header */}
      <div style={{ background: 'var(--navy)', padding: '3.5rem 0 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.6rem' }}>Browse</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
            All Properties
          </h1>
          <p style={{ color: 'rgba(248,245,240,0.55)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Discover premium properties across India's finest locations
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        <SearchBar onSearch={handleSearch} initialValues={filters} />

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {loading ? 'Loading...' : (
              <><span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>{data.total}</span> properties found</>
            )}
          </div>
          {/* View toggle */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.25rem' }}>
            {[['grid', <LayoutGrid size={16} />], ['list', <List size={16} />]].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '0.4rem 0.75rem', borderRadius: 6, border: 'none',
                background: view === v ? 'var(--navy)' : 'transparent',
                color: view === v ? 'var(--ivory)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill,minmax(300px,1fr))' : '1fr', gap: '1.5rem' }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--white)' }}>
                <div className="skeleton" style={{ height: view === 'grid' ? 220 : 160 }} />
                <div style={{ padding: '1.25rem' }}>
                  <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 20, width: '85%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : data.properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Building2 size={32} /></div>
            <h3>No Properties Found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {data.properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.properties.map((p, i) => <PropertyListItem key={p._id} property={p} />)}
          </div>
        )}

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => load(filters, page - 1)} disabled={page === 1}><ChevronLeft size={15} /></button>
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => load(filters, p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => load(filters, page + 1)} disabled={page === data.pages}><ChevronRight size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
