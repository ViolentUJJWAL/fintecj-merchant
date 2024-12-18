import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthService from '../../services/authServices';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  error: null,
  loading: false,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching user data...');
    const userData = await AuthService.getProfile();
    console.log('User data fetched successfully:', userData.data);
    return userData.data;
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setUserData: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
    },
    setUserDataFailed: (state) =>{
      state.loading = false;
      state.isAuthenticated = false;
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUser.pending, (state) => {
          state.loading = true;
          console.log('Fetching user data... Status: loading');
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          // Store the full user data
          state.user = action.payload;
          // Also update the basic user info
          state.isAuthenticated = true;
          state.loading = false;
          console.log('User data set successfully in state:', state.user);
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
          console.error('Error setting user data in state:', action.payload);
        });
    }
  },
});

export const { loginSuccess, loginFailure, logout, setLoading, setUserData, setUserDataFailed } = authSlice.actions;

export default authSlice.reducer;


