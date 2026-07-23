import { Stack, Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function ScorerLayout() {
    const { user } = useSelector((state: any) => state.auth);

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#f8fafc" },
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
}