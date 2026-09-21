import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import EmailListItem from '../../components/email/EmailListItem';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { SPAM_CATEGORIES } from '../../utils/mockFonoData';

export function FonoSpam() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [starredIds, setStarredIds] = useState([]);

  const fetchSpam = useCallback(() => {
    return api.getEmails({ action: 'SPAM', category: selectedCategory });
  }, [selectedCategory]);

  const { data, loading, error, refetch } = useApi(fetchSpam, [selectedCategory]);

  const handleToggleStar = (id) => {
    setStarredIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectEmail = (email) => {
    navigate(`/fono/email/${email.id}`);
  };

  const spamData = data || [];

  return (
    <div>
      <PageHeader
        title="Spam"
        subtitle="Presentation categories for marketing, bulk, social notifications, scam, and low-risk unwanted emails."
        icon={Archive}
      />

      {/* Category Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        {SPAM_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`ui-btn ${isActive ? 'ui-btn-primary' : 'ui-btn-secondary'}`}
              style={{
                fontSize: '0.775rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingState message={`Fetching ${selectedCategory} spam partition entries from REST API...`} />
      ) : error ? (
        <ErrorState
          title="Failed to Load Spam Partitions"
          description={error.message || 'Network error while contacting MailTrace spam partition endpoint.'}
          onRetry={refetch}
        />
      ) : (
        <div className="email-client-container">
          <div className="email-client-toolbar">
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Spam Category: {selectedCategory}
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Showing <strong>{spamData.length}</strong> items
            </div>
          </div>

          {spamData.length === 0 ? (
            <EmptyState 
              title={`No ${selectedCategory} Spam Entries`}
              description={`There are currently no messages in the ${selectedCategory} spam category partition.`}
            />
          ) : (
            <div className="email-list-wrapper">
              {spamData.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  showCategoryBadge={true}
                  onSelect={handleSelectEmail}
                  isStarred={starredIds.includes(email.id)}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FonoSpam;
