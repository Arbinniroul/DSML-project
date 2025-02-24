// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define a specific type for the user structure based on your model
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // To handle loading state
  error: string | null; // To handle error state
}

// Load user from session storage on initial load
const loadUserFromSessionStorage = (): User | null => {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const initialState: AuthState = {
  isAuthenticated: !!loadUserFromSessionStorage(), // Set isAuthenticated based on session storage
  user: loadUserFromSessionStorage(),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8001/api/auth/login', credentials);
      return response.data; // Return the user data and token from the response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed'); // Handle error message
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8001/api/auth/register', userData);
      return response.data; // Return the user data and token from the response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed'); // Handle error message
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false; // Set isAuthenticated to false on logout
      state.user = null; // Clear user data
      state.error = null; // Clear any errors
      sessionStorage.removeItem('user'); // Remove user from session storage on logout
      sessionStorage.removeItem('token'); // Remove token from session storage on logout
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload; // Set the user data
      state.isAuthenticated = true; // Set isAuthenticated to true
      sessionStorage.setItem('user', JSON.stringify(action.payload)); // Save user to session storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading to true while waiting for response
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isAuthenticated = true; // Set isAuthenticated to true
        state.user = action.payload.user; // Set user data from the response

        state.loading = false; // Set loading to false after receiving response
        state.error = null; // Clear any previous errors

        // Save user and token to session storage
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
        sessionStorage.setItem('token', action.payload.token);

        console.log('Login successful:', action.payload.user); // Debugging
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload as string; // Use the error message from the thunk
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true; // Set loading to true while waiting for response
        state.error = null; // Clear any previous errors
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isAuthenticated = false; // Fix: Set to true after registration
        state.user = action.payload.user; // Set user data from the response
        state.loading = false; // Set loading to false after receiving response
        state.error = null; // Clear any previous errors

        // Save user and token to session storage
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
        sessionStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload as string; // Use the error message from the thunk
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;