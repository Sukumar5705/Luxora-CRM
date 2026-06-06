export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div className="spinner" />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--gold)',
            boxShadow: '0 0 12px var(--gold)',
            animation: 'pulse 1.5s ease infinite'
          }} />
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        fontWeight: 400
      }}>{text}</div>
      <div style={{
        width: 120, height: 2,
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        animation: 'shimmerText 2s ease infinite',
        backgroundSize: '200% 100%'
      }} />
    </div>
  );
}
