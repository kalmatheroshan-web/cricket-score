import Toast from "react-native-toast-message";

export const apiconnector = async (url, method, body = null, headers = {}) => {
    try {
        // console.log("URL:", url);
        const uppercaseMethod = method.toUpperCase();

        const config = {
            method: uppercaseMethod,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            credentials: "include",
        };

        if (body && uppercaseMethod !== "GET" && uppercaseMethod !== "HEAD") {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);

        // Parse the response only once
        const data = await response.json();

        if (!response.ok || data.success === false) {
            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: data.message || "Something went wrong",
            });
            return null;
        }

        return data;
    } catch (error) {
        console.error("API Connector Error:", error);
        throw error;
    }
};