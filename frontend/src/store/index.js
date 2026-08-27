import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ecosystemReducer from './slices/ecosystemSlice';
import uiReducer from './slices/uiSlice';

/**
 * Consolidated Redux Store for SIH 2026 Ecosystem Platform
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ecosystem: ecosystemReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
