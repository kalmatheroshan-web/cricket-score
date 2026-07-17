const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const AUTH = {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGOUT: `${BASE_URL}/auth/logout`,
}

export { AUTH };