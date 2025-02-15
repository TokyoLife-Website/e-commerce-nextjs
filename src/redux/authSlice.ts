import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface AuthState {
  userId: string | number | null;
  email: string;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  userId: null,
  email: "",
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setEmail(
      state,
      action: PayloadAction<{
        email: string;
      }>
    ) {
      state.email = action.payload.email;
    },
    login(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: string | number;
      }>
    ) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userId = null;
      state.refreshToken = null;
    },
  },
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["userId", "accessToken", "refreshToken", "isAuthenticated"],
};

export const { login, logout, setToken, setEmail } = authSlice.actions;

export default persistReducer(persistConfig, authSlice.reducer);
