const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const AUTH = {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGOUT: `${BASE_URL}/auth/logout`,
}
export const TEAMS = {
    GET_TEAMS: `${BASE_URL}/teams`,
    CREATE_TEAM: `${BASE_URL}/teams`,
    DELETE_TEAM: `${BASE_URL}/teams`,
    GET_TEAM_PLAYERS: `${BASE_URL}/teams/players`,
    ADD_TEAM_PLAYER: `${BASE_URL}/teams/players`,
    UPDATE_TEAM_PLAYER: `${BASE_URL}/teams/players`,
    DELETE_TEAM_PLAYER: `${BASE_URL}/teams/players`,
    GET_TEAM_STATS: `${BASE_URL}/teams/stats`,
    UPDATE_TEAM_STATS: `${BASE_URL}/teams/stats`,
}

export const MATCHES = {
    LAUNCH_MATCHES: `${BASE_URL}/matches/launch`,
    CREATE_MATCH: `${BASE_URL}/matches`,
    UPDATE_MATCH: `${BASE_URL}/matches/score`,        
    GET_MATCHES: `${BASE_URL}/matches`,
    COMPLETE_MATCH: `${BASE_URL}/matches/:id/complete`,
};

export const methods = {
    get: "GET",
    post: "POST",
    put: "PUT",
    patch: "PATCH",
    delete: "DELETE",
    head: "HEAD",
    options: "OPTIONS",
};

export const showToast = (type, text1, text2) => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        position: 'top center',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
    });
}


