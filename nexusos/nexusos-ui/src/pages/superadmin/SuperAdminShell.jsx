import React, { useState } from 'react';
import AdminSidebar     from '../../components/superadmin/AdminSidebar';
import AdminTopbar      from '../../components/superadmin/AdminTopbar';
import ApiSettingsPanel from '../../components/ApiSettingsPanel';
import { Toast }        from '../../components/UI';

import AdminDashboard     from './AdminDashboard';
import AdminTenants       from './AdminTenants';
import AdminSubscriptions from './AdminSubscriptions';
import AdminAuditLogs     from './AdminAuditLogs';

import appStyles from '../../App.module.css';

export default function SuperAdminShell({ user, onLogout, theme, onToggleTheme, toast, showToast }) {
  const [page,         setPage]         = useState('admin-dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={appStyles.app}>
      <AdminSidebar
        user={user}
        currentPage={page}
        onNavigate={setPage}
        onLogout={onLogout}
      />

      <div className={appStyles.main}>
        <AdminTopbar
          page={page}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <div className={appStyles.content}>
          {page === 'admin-dashboard'     && <AdminDashboard     navigate={setPage} />}
          {page === 'admin-tenants'       && <AdminTenants       showToast={showToast} />}
          {page === 'admin-subscriptions' && <AdminSubscriptions showToast={showToast} />}
          {page === 'admin-audit-logs'    && <AdminAuditLogs     showToast={showToast} />}
        </div>
      </div>

      {settingsOpen && <ApiSettingsPanel onClose={() => setSettingsOpen(false)} />}
      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  );
}
