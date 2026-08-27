import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../services/authApi';

// Async Thunk: Fetch Current Authenticated User via HTTP-Only cookie
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.getMe();
    return data?.user || null;
  } catch (error) {
    // Gracefully handle unauthenticated visitor without noisy error state
    return rejectWithValue(null);
  }
});

// Async Thunk: Login User
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.login(credentials);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Register User
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await authApi.register(userData);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async Thunk: Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  user: null,
  activeRole: 'citizen', // 'citizen' | 'panchayat' | 'government' | 'university' | 'industry' | 'public'
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Me
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        if (action.payload?.role) {
          state.activeRole = action.payload.role;
        }
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.activeRole = action.payload.role || 'citizen';
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.activeRole = action.payload.role || 'citizen';
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.activeRole = 'citizen';
        state.loading = false;
      });
  }
});

export const { setActiveRole, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
