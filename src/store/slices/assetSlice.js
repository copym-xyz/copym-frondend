// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  twoFactorRequired: false,
  tempToken: null,
  authLoading: false,
  authError: null,
  sessionExpiry: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.authError = null;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    setTwoFactorRequired: (state, action) => {
      state.twoFactorRequired = true;
      state.tempToken = action.payload;
    },

    clearTwoFactorRequired: (state) => {
      state.twoFactorRequired = false;
      state.tempToken = null;
    },

    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },

    setAuthError: (state, action) => {
      state.authError = action.payload;
    },

    clearAuthError: (state) => {
      state.authError = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.twoFactorRequired = false;
      state.tempToken = null;
      state.sessionExpiry = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },

    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    }
  }
});

// Export actions
export const {
  setCredentials,
  setTwoFactorRequired,
  clearTwoFactorRequired,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
  updateUserProfile,
  setSessionExpiry
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.authLoading;
export const selectAuthError = (state) => state.auth.authError;
export const selectTwoFactorRequired = (state) => state.auth.twoFactorRequired;
export const selectTempToken = (state) => state.auth.tempToken;
export const selectSessionExpiry = (state) => state.auth.sessionExpiry;

// Default export for the reducer
const authReducer = authSlice.reducer;
export default authReducer;