import React from 'react';
import { initials } from '../../utils/helpers';
import { Button } from '../UI';
import styles from './AdminSidebar.module.css';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { page: 'admin-dashboard',     icon: 'ti-layout-dashboard', label: 'Platform Dashboard' },
    ],
  },
  {
    label: 'Management',
    items: [
      { page: 'admin-tenants',       icon: 'ti-building-skyscraper', label: 'Tenants' },
      { page: 'admin-subscriptions', icon: 'ti-credit-card',          label: 'Subscriptions' },
    ],
  },
  {
    label: 'Security',
    items: [
      { page: 'admin-audit-logs',    icon: 'ti-shield-check',        label: 'Audit Logs' },
    ],
  },
];

export default function AdminSidebar({ user, currentPage, onNavigate, onLogout }) {
  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logoRow}>
        <div className={styles.logoIcon}>N</div>
        <div>
          <div className={styles.logoText}>NexusOS</div>
          <div className={styles.logoBadge}>SUPER ADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className={styles.navSection}>{section.label}</div>
            {section.items.map(item => (
              <div
                key={item.page}
                className={`${styles.navItem} ${currentPage === item.page ? styles.active : ''}`}
                onClick={() => onNavigate(item.page)}
              >
                <i className={`ti ${item.icon}`} />
                {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userRow}>
          <div className={styles.userAvatar}>{initials(user?.name || 'SA')}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || 'Super Admin'}</div>
            <div className={styles.userRole}>Super Admin</div>
          </div>
          <Button variant="logout" onClick={onLogout} title="Logout">
            <i className="ti ti-logout" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
