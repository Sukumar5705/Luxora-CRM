import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function SearchBar({ onSearch, initialValues = {} }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '', type: '', category: '', city: '',
    minPrice: '', maxPrice: '', bedrooms: '', status: '',
    sort: '-createdAt', ...initialValues
  });

  const set = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e?.preventDefault();
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    onSearch(clean);
  };

  const handleReset = () => {
    const reset = { search:'', type:'', category:'', city:'', minPrice:'', maxPrice:'', bedrooms:'', status:'', sort:'-createdAt' };
    setFilters(reset);
    onSearch({});
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== 'sort' && k !== 'search').length;

  return (
    <div style={{
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      marginBottom: '2.5rem',
    }}>
      {/* Main Row */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex', gap: '0.75rem', padding: '1.1rem 1.25rem',
        alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: '1rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none',
          }} />
          <input
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            placeholder="Search by city, address, title..."
            className="form-input"
            style={{ paddingLeft: '2.6rem', background: 'var(--ivory)', border: '1.5px solid var(--border)' }}
          />
        </div>

        <select value={filters.type} onChange={e => set('type', e.target.value)}
          className="form-select" style={{ minWidth: 130, background: 'var(--ivory)', border: '1.5px solid var(--border)' }}>
          <option value="">All Types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select value={filters.sort} onChange={e => set('sort', e.target.value)}
          className="form-select" style={{ minWidth: 165, background: 'var(--ivory)', border: '1.5px solid var(--border)' }}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="-views">Most Viewed</option>
        </select>

        {/* Filters toggle */}
        <button type="button" onClick={() => setOpen(!open)} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.78rem 1.1rem', borderRadius: 8, border: '1.5px solid',
          borderColor: open || activeCount > 0 ? 'var(--navy)' : 'var(--border)',
          background: open || activeCount > 0 ? 'var(--navy)' : 'var(--ivory)',
          color: open || activeCount > 0 ? 'var(--ivory)' : 'var(--text-body)',
          fontSize: '0.88rem', transition: 'all 0.25s', whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}>
          <SlidersHorizontal size={14} />
          Filters
          {activeCount > 0 && (
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--gold)', color: 'var(--navy)',
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeCount}</span>
          )}
          <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        <button type="submit" className="btn btn-navy" style={{ whiteSpace: 'nowrap', borderRadius: 8 }}>
          <Search size={14} /> Search
        </button>

        {(activeCount > 0 || filters.search) && (
          <button type="button" onClick={handleReset} style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.78rem 0.9rem', borderRadius: 8,
            border: '1.5px solid var(--border)',
            background: 'var(--ivory)', color: 'var(--text-muted)',
            fontSize: '0.85rem', cursor: 'pointer',
          }}>
            <X size={13} /> Clear
          </button>
        )}
      </form>

      {/* Advanced Filters */}
      {open && (
        <div style={{
          borderTop: '1px solid var(--border)', padding: '1.25rem',
          background: 'var(--ivory)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
          gap: '1rem', animation: 'fadeUp 0.2s ease',
        }}>
          {[
            { label: 'Category', key: 'category', opts: [['', 'All Categories'], ['apartment','Apartment'], ['house','House'], ['villa','Villa'], ['commercial','Commercial'], ['land','Land'], ['condo','Condo']] },
            { label: 'Status', key: 'status', opts: [['','All Status'], ['available','Available'], ['sold','Sold'], ['rented','Rented']] },
            { label: 'Bedrooms', key: 'bedrooms', opts: [['','Any Beds'], ['1','1+'], ['2','2+'], ['3','3+'], ['4','4+'], ['5','5+']] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <select value={filters[key]} onChange={e => set(key, e.target.value)}
                className="form-select" style={{ background: 'var(--white)' }}>
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="form-label">City</label>
            <input value={filters.city} onChange={e => set('city', e.target.value)}
              placeholder="e.g. Hyderabad" className="form-input" style={{ background: 'var(--white)' }} />
          </div>
          <div>
            <label className="form-label">Min Price (₹)</label>
            <input type="number" value={filters.minPrice} onChange={e => set('minPrice', e.target.value)}
              placeholder="0" className="form-input" style={{ background: 'var(--white)' }} />
          </div>
          <div>
            <label className="form-label">Max Price (₹)</label>
            <input type="number" value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)}
              placeholder="Any" className="form-input" style={{ background: 'var(--white)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
