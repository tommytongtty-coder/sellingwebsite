import { useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, adminGetMe, getAdminToken } from './services/api';

// Session state for the moderation console. Deliberately separate from
// ./auth.js: that one owns the shopper session under the `token` key, this one
// owns the admin session under `admin_token`. Signing in or out of one leaves
// the other untouched.
export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(!!getAdminToken());

  // Validate any stored admin token on mount
  useEffect(() => {
    if (!getAdminToken()) {
      setLoading(false);
      return;
    }
    adminGetMe()
      .then((me) => {
        if (me.role === 'admin') setAdmin(me);
        else adminLogout();
      })
      .catch(() => adminLogout())
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (username, password) => {
    const { user } = await adminLogin({ username, password });
    setAdmin(user);
    return user;
  }, []);

  const signOut = useCallback(() => {
    adminLogout();
    setAdmin(null);
  }, []);

  return { admin, loading, signIn, signOut };
}
