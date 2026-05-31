import React from 'react';
import { fmtMoney, fmtDate, colorFor, initials } from '../../utils/helpers';
import { useApi } from '../../hooks/useApi';
import { useApiConfig } from '../../context/ApiConfigContext';
import { apiAdminGetStats } from '../../services/apiService';
import { LoadingSpinner, ErrorBanner, StatusBadge } from '../../components/UI';
import styles from './AdminDashboard.module.css';

const CHART_DATA   = [28, 45, 39, 60, 52, 74, 88];
const CHART_MONTHS = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard({ navigate }) {
  const { apiUrl } = useApiConfig();
  const { data: stats, loading, error, refetch } = useApi(apiAdminGetStats, [apiUrl]);

  if (loading) return <LoadingSpinner message="Loading platform stats…" />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;

  const {
    totalTenants       = 0,
    activeTenants      = 0,
    totalRevenue       = 0,
    mrr                = 0,
    totalUsers         = 0,
    newTenantsThisMonth= 0,
    recentTenants      = [],
    planBreakdown      = {},
  } = stats || {};

  const maxBar = Math.max(...CHART_DATA);

  const statCards = [
    { cls:'blue',   icon:'ti-building-skyscraper', label:'Total Tenants',    value: totalTenants,    trend: `+${newTenantsThisMonth} this month` },
    { cls:'green',  icon:'ti-users',               label:'Total Users',       value: totalUsers,      trend: 'Across all tenants' },
    { cls:'gold',   icon:'ti-currency-dollar',     label:'MRR',               value: fmtMoney(mrr),   trend: 'Monthly recurring' },
    { cls:'purple', icon:'ti-chart-bar',           label:'Total Revenue',     value: fmtMoney(totalRevenue), trend: 'All time' },
  ];

  const plans = Object.entries(planBreakdown);

  return (
    <>
      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {statCards.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background:`var(--${s.cls})18`, color:`var(--${s.cls})` }}>
              <i className={`ti ${s.icon}`} />
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statTrend}><i className="ti ti-trending-up" /> {s.trend}</div>
          </div>
        ))}
      </div>

      <div className={styles.dashGrid}>
        {/* MRR trend chart */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>MRR Growth</div>
            <span className={styles.cardSub}>Last 7 months</span>
          </div>
          <div className={styles.chartBars}>
            {CHART_DATA.map((v, i) => (
              <div key={i} className={styles.barWrap}>
                <div className={styles.bar} style={{
                  height: `${Math.round(v / maxBar * 100)}%`,
                  background: i === 6 ? 'linear-gradient(to top,#f76a6a,#ff9f7a)' : 'var(--bg4)',
                  border: `1px solid ${i === 6 ? '#f76a6a40' : 'var(--border2)'}`,
                }} />
                <div className={styles.barLabel}>{CHART_MONTHS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan breakdown */}
        <div className={styles.card}>
          <div className={styles.cardHead}><div className={styles.cardTitle}>Plan Breakdown</div></div>
          {plans.length ? plans.map(([plan, count]) => {
            const pct = totalTenants ? Math.round((count / totalTenants) * 100) : 0;
            const clr = { starter:'var(--text3)', pro:'var(--blue)', enterprise:'var(--gold)' }[plan] || 'var(--purple)';
            return (
              <div key={plan} className={styles.planRow}>
                <div className={styles.planRowHead}>
                  <span className={styles.planLabel} style={{ textTransform:'capitalize' }}>{plan}</span>
                  <span className={styles.planCount}>{count} tenants</span>
                </div>
                <div className={styles.planTrack}>
                  <div className={styles.planBar} style={{ width:`${pct}%`, background: clr }} />
                </div>
              </div>
            );
          }) : (
            ['starter','pro','enterprise'].map((p, i) => (
              <div key={p} className={styles.planRow}>
                <div className={styles.planRowHead}>
                  <span className={styles.planLabel} style={{ textTransform:'capitalize' }}>{p}</span>
                  <span className={styles.planCount}>—</span>
                </div>
                <div className={styles.planTrack}><div className={styles.planBar} style={{ width:'0%' }} /></div>
              </div>
            ))
          )}

          {/* Active vs suspended pill */}
          <div className={styles.activePill}>
            <div className={styles.pillItem}>
              <span className={styles.pillDot} style={{ background:'var(--green)' }} />
              <span>{activeTenants} Active</span>
            </div>
            <div className={styles.pillItem}>
              <span className={styles.pillDot} style={{ background:'var(--red)' }} />
              <span>{totalTenants - activeTenants} Suspended</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tenants */}
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <div className={styles.cardTitle}>Recent Tenants</div>
          <button className={styles.viewAllBtn} onClick={() => navigate('admin-tenants')}>
            View all <i className="ti ti-arrow-right" />
          </button>
        </div>
        <div className={styles.recentList}>
          {recentTenants.length ? recentTenants.map(t => (
            <div key={t.id} className={styles.recentItem}>
              <div className={styles.recentAvatar} style={{ background:`${colorFor(t.id)}22`, color:colorFor(t.id) }}>
                {initials(t.company || t.name || '?')}
              </div>
              <div className={styles.recentInfo}>
                <div className={styles.recentName}>{t.company || t.name}</div>
                <div className={styles.recentSub}>{t.email} · {fmtDate(t.createdAt)}</div>
              </div>
              <span className={styles.planBadge}>{t.plan}</span>
              <StatusBadge status={t.status || 'active'} />
            </div>
          )) : (
            <div className={styles.empty}>
              <i className="ti ti-building-skyscraper" style={{ fontSize:32, color:'var(--text3)', display:'block', marginBottom:8 }} />
              <div>No tenants yet</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
