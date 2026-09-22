import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmailListItem from '../../components/email/EmailListItem';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function FonoSent() {
  const navigate = useNavigate();
  const [starredIds, setStarredIds] = useState([]);

  const fetchSent = useCallback(() => api.getSentEmails(), []);
  const { data, loading, error, refetch } = useApi(fetchSent, []);

  const handleToggleStar = (id) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectEmail = (email) => {
    navigate(`/fono/email/${email.id}`);
  };

  if (loading) {
    return <LoadingState message="Fetching sent and outbound inspected messages from MailTrace REST API..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Sent Mailbox"
        description={error.message || 'Error occurred while contacting FastAPI email service.'}
        onRetry={refetch}
      />
    );
  }

  const sentData = data || [];

  return (
    <div>
      <PageHeader
        title="Sent"
        subtitle="Outbound communications verified and dispatched through the MailTrace pre-delivery gateway."
        icon={Send}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => refetch()}
              className="ui-btn ui-btn-outline"
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}
              title="Refresh Sent Mailbox"
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
          </div>
        }
      />

      <div className="email-client-container">
        <div className="email-client-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>All outbound emails verified by pre-delivery inspection policy</span>
          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Showing <strong>{sentData.length}</strong> sent items
          </div>
        </div>

        {sentData.length === 0 ? (
          <EmptyState
            title="No Sent Messages Yet"
            description="You have not composed or dispatched any emails yet. Click '+ Compose' on the sidebar to send an email."
          />
        ) : (
          <div className="email-list-wrapper">
            {sentData.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                onSelect={handleSelectEmail}
                isStarred={starredIds.includes(email.id)}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FonoSent;
