import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Building2, LayoutDashboard, LogIn, LogOut, UserPlus, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userDrop, setUserDrop]   = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserDrop(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  /* colour logic: transparent on home hero, white when scrolled or non-home */
  const transparent = isHome && !scrolled;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: transparent ? '1.4rem 0' : '0.85rem 0',
        background: transparent ? 'transparent' : 'rgba(255,255,255,0.97)',
        backdropFilter: transparent ? 'none' : 'blur(24px)',
        borderBottom: transparent ? '1px solid transparent' : '1px solid var(--border)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'var(--navy)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Building2 size={16} color="#c9a84c" />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem', fontWeight: 700,
              letterSpacing: '0.02em',
              color: transparent ? '#fff' : 'var(--navy)',
              transition: 'color 0.3s'
            }}>
              Estate<span style={{ color: 'var(--gold)' }}>X</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hide-md">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '0.5rem 1rem',
                fontWeight: 500,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                borderRadius: 6,
                color: isActive(l.to)
                  ? (transparent ? '#c9a84c' : 'var(--navy)')
                  : (transparent ? 'rgba(255,255,255,0.82)' : 'var(--text-muted)'),
                background: isActive(l.to) && !transparent ? 'var(--ivory-warm)' : 'transparent',
                transition: 'all 0.25s',
                position: 'relative',
              }}>
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{
                padding: '0.5rem 1rem', fontWeight: 500, fontSize: '0.9rem',
                borderRadius: 6,
                color: location.pathname.startsWith('/admin')
                  ? 'var(--navy)' : (transparent ? 'rgba(255,255,255,0.82)' : 'var(--text-muted)'),
                background: location.pathname.startsWith('/admin') && !transparent ? 'var(--ivory-warm)' : 'transparent',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                transition: 'all 0.25s',
              }}>
                <LayoutDashboard size={14} /> Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hide-md">
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDrop(!userDrop)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.5rem 0.9rem',
                    background: transparent ? 'rgba(255,255,255,0.12)' : 'var(--ivory-warm)',
                    border: '1px solid',
                    borderColor: transparent ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                    borderRadius: 8, cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy-light), var(--navy))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 700, color: '#c9a84c',
                    flexShrink: 0,
                  }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: '0.88rem', fontWeight: 500,
                    color: transparent ? '#fff' : 'var(--text-body)',
                  }}>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} style={{
                    color: transparent ? 'rgba(255,255,255,0.6)' : 'var(--text-faint)',
                    transform: userDrop ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }} />
                </button>

                {userDrop && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--white)', border: '1px solid var(--border)',
                    borderRadius: 10, boxShadow: 'var(--shadow-lg)',
                    minWidth: 180, padding: '0.5rem', zIndex: 200,
                    animation: 'fadeUp 0.15s ease',
                  }}>
                    <div style={{
                      padding: '0.6rem 0.875rem',
                      borderBottom: '1px solid var(--border)', marginBottom: '0.3rem'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--navy)' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)' }}>{user?.email}</div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.55rem 0.875rem', borderRadius: 6, fontSize: '0.87rem',
                        color: 'var(--text-body)', transition: 'background 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--ivory-warm)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.55rem 0.875rem', borderRadius: 6, fontSize: '0.87rem',
                      color: 'var(--error)', width: '100%', background: 'transparent',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--error-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm"
                  style={{ color: transparent ? 'rgba(255,255,255,0.85)' : 'var(--text-body)' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-navy btn-sm btn-rounded"
                  style={{ background: transparent ? 'rgba(255,255,255,0.15)' : 'var(--navy)', color: '#fff', backdropFilter: transparent ? 'blur(8px)' : 'none' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              background: transparent ? 'rgba(255,255,255,0.1)' : 'var(--ivory-warm)',
              border: '1px solid',
              borderColor: transparent ? 'rgba(255,255,255,0.2)' : 'var(--border)',
              borderRadius: 8,
              color: transparent ? '#fff' : 'var(--navy)',
              transition: 'all 0.25s',
            }}
            className="mobile-toggle">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'var(--white)',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 1rem', borderRadius: 8, fontWeight: 500,
                  fontSize: '0.9rem',
                  color: isActive(l.to) ? 'var(--navy)' : 'var(--text-muted)',
                  background: isActive(l.to) ? 'var(--ivory-warm)' : 'transparent',
                }}>
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1rem', borderRadius: 8, fontWeight: 500,
                  fontSize: '0.9rem', color: 'var(--text-muted)',
                }}>
                  <LayoutDashboard size={14} /> Admin Panel
                </Link>
              )}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn btn-outline btn-full" style={{ justifyContent: 'center', gap: '0.5rem' }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-ghost btn-full" style={{ justifyContent: 'center' }}>Sign In</Link>
                    <Link to="/register" className="btn btn-navy btn-full" style={{ justifyContent: 'center', color: '#fff' }}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .hide-md { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
