import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ChevronDown, Activity, Globe, FileCode, Clock } from 'lucide-react';
import { api } from '../../services/api';

export function ThreatSwitcher({ currentId, basePath = '/security/investigation' }) {
  const navigate = useNavigate();
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getSecurityThreats()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setThreats(data);
        }
      })
      .catch((err) => console.warn('Failed to load threat list for switcher:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`${basePath}/${selectedId}`);
    }
  };

  if (loading && threats.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'var(--bg-secondary, #f8fafc)',
      border: '1px solid var(--border-color, #e2e8f0)',
      borderRadius: 8,
      padding: '0.65rem 1rem',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <ShieldAlert size={18} style={{ color: '#ef4444' }} />
        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Active Threat Incident Context:
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: 500 }}>
        <select
          value={currentId || ''}
          onChange={handleSelect}
          style={{
            width: '100%',
            padding: '0.4rem 0.65rem',
            borderRadius: 6,
            border: '1px solid var(--border-color, #cbd5e1)',
            background: 'var(--bg-primary, #ffffff)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {threats.map((t) => (
            <option key={t.id} value={t.id}>
              [{t.classification} • Risk {t.riskScore}] {t.subject} ({t.sender})
            </option>
          ))}
        </select>
      </div>

      {/* Quick Navigation Pills */}
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={() => navigate(`/security/investigation/${currentId || ''}`)}
          className={`ui-btn ${basePath.includes('investigation') ? 'ui-btn-primary' : 'ui-btn-outline'}`}
          style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
          title="Investigation Workspace"
        >
          Workspace
        </button>
        <button
          type="button"
          onClick={() => navigate(`/security/infrastructure/${currentId || ''}`)}
          className={`ui-btn ${basePath.includes('infrastructure') ? 'ui-btn-primary' : 'ui-btn-outline'}`}
          style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
          title="Geolocation Map"
        >
          Map 📍
        </button>
        <button
          type="button"
          onClick={() => navigate(`/security/evidence/${currentId || ''}`)}
          className={`ui-btn ${basePath.includes('evidence') ? 'ui-btn-primary' : 'ui-btn-outline'}`}
          style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
          title="Cryptographic Evidence"
        >
          Evidence
        </button>
        <button
          type="button"
          onClick={() => navigate(`/security/timeline/${currentId || ''}`)}
          className={`ui-btn ${basePath.includes('timeline') ? 'ui-btn-primary' : 'ui-btn-outline'}`}
          style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
          title="Attack Timeline"
        >
          Timeline
        </button>
      </div>
    </div>
  );
}

export default ThreatSwitcher;
