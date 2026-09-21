import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ROUTES, IS_SECURITY_APP } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('analyst@mailtrace.ai');
  const [password, setPassword] = useState('••••••••');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      id: 'usr_demo_01',
      name: 'Security Admin',
      email: email || 'analyst@mailtrace.ai',
      role: 'SOC Analyst',
    });
    navigate(IS_SECURITY_APP ? ROUTES.SECURITY.OVERVIEW : ROUTES.FONO.OVERVIEW);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-primary)' }}>
      <Card style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: '#e0f2fe', padding: '0.75rem', borderRadius: '50%', color: '#0284c7', marginBottom: '1rem' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>MailTrace-AI Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Pre-Delivery Threat Portal Authentication
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 6,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 6,
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              required
            />
          </div>

          <Button type="submit" variant="primary" icon={Lock} style={{ width: '100%', marginTop: '0.5rem' }}>
            Authenticate Session
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
