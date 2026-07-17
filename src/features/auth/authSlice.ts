import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signupSuccess(state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout, signupSuccess } = authSlice.actions;
export default authSlice.reducer;