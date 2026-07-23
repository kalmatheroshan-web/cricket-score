import { showToast, AUTH, methods } from "./apis";
import { apiconnector } from "../apiconnector";
import { loginSuccess, signupSuccess, logoutSuccess } from "../../redux/Slices/authSlice";
import * as SecureStore from "expo-secure-store";

const { LOGIN, LOGOUT, SIGNUP, GET_SCORER } = AUTH;

// User Authentication Actions
export const login = (data) => async (dispatch) => {
  try {
    const response = await apiconnector(LOGIN, methods.post, data);

    // Guard against null/undefined or failed response flags
    if (!response || response.success === false) {
      const msg = response?.message || "Login failed.";
      showToast("error", msg);
      return response;
    }

    if (response.user) {
      await SecureStore.setItemAsync("user", JSON.stringify(response.user));
    }
    if (response.token) {
      await SecureStore.setItemAsync("token", response.token);
    }

    dispatch(loginSuccess({ user: response.user }));
    showToast("success", response.message || "Login successful!");

    return response;
  } catch (error) {
    console.error("Login Error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to log in. Please try again.";

    showToast("error", errorMessage);
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
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to sign up. Please try again.";
    showToast("error", errorMessage);
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  let response = null;
  try {
    response = await apiconnector(LOGOUT, methods.post);
    showToast("success", response?.message || "Logged out successfully");
  } catch (error) {
    console.error("Logout API Error:", error);
    showToast("info", "Logged out locally");
  } finally {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    } catch (storeError) {
      console.error("Failed to delete secure store keys:", storeError);
    }
    dispatch(logoutSuccess());
  }
  return response;
};

export const getScorer = async () => {
  try {
    const response = await apiconnector(GET_SCORER, methods.get);
    return response;
  } catch (error) {
    console.error("Scorer error:", error);
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch scorer data.";
    showToast("error", errorMessage);
    throw error;
  }
};