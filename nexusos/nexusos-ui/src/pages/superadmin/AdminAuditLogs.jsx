import React, { useState } from 'react';
import { fmtDate, colorFor, initials } from '../../utils/helpers';
import { useApi } from '../../hooks/useApi';
import { useApiConfig } from '../../context/ApiConfigContext';
import { apiAdminGetAuditLogs } from '../../services/apiService';
import { SearchBar, LoadingSpinner, ErrorBanner, EmptyState } from '../../components/UI';
import tableStyles from '../TablePage.module.css';
import styles from './AdminAuditLogs.module.css';

const ACTION_COLORS = {
  login:          { bg:'#4a7ff718', color:'var(--blue)',   icon:'ti-login' },
  logout:         { bg:'#9aa0b418', color:'var(--text2)',  icon:'ti-logout' },
  create:         { bg:'#3ecf8e18', color:'var(--green)',  icon:'ti-plus' },
  update:         { bg:'#c9a84c18', color:'var(--gold)',   icon:'ti-edit' },
  delete:         { bg:'#f76a6a18', color:'var(--red)',    icon:'ti-trash' },
  suspend:        { bg:'#f76a6a18', color:'var(--red)',    icon:'ti-ban' },
  activate:       { bg:'#3ecf8e18', color:'var(--green)',  icon:'ti-player-play' },
  register:       { bg:'#9f7afa18', color:'var(--purple)', icon:'ti-user-plus' },
  plan_change:    { bg:'#c9a84c18', color:'var(--gold)',   icon:'ti-exchange' },
};

function getActionStyle(action = '') {
  const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k));
  return ACTION_COLORS[key] || { bg:'var(--bg4)', color:'var(--text2)', icon:'ti-activity' };
}

export default function AdminAuditLogs({ showToast }) {
  const { apiUrl } = useApiConfig();
  const [search,       setSearch]       = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  const params = {};
  if (actionFilter !== 'all') params.action = actionFilter;
  if (dateFrom) params.from = dateFrom;
  if (dateTo)   params.to   = dateTo;

  const { data: logs = [], loading, error, refetch } = useApi(
    () => apiAdminGetAuditLogs(Object.keys(params).length ? params : null),
    [apiUrl, actionFilter, dateFrom, dateTo]
  );

  const filtered = logs.filter(l => {
    const haystack = `${l.actorName || ''} ${l.actorEmail || ''} ${l.action || ''} ${l.resource || ''} ${l.tenantName || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <>
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Filters */}
      <div className={styles.filtersRow}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search logs…" hint={`${filtered.length} of ${logs.length}`} />
        <select className={styles.filterSelect} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="all">All Actions</option>
          {Object.keys(ACTION_COLORS).map(a => (
            <option key={a} value={a}>{a.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
          ))}
        </select>
        <div className={styles.dateRange}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width:140 }} />
          <span style={{ color:'var(--text3)', fontSize:12 }}>to</span>
          <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)}   style={{ width:140 }} />
        </div>
        {(dateFrom || dateTo || actionFilter !== 'all') && (
          <button className={styles.clearBtn} onClick={() => { setActionFilter('all'); setDateFrom(''); setDateTo(''); }}>
            <i className="ti ti-x" /> Clear
          </button>
        )}
      </div>

      {loading ? <LoadingSpinner message="Loading audit logs…" /> : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Resource</th><th>Tenant</th><th>IP Address</th></tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((l, idx) => {
                const aStyle = getActionStyle(l.action);
                return (
                  <tr key={l.id || idx}>
                    <td className={tableStyles.mono} style={{ fontSize:11 }}>{l.timestamp ? fmtDate(l.timestamp) : '—'}</td>
                    <td>
                      <div className={tableStyles.cellFlex}>
                        <div className={tableStyles.avatar} style={{ background:`${colorFor(l.actorId || l.actorEmail || 'x')}22`, color:colorFor(l.actorId || l.actorEmail || 'x') }}>
                          {initials(l.actorName || l.actorEmail || '?')}
                        </div>
                        <div>
                          <div className={tableStyles.cellMain}>{l.actorName || '—'}</div>
                          <div className={tableStyles.cellSub}>{l.actorEmail || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.actionBadge} style={{ background:aStyle.bg, color:aStyle.color }}>
                        <i className={`ti ${aStyle.icon}`} style={{ fontSize:12 }} />
                        {l.action || '—'}
                      </span>
                    </td>
                    <td className={tableStyles.muted}>{l.resource || '—'}</td>
                    <td>
                      {l.tenantName
                        ? <span className={styles.tenantPill}>{l.tenantName}</span>
                        : <span className={tableStyles.muted}>—</span>
                      }
                    </td>
                    <td className={tableStyles.mono} style={{ fontSize:11, color:'var(--text3)' }}>{l.ipAddress || '—'}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6}><EmptyState icon="ti-shield-off" message="No audit logs found" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
