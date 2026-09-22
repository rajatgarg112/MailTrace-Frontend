import React, { useCallback } from 'react';
import { LayoutDashboard, Inbox, Archive, AlertTriangle, ShieldAlert, ArrowUpRight, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { SecurityTagList } from '../../components/ui/SecurityTag';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import DataTable from '../../components/ui/DataTable';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function FonoOverview() {
  const fetchOverview = useCallback(() => api.getFonoOverview(), []);
  const { data, loading, error, refetch } = useApi(fetchOverview, []);

  if (loading) {
    return <LoadingState message="Connecting to MailTrace REST API for overview metrics..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Unable to Sync Fono Overview"
        description={error.message || 'Failed to fetch overview metrics from backend API.'}
        onRetry={refetch}
      />
    );
  }

  const stats = data?.stats || {};
  const recentDeliveries = data?.recentDeliveries || [];

  const columns = [
    {
      header: 'Subject & Sender',
      key: 'subject',
      render: (val, row) => (
        <div style={{ maxWidth: 360 }}>
          <div style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }} title={row.subject}>
            {row.unread && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', marginRight: 6 }} />}
            {row.subject}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.sender}>
            From: {row.senderName ? `${row.senderName} (${row.sender})` : row.sender}
          </div>
        </div>
      ),
    },
    {
      header: 'Verdict',
      key: 'classification',
      render: (val) => <StatusBadge type="classification" value={val} />,
    },
    {
      header: 'Delivery Action',
      key: 'action',
      render: (val) => <StatusBadge type="action" value={val} />,
    },
    {
      header: 'Security Explanation',
      key: 'tags',
      render: (tags) => tags && tags.length > 0 ? (
        <SecurityTagList tags={tags} limit={2} size="small" />
      ) : (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clean (No tags)</span>
      ),
    },
    {
      header: 'Provenance',
      key: 'provenance',
      render: (prov) => <ProvenanceBadge provenance={prov} size="small" />,
    },
    {
      header: 'Time',
      key: 'displayTime',
      render: (t) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t}</span>,
    },
    {
      header: 'View',
      key: 'id',
      align: 'right',
      render: (id) => (
        <Link to={`/fono/email/${id}`} className="ui-btn ui-btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.775rem' }}>
          <span>Inspect</span>
          <ArrowUpRight size={13} />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Mail Overview"
        subtitle="Pre-delivery protection metrics, mailbox partitions, and recent delivery status."
        icon={LayoutDashboard}
      />

      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Inbox Deliveries"
          value={stats.inboxClean || 0}
          subtitle={`${stats.unreadInbox || 0} unread clean messages`}
          icon={Inbox}
          badge={<StatusBadge type="action" value="INBOX" showIcon={false} />}
          accentColor="green"
        />

        <StatCard
          title="Spam Partitions"
          value={stats.spamCount || 0}
          subtitle="Marketing, bulk & scams"
          icon={Archive}
          badge={<StatusBadge type="action" value="SPAM" showIcon={false} />}
          accentColor="orange"
        />

        <StatCard
          title="Security Warnings"
          value={stats.warningCount || 0}
          subtitle="Suspicious / Hold messages"
          icon={AlertTriangle}
          badge={<StatusBadge type="action" value="WARN" showIcon={false} />}
          accentColor="orange"
        />

        <StatCard
          title="Quarantine Vault"
          value={stats.quarantineCount || 0}
          subtitle="Malicious mail isolated"
          icon={ShieldAlert}
          badge={<StatusBadge type="action" value="QUARANTINE" showIcon={false} />}
          accentColor="red"
        />
      </div>

      <Card 
        title="Recent Inspected Delivery Status"
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/fono/sent" className="ui-btn ui-btn-outline" style={{ fontSize: '0.775rem', padding: '0.25rem 0.65rem' }}>
              <Send size={13} />
              <span>Go to Sent</span>
            </Link>
            <Link to="/fono/inbox" className="ui-btn ui-btn-outline" style={{ fontSize: '0.775rem', padding: '0.25rem 0.65rem' }}>
              <Mail size={13} />
              <span>Go to Inbox</span>
            </Link>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={recentDeliveries}
          emptyTitle="No Deliveries Inspected"
          emptyDescription="Mailbox status stream will populate as emails arrive."
        />
      </Card>
    </div>
  );
}

export default FonoOverview;
