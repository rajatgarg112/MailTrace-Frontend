import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../utils/constants';

export function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <FileQuestion size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Page Not Found (404)</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 420, marginBottom: '1.5rem' }}>
        The requested portal route does not exist or has been relocated.
      </p>
      <Link to={ROUTES.HOME}>
        <Button variant="secondary" icon={ArrowLeft}>
          Return to Portal Gateway
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
