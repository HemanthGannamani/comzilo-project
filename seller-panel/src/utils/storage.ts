const TOKEN_KEY = 'comzilo_access_token';
const REFRESH_TOKEN_KEY = 'comzilo_refresh_token';
const USER_KEY = 'comzilo_user';
const TENANT_KEY = 'comzilo_tenant';
const STORES_KEY = 'comzilo_stores';
const ACTIVE_STORE_KEY = 'comzilo_active_store_id';
const THEME_MODE_KEY = 'comzilo_theme_mode';

export const storage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setAccessToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),

  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: any): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  getTenant: () => {
    const raw = localStorage.getItem(TENANT_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setTenant: (tenant: any): void => localStorage.setItem(TENANT_KEY, JSON.stringify(tenant)),

  getStores: () => {
    const raw = localStorage.getItem(STORES_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  setStores: (stores: any[]): void => localStorage.setItem(STORES_KEY, JSON.stringify(stores)),

  getActiveStoreId: (): number | null => {
    const id = localStorage.getItem(ACTIVE_STORE_KEY);
    if (id && !isNaN(Number(id))) return Number(id);
    const user = storage.getUser();
    if (user?.storeId && !isNaN(Number(user.storeId))) return Number(user.storeId);
    const stores = storage.getStores();
    if (stores && stores.length > 0 && stores[0]?.id && !isNaN(Number(stores[0].id))) {
      return Number(stores[0].id);
    }
    return null;
  },
  setActiveStoreId: (storeId: number | null): void => {
    if (storeId) localStorage.setItem(ACTIVE_STORE_KEY, storeId.toString());
    else localStorage.removeItem(ACTIVE_STORE_KEY);
  },

  getThemeMode: (): 'light' | 'dark' => (localStorage.getItem(THEME_MODE_KEY) as 'light' | 'dark') || 'light',
  setThemeMode: (mode: 'light' | 'dark'): void => localStorage.setItem(THEME_MODE_KEY, mode),

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TENANT_KEY);
    localStorage.removeItem(STORES_KEY);
    localStorage.removeItem(ACTIVE_STORE_KEY);
  },
};
