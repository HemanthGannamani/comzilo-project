import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, TenantContext, StoreContext } from '../../types/auth.types';
import { storage } from '../../utils/storage';

const initialState: AuthState = {
  user: storage.getUser(),
  tenant: storage.getTenant(),
  stores: storage.getStores(),
  activeStoreId: storage.getActiveStoreId(),
  accessToken: storage.getAccessToken(),
  refreshToken: storage.getRefreshToken(),
  isAuthenticated: !!storage.getAccessToken(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tenant: TenantContext;
        stores: StoreContext[];
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, tenant, stores, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.tenant = tenant;
      state.stores = stores;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.activeStoreId = stores.length > 0 ? stores[0].id : null;

      storage.setUser(user);
      storage.setTenant(tenant);
      storage.setStores(stores);
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
      storage.setActiveStoreId(state.activeStoreId);
    },

    setActiveStore: (state, action: PayloadAction<number>) => {
      state.activeStoreId = action.payload;
      storage.setActiveStoreId(action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.tenant = null;
      state.stores = [];
      state.activeStoreId = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      storage.clearAuth();
    },
  },
});

export const { setCredentials, setActiveStore, logout } = authSlice.actions;
export default authSlice.reducer;
