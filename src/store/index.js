import { configureStore } from '@reduxjs/toolkit';
import assetReducer from './slices/assetSlice';
import documentReducer from './slices/documentSlice.js';
import authReducer from './slices/assetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets: assetReducer,
    documents: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});