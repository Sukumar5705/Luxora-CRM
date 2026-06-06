/**
 * CHANGES vs original ManageProperties.jsx:
 *
 * 1. REMOVED setTimeout HACK (High) — The original used setTimeout(() => load(1), 100)
 *    to wait for React state updates. This is unreliable: it races against
 *    React's scheduler. Replaced with a dedicated handleClear() that passes
 *    values directly to the fetch call, bypassing state entirely.
 *
 * 2. ABORTCONTROLLER (High) — load() now cancels any in-flight request before
 *    starting a new one. Rapid searches no longer cause race conditions where
 *    an older, slower response overwrites newer results. Also cancels on unmount.
 *
 * 3. LAZY IMAGE LOADING (Low) — Added loading="lazy" to property thumbnails.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, deleteProperty, updateProperty } from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Eye, Search, Star, StarOff, ChevronLeft, ChevronRight } from 'lucide-react';

const fmt = (n) => {
  if (!n) return '—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
};

export default function ManageProperties() {
  const [data, setData]         = useState({ properties: [], total: 0, pages: 1 });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // Holds the AbortController for the current in-flight load request
  const abortRef = useRef(null);

  /**
   * Fetch properties. Accepts explicit search/type values so callers don't
   * have to wait for React state to flush before fetching.
   */
  const load = (pg = 1, searchVal = search, typeVal = typeFilter) => {
    // Cancel any previous in-flight request before starting a new one
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    const params = { page: pg, limit: 10, sort: '-createdAt' };
    if (searchVal) params.search = searchVal;
    if (typeVal)   params.type   = typeVal;

    getProperties(params, controller.signal)
      .then((r) => {
        if (!controller.signal.aborted) {
          setData(r.data);
          setPage(pg);
        }
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        toast.error('Failed to load');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  };

  useEffect(() => {
    load();
    // Cleanup: cancel request if component unmounts mid-fetch
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    load(1, search, typeFilter);
  };

  /**
   * FIXED: Previously used setTimeout(() => load(1), 100) to wait for state
   * to flush — fundamentally unreliable. Now passes empty strings directly to
   * load() so state is irrelevant.
   */
  const handleClear = () => {
    setSearch('');
    setTypeFilter('');
    load(1, '', ''); // explicit empty values — no setTimeout needed
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteProperty(id);
      toast.success('Property deleted');
      setConfirmId(null);
      load(page);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await updateProperty(p._id, { featured: !p.featured });
      toast.success(p.featured ? 'Removed from featured' : 'Marked as featured');
      load(page);
    } catch {
      toast.error('Update failed');
    }
  };

  const statusColor = { available: 'var(--success)', sold: 'var(--error)', rented: '#6495ED' };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div className="container" style={{ padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-tag">Admin</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600 }}>Manage Properties</h1>
            <div className="gold-divider" style={{ marginTop: '0.5rem' }} />
          </div>
          <Link to="/admin/add-property" className="btn btn-gold">
            <Plus size={16} /> Add Property
          </Link>
        </div>

        {/* Search / Filter bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '1rem',
        }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', opacity: 0.5, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="form-select" style={{ minWidth: 130 }}>
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <button type="submit" className="btn btn-gold btn-sm">Search</button>
          {(search || typeFilter) && (
            <button
              type="button"
              onClick={handleClear}   // ← FIXED: was setTimeout hack
              className="btn btn-ghost btn-sm"
            >
              Clear
            </button>
          )}
        </form>

        {/* Results count */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {loading
            ? 'Loading...'
            : <><span style={{ color: 'var(--gold)', fontWeight: 600 }}>{data.total}</span> properties found</>
          }
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div className="loader-ring" style={{ margin: '0 auto' }} />
            </div>
          ) : data.properties.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <p>No properties found.</p>
              <Link to="/admin/add-property" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>Add First Property</Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(201,168,76,0.05)' }}>
                    {['Property', 'Location', 'Price', 'Type', 'Status', 'Views', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.properties.map((p, i) => (
                    <tr key={p._id}
                      style={{ borderBottom: i < data.properties.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Property */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 44, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-card)' }}>
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=60'}
                              alt=""
                              loading="lazy"   // ← ADDED
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => e.target.style.opacity = '0.3'}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{p.category}</div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontSize: '0.85rem' }}>{p.location?.city}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.location?.state}</div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--gold)', fontSize: '1rem' }}>{fmt(p.price)}</div>
                        {p.type === 'rent' && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/month</div>}
                      </td>

                      {/* Type */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ padding: '0.25rem 0.7rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', background: p.type === 'sale' ? 'rgba(201,168,76,0.15)' : 'rgba(100,149,237,0.15)', color: p.type === 'sale' ? 'var(--gold)' : '#6495ED' }}>
                          {p.type === 'sale' ? 'Sale' : 'Rent'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ padding: '0.25rem 0.7rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', background: `${statusColor[p.status] || 'var(--gold)'}18`, color: statusColor[p.status] || 'var(--gold)' }}>
                          {p.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Eye size={13} /> {p.views}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button onClick={() => toggleFeatured(p)} title={p.featured ? 'Unfeature' : 'Feature'}
                            style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid', borderColor: p.featured ? 'rgba(201,168,76,0.4)' : 'var(--border)', background: p.featured ? 'rgba(201,168,76,0.15)' : 'transparent', color: p.featured ? 'var(--gold)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {p.featured ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
                          </button>
                          <Link to={`/properties/${p._id}`}
                            style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            <Eye size={13} />
                          </Link>
                          <Link to={`/admin/edit-property/${p._id}`}
                            style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(100,149,237,0.3)', background: 'rgba(100,149,237,0.08)', color: '#6495ED', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            <Pencil size={13} />
                          </Link>
                          <button onClick={() => setConfirmId(p._id)}
                            style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(224,90,90,0.3)', background: 'rgba(224,90,90,0.08)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => load(page - 1)} disabled={page === 1}>
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => load(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => load(page + 1)} disabled={page === data.pages}>
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.2s ease' }}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(224,90,90,0.3)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', maxWidth: 420, width: '90%', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>Delete Property?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              This action cannot be undone. The property will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmId)} disabled={!!deleting}>
                {deleting === confirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}