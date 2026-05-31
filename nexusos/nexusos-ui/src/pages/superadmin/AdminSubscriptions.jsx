import React, { useState } from 'react';
import { colorFor, initials, fmtDate, fmtMoney } from '../../utils/helpers';
import { useApi, useMutation } from '../../hooks/useApi';
import { useApiConfig } from '../../context/ApiConfigContext';
import {
  apiAdminGetSubscriptions, apiAdminUpdateSubscription,
} from '../../services/apiService';
import {
  Button, StatusBadge, Tag, Modal, FormRow,
  SearchBar, EmptyState, LoadingSpinner, ErrorBanner,
} from '../../components/UI';
import tableStyles from '../TablePage.module.css';
import styles from './AdminSubscriptions.module.css';

const PLAN_OPTIONS   = ['Basic', 'Pro', 'Enterprise'];
const STATUS_OPTIONS = ['Active', 'Cancelled', 'Past_due', 'Trialing'];

export default function AdminSubscriptions({ showToast }) {
  const { apiUrl } = useApiConfig();
  const { data: subscriptions = [], loading, error, refetch, setData } = useApi(apiAdminGetSubscriptions, [apiUrl]);
  const { mutate: updateSub, loading: updating } = useMutation(apiAdminUpdateSubscription);

  const [search,  setSearch]  = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState({});
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = subscriptions?.filter(s => {
    const name = (s.tenantName || s.company || '').toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchPlan   = planFilter === 'all' || s.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const openEdit = (s) => { setForm({ ...s }); setModal('edit'); };

  const save = async () => {
    try {
      const updated = await updateSub(form.id, { plan: form.plan, status: form.status });
      setData(d => d.map(s => s.id === form.id ? { ...s, ...updated } : s));
      showToast('Subscription updated');
      setModal(null);
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  // Summary cards
  const totalMRR    = subscriptions?.reduce((s, sub) => s + (sub.mrr || 0), 0)??0;
  const activeCount = subscriptions?.filter(s => s.status === 'Active').length;
  const churned     = subscriptions?.filter(s => s.status === 'Cancelled').length;

  return (
    <>
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Summary strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background:'var(--green)18', color:'var(--green)' }}><i className="ti ti-currency-dollar" /></div>
          <div><div className={styles.summaryLabel}>Total MRR</div><div className={styles.summaryValue}>{fmtMoney(totalMRR)}</div></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background:'var(--blue)18', color:'var(--blue)' }}><i className="ti ti-check" /></div>
          <div><div className={styles.summaryLabel}>Active</div><div className={styles.summaryValue}>{activeCount}</div></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background:'var(--red)18', color:'var(--red)' }}><i className="ti ti-x" /></div>
          <div><div className={styles.summaryLabel}>Churned</div><div className={styles.summaryValue}>{churned}</div></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background:'var(--gold)18', color:'var(--gold)' }}><i className="ti ti-building-skyscraper" /></div>
          <div><div className={styles.summaryLabel}>Total Subs</div><div className={styles.summaryValue}>{subscriptions?.length}</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search tenant…" hint={`${filtered?.length} of ${subscriptions?.length}`} />
        <select className={styles.filterSelect} value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="all">All Plans</option>
          {PLAN_OPTIONS.map(p => <option key={p} value={p} style={{ textTransform:'capitalize' }}>{p}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner message="Loading subscriptions…" /> : (
        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr><th>Tenant</th><th>Plan</th><th>MRR</th><th>Status</th><th>Next Billing</th><th>Started</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered?.length ? filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className={tableStyles.cellFlex}>
                      <div className={tableStyles.avatar} style={{ background:`${colorFor(s.tenantId || s.id)}22`, color:colorFor(s.tenantId || s.id) }}>
                        {initials(s.tenantName || s.company || '?')}
                      </div>
                      <div className={tableStyles.cellMain}>{s.tenantName || s.company || '—'}</div>
                    </div>
                  </td>
                  <td><Tag>{s.plan}</Tag></td>
                  <td><span className={tableStyles.amount}>{s.mrr != null ? fmtMoney(s.mrr) : '—'}</span></td>
                  <td><StatusBadge status={s.status || 'Active'} /></td>
                  <td className={tableStyles.muted}>{s.nextBillingDate ? fmtDate(s.nextBillingDate) : '—'}</td>
                  <td className={tableStyles.muted}>{s.createdAt ? fmtDate(s.createdAt) : '—'}</td>
                  <td>
                    <Button variant="icon" onClick={() => openEdit(s)}><i className="ti ti-edit" /></Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7}><EmptyState icon="ti-credit-card-off" message="No subscriptions found" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal === 'edit' && (
        <Modal
          title="Edit Subscription"
          onClose={() => setModal(null)}
          actions={<>
            <Button variant="cancel" onClick={() => setModal(null)} disabled={updating}>Cancel</Button>
            <Button variant="save"   onClick={save}                 disabled={updating}>{updating ? 'Saving…' : 'Save Changes'}</Button>
          </>}
        >
          <FormRow label="Tenant">
            <input value={form.tenantName || form.company || '—'} disabled />
          </FormRow>
          <FormRow label="Plan">
            <select value={form.plan || 'starter'} onChange={e => setF('plan', e.target.value)}>
              {PLAN_OPTIONS.map(p => <option key={p} value={p} style={{ textTransform:'capitalize' }}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
            </select>
          </FormRow>
          <FormRow label="Status">
            <select value={form.status || 'Active'} onChange={e => setF('status', e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
            </select>
          </FormRow>
        </Modal>
      )}
    </>
  );
}
