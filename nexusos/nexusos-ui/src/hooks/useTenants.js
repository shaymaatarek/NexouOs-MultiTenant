import { useState, useCallback } from 'react';
import { apiLogin, apiRegister, apiLogout, apiMe, getToken } from '../services/apiService';

export function useTenants() {
  // Restore session from existing token on mount
  const [session, setSession] = useState(() => {
    const token = getToken();
    return token ? { token, user: null, tenant: null, loading: true } : null;
  });

  const [currentUser,   setCurrentUser]   = useState(null);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [hydrated,      setHydrated]      = useState(!getToken()); // true when no token

  // Hydrate user/tenant from /auth/me on first mount if token exists
  useState(() => {
    if (!getToken()) return;
    apiMe()
      .then(({ user, tenant }) => {
        setCurrentUser(user);
        setCurrentTenant(tenant);
      })
      .catch(() => {
        apiLogout();
        setSession(null);
      })
      .finally(() => setHydrated(true));
  });

  const login = useCallback(async (email, password) => {
    const { user, tenant } = await apiLogin({ email, password }); // throws on failure
    setCurrentUser(user);
    setCurrentTenant(tenant);
    setSession({ email });
    setHydrated(true);
    return true;
  }, []);

  const register = useCallback(async (formData) => {
    const { user, tenant } = await apiRegister(formData); // throws on failure
    setCurrentUser(user);
    setCurrentTenant(tenant);
    setSession({ email: formData.email });
    setHydrated(true);
    return user;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setSession(null);
    setCurrentUser(null);
    setCurrentTenant(null);
  }, []);

  // updateTenant is kept for any local optimistic update from the old flow
  const updateTenant = useCallback((updater) => {
    setCurrentTenant(t => typeof updater === 'function' ? updater(t) : updater);
  }, []);

  return {
    currentTenant,
    currentUser,
    login,
    register,
    logout,
    updateTenant,
    isLoggedIn: !!session && hydrated,
    hydrating:  !!session && !hydrated,
    isSuperAdmin:  currentUser?.role === "SA",
  };
}
