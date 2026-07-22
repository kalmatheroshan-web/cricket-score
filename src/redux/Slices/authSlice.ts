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

    logoutSuccess(state) {
      state.user = null;
      state.isLoggedIn = false;  
    },
  },
});

export const { loginSuccess, signupSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer; import { createSlice } from "@reduxjs/toolkit";