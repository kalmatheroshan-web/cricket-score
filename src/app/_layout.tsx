import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/services/toastconfig";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// Disable the strict mode logger warning
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Turn off strict checks
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#f8fafc" },
            }}
          />
          <Toast config={toastConfig} />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}