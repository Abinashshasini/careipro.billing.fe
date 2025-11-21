export type User = {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  database_key: string;
  [key: string]: unknown;
};

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  DATABASE_KEY: 'database_key',
} as const;

export const AUTH_COOKIE_KEYS = {
  TOKEN: 'auth_token',
  DATABASE_KEY: 'database_key',
} as const;

export const authClient = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  // Get user from localStorage
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get database key from localStorage
  getDatabaseKey: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.DATABASE_KEY);
  },

  // Set auth data (localStorage + cookies for middleware)
  setAuthData: (data: {
    token: string;
    user: User;
    datastore_key: string;
    token_exp_time?: string;
  }) => {
    if (typeof window === 'undefined') return;

    // Store in localStorage (for client components)
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data));
    localStorage.setItem(AUTH_STORAGE_KEYS.DATABASE_KEY, data.datastore_key);

    // Calculate cookie expiry based on token_exp_time or default to 7 days
    let maxAge = 7 * 24 * 60 * 60; // Default 7 days in seconds

    if (data.token_exp_time) {
      try {
        const expTime = new Date(data.token_exp_time);
        const currentTime = new Date();
        const diffInSeconds = Math.floor(
          (expTime.getTime() - currentTime.getTime()) / 1000,
        );

        // Use calculated time if it's positive, otherwise use default
        if (diffInSeconds > 0) {
          maxAge = diffInSeconds;
        }
      } catch (error) {
        console.warn(
          'Invalid token_exp_time format, using default expiry:',
          error,
        );
      }
    }

    document.cookie = `${AUTH_COOKIE_KEYS.TOKEN}=${data.token}; path=/; max-age=${maxAge}; SameSite=lax`;
    document.cookie = `${AUTH_COOKIE_KEYS.DATABASE_KEY}=${data.datastore_key}; path=/; max-age=${maxAge}; SameSite=lax`;
  },

  // Clear auth data
  clearAuthData: () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.DATABASE_KEY);

    document.cookie = `${AUTH_COOKIE_KEYS.TOKEN}=; path=/; max-age=0`;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authClient.getToken();
  },
};

export const authServer = {
  getTokenFromCookies: (cookieString?: string): string | null => {
    if (!cookieString) return null;

    const cookies = cookieString.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies[AUTH_COOKIE_KEYS.TOKEN] || null;
  },
};
