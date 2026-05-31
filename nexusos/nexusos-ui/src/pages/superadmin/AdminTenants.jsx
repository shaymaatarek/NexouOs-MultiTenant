import React, { useState } from 'react';
import { colorFor, initials, fmtDate, fmtMoney } from '../../utils/helpers';
import { useApi, useMutation } from '../../hooks/useApi';
import { useApiConfig } from '../../context/ApiConfigContext';
import {
  apiAdminGetTenants, apiAdminSuspendTenant,
  apiAdminActivateTenant, apiAdminDeleteTenant,
} from '../../services/apiService';
import {
  Button, StatusBadge, Tag, Modal, FormRow,
  SearchBar, EmptyState, LoadingSpinner, ErrorBanner,
} from '../../components/UI';
import styles from './AdminTenants.module.css';
import tableStyles from '../TablePage.module.css';

export default function AdminTenants({ showToast }) {
  const { apiUrl } = useApiConfig();
  const { data: tenants = [], loading, error, refetch, setData } = useApi(apiAdminGetTenants, [apiUrl]);
  const { mutate: suspendTenant  } = useMutation(apiAdminSuspendTenant);
  const { mutate: activateTenant } = useMutation(apiAdminActivateTenant);
  const { mutate: deleteTenant   } = useMutation(apiAdminDeleteTenant);

  const [search,     setSearch]     = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailTenant, setDetailTenant] = useState(null);

  const filtered = tenants?.filter(t => {
    const matchSearch = (t.company || t.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (t.email || '').toLowerCase().includes(search.toLowerCase());
    const matchPlan   = planFilter   === 'all' || t.plan   === planFilter;
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const handleSuspend = async (id) => {
    try {
      await suspendTenant(id);
      setData(d => d.map(t => t.id === id ? { ...t, status: 'suspended' } : t));
      showToast('Tenant suspended');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleActivate = async (id) => {
    try {
      await activateTenant(id);
      setData(d => d.map(t => t.id === id ? { ...t, status: 'active' } : t));
      showToast('Tenant activated');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this tenant and all their data?')) return;
    try {
      await deleteTenant(id);
      setData(d => d.filter(t => t.id !== id));
      showToast('Tenant deleted');
    } catch (err) { showToast('Error: ' + err.message); }
  };

  return (
    <>
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Filters */}
      <div className={styles.filtersRow}>
        <SearchBar
          value={search} onChange={setSearch}
          placeholder="Search tenants…"
          hint={`${filtered?.length} of ${tenants?.length}`}
        />
        <select className={styles.filterSelect} value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="all">All Plans</option>
          <option value="Basic">Basic</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value=" Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {loading ? <LoadingSpinner message="Loading tenants…" /> : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Plan</th>
                <th>Users</th>
                <th>MRR</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.length ? filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className={tableStyles.cellFlex}>
                      <div className={tableStyles.avatar} style={{ background:`${colorFor(t.id)}22`, color:colorFor(t.id) }}>
                        {initials(t.company || t.name || '?')}
                      </div>
                      <div>
                        <div className={tableStyles.cellMain}>{t.company || t.name}</div>
                        <div className={tableStyles.cellSub}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Tag>{t.plan}</Tag></td>
                  <td className={tableStyles.muted}>{t.userCount ?? '—'}</td>
                  <td><span className={tableStyles.amount}>{t.mrr != null ? fmtMoney(t.mrr) : '—'}</span></td>
                  <td><StatusBadge status={t.status || 'Active'} /></td>
                  <td className={tableStyles.muted}>{t.createdAt ? fmtDate(t.createdAt) : '—'}</td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Button variant="icon" onClick={() => setDetailTenant(t)} title="View details">
                        <i className="ti ti-eye" />
                      </Button>
                      {t.status === 'suspended' ? (
                        <Button variant="icon" onClick={() => handleActivate(t.id)} title="Activate">
                          <i className="ti ti-player-play" />
                        </Button>
                      ) : (
                        <Button variant="icon" onClick={() => handleSuspend(t.id)} title="Suspend">
                          <i className="ti ti-player-pause" />
                        </Button>
                      )}
                      <Button variant="danger" onClick={() => handleDelete(t.id)} title="Delete">
                        <i className="ti ti-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7}><EmptyState icon="ti-building-off" message="No tenants found" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tenant detail modal */}
      {detailTenant && (
        <Modal
          title="Tenant Details"
          onClose={() => setDetailTenant(null)}
          actions={<Button variant="cancel" onClick={() => setDetailTenant(null)}>Close</Button>}
        >
          <div className={styles.detailGrid}>
            <DetailRow label="Company"    value={detailTenant.company || detailTenant.name} />
            <DetailRow label="Admin Email" value={detailTenant.email} />
            <DetailRow label="Plan"       value={<Tag>{detailTenant.plan}</Tag>} />
            <DetailRow label="Status"     value={<StatusBadge status={detailTenant.status || 'active'} />} />
            <DetailRow label="Users"      value={detailTenant.userCount ?? '—'} />
            <DetailRow label="Products"   value={detailTenant.productCount ?? '—'} />
            <DetailRow label="Orders"     value={detailTenant.orderCount ?? '—'} />
            <DetailRow label="MRR"        value={detailTenant.mrr != null ? fmtMoney(detailTenant.mrr) : '—'} />
            <DetailRow label="Created"    value={detailTenant.createdAt ? fmtDate(detailTenant.createdAt) : '—'} />
          </div>
        </Modal>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
      <span style={{ color:'var(--text2)', fontWeight:500 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
