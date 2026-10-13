// 24-Hour Admin Panel Session Security Manager
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const setAdminSession = (token) => {
  const now = Date.now();
  const expiresAt = now + TWENTY_FOUR_HOURS_MS;
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminLoginTime', now.toString());
  localStorage.setItem('adminTokenExpiry', expiresAt.toString());
};

export const clearAdminSession = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminLoginTime');
  localStorage.removeItem('adminTokenExpiry');
};

export const getRemainingSessionTime = () => {
  const expiry = localStorage.getItem('adminTokenExpiry');
  if (!expiry) return 0;
  const remaining = parseInt(expiry, 10) - Date.now();
  return remaining > 0 ? remaining : 0;
};

export const isTokenValid = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return false;
  }

  // 1. Check explicit 24-hour expiration timestamp
  const expiry = localStorage.getItem('adminTokenExpiry');
  const loginTime = localStorage.getItem('adminLoginTime');
  const now = Date.now();

  if (expiry) {
    if (now >= parseInt(expiry, 10)) {
      clearAdminSession();
      return false;
    }
  } else if (loginTime) {
    // If expiry was missing but loginTime exists
    if (now - parseInt(loginTime, 10) >= TWENTY_FOUR_HOURS_MS) {
      clearAdminSession();
      return false;
    }
  } else {
    // If legacy session exists without loginTime, initialize it to start 24h cycle now
    localStorage.setItem('adminLoginTime', now.toString());
    localStorage.setItem('adminTokenExpiry', (now + TWENTY_FOUR_HOURS_MS).toString());
  }

  // 2. Also check JWT exp claim if encoded in token
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && now >= payload.exp * 1000) {
        clearAdminSession();
        return false;
      }
    }
  } catch (err) {
    // If decoding fails, fallback to timestamp validation above
  }

  return true;
};
