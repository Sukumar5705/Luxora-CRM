import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createProperty, updateProperty, getPropertyById } from '../../api/axios';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Plus, X, Image, MapPin, Home, Star } from 'lucide-react';

const AMENITY_SUGGESTIONS = [
  '24/7 Security', 'CCTV Surveillance', 'Power Backup', 'Lift/Elevator',
  'Intercom', 'Fire Safety', 'Visitor Parking', 'Club House',
  'Children Play Area', 'Jogging Track', 'Landscaped Garden', 'Rainwater Harvesting',
  'Swimming Pool', 'Gymnasium', 'Cafeteria', 'Conference Room',
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
];

const SectionCard = ({ title, icon, children }) => (
  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
    <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--ivory)' }}>
      <span style={{ color: 'var(--gold)' }}>{icon}</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--navy)' }}>{title}</h2>
    </div>
    <div style={{ padding: '1.75rem' }}>{children}</div>
  </div>
);

export default function AddProperty() {
  const { id }    = useParams();
  const isEdit    = !!id;
  const navigate  = useNavigate();
  const [loading, setLoading]         = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput]     = useState('');

  const [form, setForm] = useState({
    title: '', description: '', price: '', type: 'sale', category: 'apartment', status: 'available',
    location: { address: '', city: '', state: '', country: 'India', zipCode: '' },
    features: { bedrooms: '', bathrooms: '', area: '', parking: false, furnished: false, balcony: false, pool: false, gym: false },
    amenities: [], images: [], featured: false,
  });

  useEffect(() => {
    if (isEdit) {
      getPropertyById(id)
        .then(r => {
          const p = r.data;
          setForm({
            title: p.title || '', description: p.description || '',
            price: p.price || '', type: p.type || 'sale', category: p.category || 'apartment',
            status: p.status || 'available',
            location: p.location || { address: '', city: '', state: '', country: 'India', zipCode: '' },
            features: { bedrooms: '', bathrooms: '', area: '', parking: false, furnished: false, balcony: false, pool: false, gym: false, ...p.features },
            amenities: p.amenities || [], images: p.images || [], featured: p.featured || false,
          });
        })
        .catch(() => toast.error('Failed to load property'))
        .finally(() => setLoadingData(false));
    }
  }, [id]);

  const setTop  = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setLoc  = (k, v) => setForm(p => ({ ...p, location:  { ...p.location,  [k]: v } }));
  const setFeat = (k, v) => setForm(p => ({ ...p, features:  { ...p.features,  [k]: v } }));

  const addAmenity = (a) => {
    const val = a || amenityInput.trim();
    if (val && !form.amenities.includes(val)) setForm(p => ({ ...p, amenities: [...p.amenities, val] }));
    setAmenityInput('');
  };
  const removeAmenity = (a) => setForm(p => ({ ...p, amenities: p.amenities.filter(x => x !== a) }));

  const addImage = () => {
    if (imageInput.trim() && !form.images.includes(imageInput.trim()))
      setForm(p => ({ ...p, images: [...p.images, imageInput.trim()] }));
    setImageInput('');
  };
  const removeImage = (img) => setForm(p => ({ ...p, images: p.images.filter(x => x !== img) }));
  const useSampleImages = () => setForm(p => ({ ...p, images: DEFAULT_IMAGES }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location.address || !form.location.city || !form.features.area) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      if (isEdit) { await updateProperty(id, form); toast.success('Property updated!'); }
      else        { await createProperty(form);     toast.success('Property created!'); }
      navigate('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  if (loadingData) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem' }}>
      <div className="spinner" />
    </div>
  );

  const CheckBox = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
      <div onClick={onChange} style={{
        width: 20, height: 20, borderRadius: 5, border: '2px solid', flexShrink: 0,
        borderColor: checked ? 'var(--navy)' : 'var(--border)',
        background: checked ? 'var(--navy)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', cursor: 'pointer',
      }}>
        {checked && <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 800 }}>✓</span>}
      </div>
      <span style={{ fontSize: '0.87rem', color: 'var(--text-body)' }}>{label}</span>
    </label>
  );

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--ivory)' }}>
      <div className="container" style={{ padding: '2.5rem 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <Link to="/admin/properties" style={{
            width: 40, height: 40, borderRadius: 10, border: '1.5px solid var(--border)',
            background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', transition: 'all 0.2s', textDecoration: 'none',
          }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>Admin</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--navy)' }}>
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', alignItems: 'start' }}>

            {/* Main column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Basic Info */}
              <SectionCard title="Basic Information" icon={<Home size={16} />}>
                <div className="form-group">
                  <label className="form-label">Property Title *</label>
                  <input value={form.title} onChange={e => setTop('title', e.target.value)}
                    placeholder="e.g. Luxurious 3BHK Apartment in Banjara Hills" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea value={form.description} onChange={e => setTop('description', e.target.value)}
                    placeholder="Detailed property description..." className="form-textarea" rows={4} required />
                </div>
                <div className="form-grid-3">
                  <div>
                    <label className="form-label">Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e => setTop('price', e.target.value)}
                      placeholder="5000000" className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">Listing Type *</label>
                    <select value={form.type} onChange={e => setTop('type', e.target.value)} className="form-select">
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Category *</label>
                    <select value={form.category} onChange={e => setTop('category', e.target.value)} className="form-select">
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                      <option value="condo">Condo</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid-2" style={{ marginTop: '0.25rem' }}>
                  <div>
                    <label className="form-label">Status</label>
                    <select value={form.status} onChange={e => setTop('status', e.target.value)} className="form-select">
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <CheckBox checked={form.featured} onChange={() => setTop('featured', !form.featured)} label="Mark as Featured" />
                  </div>
                </div>
              </SectionCard>

              {/* Location */}
              <SectionCard title="Location Details" icon={<MapPin size={16} />}>
                <div className="form-group">
                  <label className="form-label">Full Address *</label>
                  <input value={form.location.address} onChange={e => setLoc('address', e.target.value)}
                    placeholder="Street address, building, etc." className="form-input" required />
                </div>
                <div className="form-grid-3">
                  <div>
                    <label className="form-label">City *</label>
                    <input value={form.location.city} onChange={e => setLoc('city', e.target.value)}
                      placeholder="Hyderabad" className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input value={form.location.state} onChange={e => setLoc('state', e.target.value)}
                      placeholder="Telangana" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">PIN Code</label>
                    <input value={form.location.zipCode} onChange={e => setLoc('zipCode', e.target.value)}
                      placeholder="500001" className="form-input" />
                  </div>
                </div>
              </SectionCard>

              {/* Features */}
              <SectionCard title="Property Features" icon={<Star size={16} />}>
                <div className="form-grid-3">
                  <div>
                    <label className="form-label">Bedrooms</label>
                    <input type="number" min="0" value={form.features.bedrooms} onChange={e => setFeat('bedrooms', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Bathrooms</label>
                    <input type="number" min="0" value={form.features.bathrooms} onChange={e => setFeat('bathrooms', e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Area (sqft) *</label>
                    <input type="number" min="0" value={form.features.area} onChange={e => setFeat('area', e.target.value)} placeholder="1200" className="form-input" required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {[['parking','Parking'], ['furnished','Furnished'], ['balcony','Balcony'], ['pool','Pool'], ['gym','Gym']].map(([key, label]) => (
                    <CheckBox key={key} checked={form.features[key]} onChange={() => setFeat(key, !form.features[key])} label={label} />
                  ))}
                </div>
              </SectionCard>

              {/* Amenities */}
              <SectionCard title="Amenities" icon={<Plus size={16} />}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    placeholder="Type custom amenity and press Enter..." className="form-input" style={{ flex: 1 }} />
                  <button type="button" onClick={() => addAmenity()} className="btn btn-navy btn-sm" style={{ borderRadius: 8 }}><Plus size={15} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {AMENITY_SUGGESTIONS.filter(a => !form.amenities.includes(a)).map(a => (
                    <button key={a} type="button" onClick={() => addAmenity(a)}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: 100, fontSize: '0.78rem', border: '1.5px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                      + {a}
                    </button>
                  ))}
                </div>
                {form.amenities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {form.amenities.map(a => (
                      <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', borderRadius: 100, background: 'rgba(13,27,42,0.07)', border: '1px solid rgba(13,27,42,0.12)', fontSize: '0.82rem', color: 'var(--navy)' }}>
                        {a}
                        <button type="button" onClick={() => removeAmenity(a)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', padding: 0, marginLeft: '0.1rem' }}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Images */}
              <SectionCard title="Property Images" icon={<Image size={16} />}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    placeholder="Paste image URL..." className="form-input" style={{ flex: 1, fontSize: '0.82rem' }} />
                  <button type="button" onClick={addImage} className="btn btn-navy btn-sm" style={{ borderRadius: 8 }}><Plus size={14} /></button>
                </div>
                <button type="button" onClick={useSampleImages} className="btn btn-ghost btn-full btn-sm" style={{ border: '1.5px solid var(--border)', borderRadius: 8, marginBottom: '0.875rem', fontSize: '0.78rem' }}>
                  Use Sample Images
                </button>
                {form.images.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.4rem', borderRadius: 8, background: 'var(--ivory)', border: '1px solid var(--border)' }}>
                        <div style={{ width: 48, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.opacity = '0.3'} />
                        </div>
                        <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</span>
                        <button type="button" onClick={() => removeImage(img)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', flexShrink: 0, display: 'flex' }}><X size={13} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-faint)', fontSize: '0.82rem', border: '1.5px dashed var(--border)', borderRadius: 10, background: 'var(--ivory)' }}>
                    No images added yet
                  </div>
                )}
              </SectionCard>

              {/* Submit */}
              <button type="submit" className="btn btn-navy btn-full btn-lg" disabled={loading}
                style={{ opacity: loading ? 0.75 : 1, borderRadius: 12 }}>
                {loading ? (
                  <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(248,245,240,0.3)', borderTopColor: '#fff' }} /> {isEdit ? 'Updating...' : 'Creating...'}</>
                ) : (
                  <><Save size={17} /> {isEdit ? 'Save Changes' : 'Create Property'}</>
                )}
              </button>

              <Link to="/admin/properties" className="btn btn-ghost btn-full" style={{ border: '1.5px solid var(--border)', borderRadius: 12, justifyContent: 'center' }}>
                <ArrowLeft size={15} /> Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>

      <style>{`@media(max-width:900px){form>div{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
