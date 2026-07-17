import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { login, signup } from "../lib/api/auth";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const validateEmail = (emailStr: string) => /\S+@\S+\.\S+/.test(emailStr);

  const handleSubmit = async () => {
    if (authMode === "signup" && !name.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert("Required Field", "Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Input", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Invalid Input", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (authMode === "login") {
        await (dispatch as any)(login({ email, password }));
        router.replace("/");
      } else {
        await (dispatch as any)(signup({ username: name, email, password }));
        router.replace("/");
      }
    } catch (error: any) {
      const message = error?.message || "Something went wrong. Please try again.";
      Alert.alert("Authentication Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={["top", "left", "right", "bottom"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand/Product Header Section */}
          <View className="items-center mb-8">
            <View className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 justify-center items-center mb-4">
              <Ionicons name="trophy-outline" size={28} color="#f5c542" />
            </View>
            <Text className="text-white text-2xl font-black tracking-tight mb-1">
              CRIC<Text className="text-[#f5c542]">PLUS</Text>
            </Text>
            <Text className="text-neutral-400 text-xs font-medium">
              {authMode === "login" ? "Sign in to access premium boards" : "Create a free account to join us"}
            </Text>
          </View>

          <View className="space-y-4 mb-6">

            {authMode === "signup" && (
              <View>
                <Text className="text-neutral-400 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">
                  Full Name
                </Text>
                <View className="flex-row items-center bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-3">
                  <View className="mr-2">
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#737373"
                    />
                  </View>
                  <TextInput
                    placeholder="Enter full name"
                    placeholderTextColor="#525252"
                    className="flex-1 text-white text-sm"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            <View>
              <Text className="text-neutral-400 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">
                Email Address
              </Text>
              <View className="flex-row items-center bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-3">
                <View className="mr-2">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="#737373"
                  />
                </View>
                <TextInput
                  placeholder="Enter email address"
                  placeholderTextColor="#525252"
                  className="flex-1 text-white text-sm"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <Text className="text-neutral-400 text-xs font-bold tracking-wider uppercase mb-1.5 ml-1">
                Password
              </Text>
              <View className="flex-row items-center bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-3">
                <Ionicons name="lock-closed-outline" size={18} color="#737373" className="mr-2" />
                <TextInput
                  placeholder={authMode === "login" ? "Enter password" : "Create strong password"}
                  placeholderTextColor="#525252"
                  className="flex-1 text-white text-sm"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#737373"
                  />
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Submit Action Button */}
          <TouchableOpacity
            className={`bg-[#f5c542] py-3.5 rounded-2xl w-full items-center mb-6 shadow-md ${loading ? "opacity-60" : ""
              }`}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black text-sm font-bold tracking-wide">
                {authMode === "login" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Form Mode Option */}
          <View className="flex-row justify-center items-center space-x-1">
            <Text className="text-neutral-400 text-xs font-medium">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode} disabled={loading} activeOpacity={0.7}>
              <Text className="text-[#f5c542] text-xs font-bold">
                {authMode === "login" ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}