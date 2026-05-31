/**
 * API Configuration
 *
 * The base URL is read from:
 *   1. Runtime override stored in localStorage  (set via the Settings panel)
 *   2. VITE_API_BASE_URL environment variable   (set in .env)
 *   3. Hard-coded fallback below
 *
 * To point at a different backend without rebuilding:
 *   - Open the Settings panel (⚙ in the top bar) and enter your API URL.
 *   - Or set VITE_API_BASE_URL=https://your-api.com in .env before building.
 */

export const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const LS_KEY = 'nexusos_api_url';

export const getApiBaseUrl = () =>
  localStorage.getItem(LS_KEY) || DEFAULT_API_URL;

export const setApiBaseUrl = (url) => {
  const clean = url.trim().replace(/\/$/, '');  // strip trailing slash
  localStorage.setItem(LS_KEY, clean);
  return clean;
};

export const resetApiBaseUrl = () => {
  localStorage.removeItem(LS_KEY);
  return DEFAULT_API_URL;
};

/**
 * All endpoint builders — each returns a full URL string.
 * Centralised here so changing the shape of your API only
 * needs edits in one place.
 */
export const endpoints = (base) => ({
  // Auth
  login:           `${base}/auth/login`,
  register:        `${base}/user/register`,
  me:              `${base}/auth/me`,
  plans:           `${base}/tenant/getPlans`,
  // Users  (tenant-scoped via JWT on the server)
  users:           `${base}/user/getUsers`,
  addUser:         `${base}/user/addUser`,  
  editUser: (id)=> `${base}/user/editUser?id=${id}`,  
  deleteUser:(id)=> `${base}/user/deleteUser?id=${id}`,  
  user:     (id)=> `${base}/user/getUser/${id}`,

  // Products
  products:        `${base}/product/getProducts`,
  addProduct:      `${base}/product/addProduct`,
  updateProduct: (id)=>  `${base}/product/updateProduct?id=${id}`,
  deleteProduct: (id)=>  `${base}/product/deleteProduct?id=${id}`,
  product:  (id)=> `${base}/products/${id}`,

  // Orders
  orders:          `${base}/order/getOrders`,
  addOrder:      `${base}/order/addOrder`,
  updateOrder: (id)=>  `${base}/order/updateOrder?id=${id}`,
  deleteOrder: (id)=>  `${base}/order/deleteOrder?id=${id}`,
  order:    (id)=> `${base}/orders/${id}`,

  // Dashboard stats (single endpoint returning aggregated counts)
  stats:           `${base}/charts/stats`,

  
  // ── Super Admin endpoints ──────────────────────────
  // Platform dashboard
  adminStats:          `${base}/admin/stats`,

  // Tenant management
  adminTenants:        `${base}/admin/tenants`,
  adminTenant: (id)=>  `${base}/admin/tenants/${id}`,
  adminSuspendTenant:(id)=> `${base}/admin/tenants/${id}/suspend`,
  adminActivateTenant:(id)=>`${base}/admin/tenants/${id}/activate`,
  adminDeleteTenant:(id)=> `${base}/admin/tenants/${id}`,

  // Subscriptions
  adminSubscriptions:       `${base}/admin/subscriptions`,
  adminSubscription:(id)=>  `${base}/admin/subscriptions/${id}`,
  adminUpdateSubscription:(id)=>`${base}/admin/subscriptions/${id}`,

  // Audit logs
  adminAuditLogs:      `${base}/admin/audit-logs`,
});
