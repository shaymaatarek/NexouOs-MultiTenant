import React from 'react';
import styles from './UI.module.css';

/* ── LoadingSpinner ──────────────────────────────────────── */
export function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinner} />
      <div className={styles.spinnerMsg}>{message}</div>
    </div>
  );
}

/* ── ErrorBanner ─────────────────────────────────────────── */
export function ErrorBanner({ message, onRetry }) {
  return (
    <div className={styles.errorBanner}>
      <i className="ti ti-alert-circle" style={{ fontSize: 18 }} />
      <div className={styles.errorText}>
        <div className={styles.errorTitle}>Failed to load data</div>
        <div className={styles.errorMsg}>{message}</div>
      </div>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          <i className="ti ti-refresh" /> Retry
        </button>
      )}
    </div>
  );
}

/* ── Button ──────────────────────────────────────────────── */
export function Button({ variant = 'primary', children, onClick, disabled, style, type = 'button' }) {
  const cls = {
    primary:   styles.btnPrimary,
    secondary: styles.btnSecondary,
    gold:      styles.btnGold,
    cancel:    styles.btnCancel,
    save:      styles.btnSave,
    logout:    styles.btnLogout,
    icon:      styles.btnIcon,
    danger:    styles.btnDanger,
  }[variant] || styles.btnPrimary;
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style} type={type}>
      {children}
    </button>
  );
}

/* ── StatusBadge ─────────────────────────────────────────── */
export function StatusBadge({ status }) {
  return <span className={`${styles.status} ${styles['status_' + status.toLowerCase()]}`}>{status}</span>;
}

/* ── Tag ─────────────────────────────────────────────────── */
export function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}

/* ── Amount ──────────────────────────────────────────────── */
export function Amount({ children }) {
  return <span className={styles.amount}>{children}</span>;
}

/* ── FormRow ─────────────────────────────────────────────── */
export function FormRow({ label, children, style }) {
  return (
    <div className={styles.formRow} style={style}>
      <label className={styles.formLabel}>{label}</label>
      {children}
    </div>
  );
}

/* ── FormRow2 (2-col grid) ───────────────────────────────── */
export function FormRow2({ children }) {
  return <div className={styles.formRow2}>{children}</div>;
}

/* ── Modal ───────────────────────────────────────────────── */
export function Modal({ title, onClose, children, actions }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>{title}</div>
          <button className={styles.modalClose} onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        {children}
        {actions && <div className={styles.modalActions}>{actions}</div>}
      </div>
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────────── */
export function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className={styles.toast}>
      <i className="ti ti-check" />
      {message}
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
export function EmptyState({ icon = 'ti-inbox', message }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}><i className={`ti ${icon}`} /></div>
      {message}
    </div>
  );
}

/* ── SearchBar ───────────────────────────────────────────── */
export function SearchBar({ value, onChange, placeholder, hint, actions }) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrap}>
        <i className={`ti ti-search ${styles.searchIcon}`} />
        <input
          className={styles.searchInput}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {hint && <span className={styles.searchHint}>{hint}</span>}
      {actions}
    </div>
  );
}

/* ── Logo ────────────────────────────────────────────────── */
export function Logo({ showBadge = false }) {
  return (
    <div className={styles.logo}>
      <div className={styles.logoIcon}>N</div>
      <div className={styles.logoText}>NexusOS</div>
      {showBadge && <span className={styles.logoBadge}>MULTI-TENANT</span>}
    </div>
  );
}
