import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Filter, RefreshCw, CheckSquare, Tag, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import EmailListItem from '../../components/email/EmailListItem';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function FonoInbox() {
  const navigate = useNavigate();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [activeTab, setActiveTab] = useState('Primary');
  const [starredIds, setStarredIds] = useState(['msg-001', 'msg-004']);

  const fetchInbox = useCallback(() => api.getEmails({ action: 'INBOX' }), []);
  const { data, loading, error, refetch } = useApi(fetchInbox, []);

  const handleToggleStar = (id) => {
    setStarredIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectEmail = (email) => {
    navigate(`/fono/email/${email.id}`);
  };

  if (loading) {
    return <LoadingState message="Connecting to MailTrace REST API for cleared inbox messages..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Fono Inbox"
        description={error.message || 'Error occurred while contacting FastAPI email service.'}
        onRetry={refetch}
      />
    );
  }

  const rawInbox = data || [];
  const inboxData = showEmptyState ? [] : rawInbox;

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Safe pre-inspected messages cleared for delivery by MailTrace gateway policy."
        icon={Inbox}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => refetch()} 
              className="ui-btn ui-btn-outline"
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}
              title="Refresh Mailbox"
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>
            <button 
              onClick={() => setShowEmptyState((prev) => !prev)} 
              className="ui-btn ui-btn-secondary" 
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              <Filter size={14} />
              <span>{showEmptyState ? 'Show Inspected Inbox' : 'Simulate Empty Inbox'}</span>
            </button>
          </div>
        }
      />

      {/* Main Email Container Shell */}
      <div className="email-client-container">
        {/* Email Client Category Tabs */}
        <div className="email-client-toolbar">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Primary', 'Updates', 'Promotions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`ui-btn ${activeTab === tab ? 'ui-btn-primary' : 'ui-btn-ghost'}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Showing <strong>{inboxData.length}</strong> inspected deliveries
          </div>
        </div>

        {/* Email Rows List */}
        {inboxData.length === 0 ? (
          <EmptyState 
            title="Inbox Clean" 
            description="There are no unread inbox messages found. All pre-inspected emails have been cleared or archived." 
          />
        ) : (
          <div className="email-list-wrapper">
            {inboxData.map((email) => (
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

export default FonoInbox;
