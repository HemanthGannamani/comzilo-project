import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

const initialToken = localStorage.getItem('admin_access_token');
const initialUser = localStorage.getItem('admin_user_data')
  ? JSON.parse(localStorage.getItem('admin_user_data')!)
  : null;

const initialState: AuthState = {
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  role: initialUser?.role || 'SUPER_ADMIN',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.role = action.payload.user?.role || 'SUPER_ADMIN';

      localStorage.setItem('admin_access_token', action.payload.accessToken);
      localStorage.setItem('admin_user_data', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.role = null;

      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_user_data');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
