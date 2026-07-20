import Toast from "react-native-toast-message";
import { apiconnector } from "../apiconnector";
import { AUTH } from "./apis";
import { loginSuccess, signupSuccess } from "../../redux/Slices/authSlice";

const { LOGIN, LOGOUT, SIGNUP } = AUTH;

import { methods } from "./apis";

// User Authentication Actions
export const login = (data) => async (dispatch) => {
    try {
        const response = await apiconnector(LOGIN, methods.post, data);
        if (response?.message) {
            Toast.show({
                type: "success",
                text1: response?.message,
            });
            dispatch(loginSuccess({ user: response.user }));
            router.replace('/src/app/components/admin/adminui.tsx')
        }
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};

export const signup = (data) => async (dispatch) => {
    try {
        const response = await apiconnector(SIGNUP, methods.post, data);
        if (response?.message) {
            Toast.show({
                type: "success",
                text1: response?.message,
            });

            dispatch(signupSuccess({ user: response.user }));
        }
        return response;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
};

export const logout = () => async (dispatch) => {
    try {
        const response = await apiconnector(LOGOUT, methods.post);
        dispatch(logout());
        return response;
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};