import React from 'react';
import styles from './AdminTopbar.module.css';
import topbarStyles from '../Topbar.module.css';

const PAGE_INFO = {
  'admin-dashboard':     { title: 'Platform Dashboard',  sub: 'Global platform overview' },
  'admin-tenants':       { title: 'Tenants',             sub: 'Manage all workspaces' },
  'admin-subscriptions': { title: 'Subscriptions',       sub: 'Billing & plan management' },
  'admin-audit-logs':    { title: 'Audit Logs',          sub: 'Security & activity trail' },
};

export default function AdminTopbar({ page, theme, onToggleTheme, onOpenSettings }) {
  const info   = PAGE_INFO[page] || { title: page, sub: '' };
  const isDark = theme === 'dark';

  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.badge}><i className="ti ti-shield-check" /> Super Admin</div>
        <div>
          <div className={styles.title}>{info.title}</div>
          <div className={styles.sub}>{info.sub}</div>
        </div>
      </div>
      <div className={styles.actions}>
        {/* Theme toggle — reuses same CSS vars from topbar */}
        <button
          className={topbarStyles.themeToggle}
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className={`${topbarStyles.toggleTrack} ${isDark ? topbarStyles.trackDark : topbarStyles.trackLight}`}>
            <div className={`${topbarStyles.toggleThumb} ${isDark ? topbarStyles.thumbDark : topbarStyles.thumbLight}`}>
              {isDark ? <i className="ti ti-moon-stars" /> : <i className="ti ti-sun" />}
            </div>
          </div>
          <span className={topbarStyles.toggleLabel}>{isDark ? 'Dark' : 'Light'}</span>
        </button>
        {/* {onOpenSettings && (
          <button className={topbarStyles.settingsBtn} onClick={onOpenSettings} title="API Settings">
            <i className="ti ti-settings" />
          </button>
        )} */}
      </div>
    </div>
  );
}
