import Toast from "react-native-toast-message";

export const apiconnector = async (url, method, body = null, headers = {}) => {
    try {
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


        const rawText = await response.text();
        let data = null;

        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch {
            data = null; // It's plain text or HTML!
        }

        // Step 3: Handle HTTP errors or backend error flags
        if (!response.ok || (data && data.success === false)) {
            // Pick the best available message: JSON message > plain text > HTTP status
            const errorMessage =
                data?.message ||
                rawText ||
                `Request failed with status ${response.status}`;

            Toast.show({
                type: "error",
                text1: "Request Failed",
                text2: errorMessage,
            });

            return null;
        }

        return data !== null ? data : rawText;
    } catch (error) {
        console.error("API Connector Error:", error);

        Toast.show({
            type: "error",
            text1: "Network Error",
            text2: error.message || "Could not connect to the server",
        });

        throw error;
    }
}; 