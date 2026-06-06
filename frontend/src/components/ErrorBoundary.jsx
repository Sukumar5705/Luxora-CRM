

    import { Component } from 'react';

    export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Replace with your logging service (Sentry, Datadog, etc.) in production
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Navigate home — window.location is acceptable here as a last-resort reset
        window.location.href = '/';
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'var(--bg-dark)',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '3.5rem' }}>⚠️</div>
            <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--text-primary)',
            }}>
            Something went wrong
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.6 }}>
            An unexpected error occurred. Our team has been notified. You can try
            going back to the home page.
            </p>

            {/* Show error detail in development only */}
            {import.meta.env.DEV && this.state.error && (
            <pre style={{
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(224,90,90,0.3)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                fontSize: '0.78rem',
                color: 'var(--error)',
                maxWidth: 600,
                overflowX: 'auto',
                textAlign: 'left',
            }}>
                {this.state.error.toString()}
            </pre>
            )}

            <button
            onClick={this.handleReset}
            className="btn btn-gold"
            style={{ marginTop: '0.5rem' }}
            >
            Return to Home
            </button>
        </div>
        );
    }
    }