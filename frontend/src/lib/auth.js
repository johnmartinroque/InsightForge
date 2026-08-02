const AUTH_STORAGE_KEY = "userInfo";

export function getStoredUserInfo() {
  const storages = [localStorage, sessionStorage];

  for (const storage of storages) {
    try {
      const storedValue = storage.getItem(AUTH_STORAGE_KEY);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch {
      // Ignore storage access issues and fall back to the next option.
    }
  }

  return null;
}

export function storeUserInfo(userInfo, rememberMe = false) {
  const payload = JSON.stringify(userInfo);

  try {
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, payload);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access issues.
  }
}

export function clearUserInfo() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage access issues.
  }
}
