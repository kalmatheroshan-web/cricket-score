import Toast from "react-native-toast-message";
import { apiconnector } from "../apiconnector";
import { AUTH, methods } from "./apis";
// 1. Added logoutSuccess to clear the user state from Redux
import { loginSuccess, signupSuccess, logoutSuccess } from "../../redux/Slices/authSlice";

const { LOGIN, LOGOUT, SIGNUP, GET_SCORER } = AUTH;

// User Authentication Actions
export const login = (data) => async (dispatch) => {
    try {
        const response = await apiconnector(LOGIN, methods.post, data);
        if (response?.message) {
            Toast.show({
                type: "success",
                text1: response.message,
            });
            dispatch(loginSuccess({ user: response.user }));
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
                text1: response.message,
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
        dispatch(logoutSuccess());

        Toast.show({
            type: "success",
            text1: "Logged out successfully",
        });
        return response;
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};

export const getScorer = async () => {
    try {
        const response = await apiconnector(GET_SCORER, methods.get);
        return response;
    } catch (error) {
        console.log('Scorer error');
        throw error;
    }
}
