import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[MailTrace UI ErrorBoundary caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary, #0f172a)',
          color: 'var(--text-primary, #f8fafc)',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            maxWidth: 550,
            width: '100%',
            background: 'var(--bg-secondary, #1e293b)',
            border: '1px solid #ef4444',
            borderRadius: 12,
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertOctagon size={28} style={{ color: '#ef4444' }} />
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                UI Render Glitch Detected
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              A component error was safely intercepted by MailTrace ErrorBoundary.
            </p>
            {this.state.error && (
              <div style={{
                background: '#0f172a',
                padding: '0.75rem 1rem',
                borderRadius: 6,
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.75rem',
                color: '#f87171',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}>
                {this.state.error.toString()}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <a
                href="/"
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #475569',
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  textDecoration: 'none',
                }}
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
