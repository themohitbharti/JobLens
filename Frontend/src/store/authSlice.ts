import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

// Define a type for the minimum required user data
export type PartialUser = Partial<User> & {
  _id: string;
  email: string;
  fullName: string;
};

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
