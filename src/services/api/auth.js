import { showToast, AUTH, methods } from "./apis";
import { apiconnector } from "../apiconnector";
import { loginSuccess, signupSuccess, logoutSuccess } from "../../redux/Slices/authSlice";

const { LOGIN, LOGOUT, SIGNUP, GET_SCORER } = AUTH;

// User Authentication Actions
export const login = (data) => async (dispatch) => {
  try {
    const response = await apiconnector(LOGIN, methods.post, data);

    if (response?.success || response?.message) {
      showToast("success", response.message || "Login successful!");
      if (response?.user) {
        dispatch(loginSuccess({ user: response.user }));
      }
    }
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    showToast("error", error?.response?.data?.message || "Failed to log in. Please try again.");
    throw error;
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    const response = await apiconnector(SIGNUP, methods.post, data);

    if (response?.success || response?.message) {
      showToast("success", response.message || "Account created successfully!");
      if (response?.user) {
        dispatch(signupSuccess({ user: response.user }));
      }
    }
    return response;
  } catch (error) {
    console.error("Signup Error:", error);
    showToast("error", error?.response?.data?.message || "Failed to sign up. Please try again.");
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await apiconnector(LOGOUT, methods.post);
    dispatch(logoutSuccess());

    showToast("success", "Logged out successfully");
    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    // Still clear local state if API logout throws
    dispatch(logoutSuccess());
    showToast("error", "Error logging out");
    throw error;
  }
};

export const getScorer = async () => {
  try {
    const response = await apiconnector(GET_SCORER, methods.get);
    return response;
  } catch (error) {
    console.error("Scorer error:", error);
    showToast("error", "Failed to fetch scorer data.");
    throw error;
  }
};