import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

const initialToken = localStorage.getItem('customer_access_token');
const initialUser = localStorage.getItem('customer_user_data')
  ? JSON.parse(localStorage.getItem('customer_user_data')!)
  : null;

const initialState: AuthState = {
  user: initialUser,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  role: initialUser?.role || 'CUSTOMER',
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
      state.role = action.payload.user?.role || 'CUSTOMER';

      localStorage.setItem('customer_access_token', action.payload.accessToken);
      localStorage.setItem('customer_user_data', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.role = null;

      localStorage.removeItem('customer_access_token');
      localStorage.removeItem('customer_user_data');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
