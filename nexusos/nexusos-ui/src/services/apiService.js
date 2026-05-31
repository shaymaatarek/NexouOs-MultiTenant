/**
 * apiService.js
 *
 * Every function returns a Promise that resolves to parsed JSON data,
 * or throws an Error with a human-readable message on failure.
 *
 * The auth token is read from localStorage on every call so it's always
 * fresh — no need to reinitialise the service after login.
 */

import { getApiBaseUrl, endpoints } from '../config/api';

const LS_TOKEN = 'nexusos_token';

/* ── helpers ──────────────────────────────────────────── */

export const getToken  = ()        => localStorage.getItem(LS_TOKEN);
export const setToken  = (token)   => localStorage.setItem(LS_TOKEN, token);
export const clearToken = ()       => localStorage.removeItem(LS_TOKEN);

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(method, url, body) {
  const opts = {
    method,
    headers: buildHeaders(),
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    // Network / CORS / unreachable
    throw new Error(`Network error: ${err.message}`);
  }

  // Try to parse JSON even on error responses (APIs often return { message })
  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || data || `HTTP ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  return data;
}

/* ── shorthand helpers ────────────────────────────────── */
const get    = (url)         => request('GET',    url);
const post   = (url, body)   => request('POST',   url, body);
const put    = (url, body)   => request('PUT',    url, body);
const patch  = (url, body)   => request('PATCH',  url, body);
const del    = (url)         => request('DELETE', url);

const ep = () => endpoints(getApiBaseUrl());

/* ══════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════ */

/**
 * Login — expects { email, password }
 * API should return { token, user, tenant }
 */
export async function apiLogin({ email, password }) {
  const data = await post(ep().login, { email, password });
  if (data.token) setToken(data.token);
  return data; // { token, user, tenant }
}

/**
 * Register — expects { fname, lname, company, email, password, plan }
 * API should return { token, user, tenant }
 */

export async function apiRegister({ fname, lname, company, email, password, plan }) {
  const data = await post(ep().register, {
    name: `${fname} ${lname}`,
    company, email, password, plan,
  });
  if (data.token) setToken(data.token);
  return data; // { token, user, tenant }
}

export async function apiGetPlans(params) {
  const data = await get(ep().plans);
  return data;
} 

/** Fetch the currently-authenticated user + tenant */
export const apiMe = () => get(ep().me);

/** Clear token (client-side logout) */
export function apiLogout() {
  clearToken();
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */

/**
 * Returns aggregated stats:
 * { totalUsers, totalProducts, totalOrders, revenue, ordersByStatus, recentOrders }
 */
export const apiGetStats = () => get(ep().stats);

/* ══════════════════════════════════════════════════════
   USERS
══════════════════════════════════════════════════════ */
// export const apiGetPlans   = ()         => get(ep().plans);
export const apiGetUsers   = ()         => get(ep().users);
export const apiGetUser    = (id)       => get(ep().user(id));
export const apiCreateUser = (body)     => post(ep().addUser, body);
export const apiUpdateUser = (id, body) => post(ep().editUser(id), body);
export const apiDeleteUser = (id)       => del(ep().deleteUser(id));

/* ══════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════ */

export const apiGetProducts   = ()         => get(ep().products);
export const apiGetProduct    = (id)       => get(ep().product(id));
export const apiCreateProduct = (body)     => post(ep().addProduct, body);
export const apiUpdateProduct = (id, body) => post(ep().updateProduct(id), body);
export const apiDeleteProduct = (id)       => del(ep().deleteProduct(id));

/* ══════════════════════════════════════════════════════
   ORDERS
══════════════════════════════════════════════════════ */

export const apiGetOrders   = ()         => get(ep().orders);
export const apiGetOrder    = (id)       => get(ep().order(id));
export const apiCreateOrder = (body)     => post(ep().addOrder, body);
export const apiUpdateOrder = (id, body) => post(ep().updateOrder(id), body);
export const apiDeleteOrder = (id)       => del(ep().deleteOrder(id));


/* ══════════════════════════════════════════════════════
   SUPER ADMIN
══════════════════════════════════════════════════════ */

// Platform stats
export const apiAdminGetStats         = ()         => get(ep().adminStats);

// Tenants
export const apiAdminGetTenants       = ()         => get(ep().adminTenants);
export const apiAdminGetTenant        = (id)       => get(ep().adminTenant(id));
export const apiAdminSuspendTenant    = (id)       => post(ep().adminSuspendTenant(id));
export const apiAdminActivateTenant   = (id)       => post(ep().adminActivateTenant(id));
export const apiAdminDeleteTenant     = (id)       => del(ep().adminDeleteTenant(id));

// Subscriptions
export const apiAdminGetSubscriptions    = ()         => get(ep().adminSubscriptions);
export const apiAdminUpdateSubscription  = (id, body) => put(ep().adminUpdateSubscription(id), body);

// Audit logs
export const apiAdminGetAuditLogs     = (params)   => get(ep().adminAuditLogs + (params ? '?' + new URLSearchParams(params).toString() : ''));
