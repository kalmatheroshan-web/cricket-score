import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toastconfig";
import { Provider } from "react-redux";
import { store } from "../hooks/store";
import "./global.css";

export default function Layout() {
  return (<Provider store={store}>
    <Stack screenOptions={{ headerShown: false }} />
    <Toast config={toastConfig} />
  </Provider>
  );
}