import { GoogleIcon } from "@/icons/GoogleIcons";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { login, signup } from "../../services/api/auth";
import { useRouter } from "expo-router";

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
}

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm<FormData>({
        defaultValues: { email: "", password: "", confirmPassword: "" },
    });
    const dispatch = useDispatch();
    const router = useRouter();

    const passwordValue = watch("password");

    const onSubmit = async (data: FormData) => {
        if (isLogin)
            login({ email: data.email, password: data.password })(dispatch);
        else
            signup(data)(dispatch);
        router.replace("/components/admin/adminui");
        reset();
    };

    return (
        <View className="flex-1 bg-black">
            <LinearGradient
                colors={["#1e1b4b", "transparent"]}
                className="absolute top-[-20%] self-center w-[120%] h-[50%] opacity-40 rounded-full blur-[140px]"
            />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                        className="px-8 pt-12 pb-6"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header Block */}
                        <View className="mt-8">
                            <Text className="text-zinc-600 text-[11px] font-black tracking-[0.3em] uppercase mb-2">
                                {isLogin ? "System Access" : "Create Passport"}
                            </Text>
                            <Text className="text-4xl font-extrabold tracking-tight text-zinc-100">
                                Cric<Text className="text-amber-500">.</Text>
                            </Text>
                            <Text className="text-zinc-500 text-sm mt-2 font-medium tracking-wide">
                                {isLogin ? "Sign in to your private workspace." : "Join the premium sports ecosystem."}
                            </Text>
                        </View>

                        {/* Interactive Form fields */}
                        <View className="flex justify-center gap-3 my-10 space-y-4">
                            {
                                !isLogin && (
                                    <View>
                                        <Controller
                                            control={control}
                                            name="username"
                                            rules={{
                                                required: "Identity required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid format",
                                                },
                                            }}
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <View className={`flex-row items-center rounded-2xl px-4 h-14 border ${focusedField === "username"
                                                    ? "bg-zinc-900 border-zinc-500"
                                                    : "bg-zinc-900/40 border-zinc-800/60"
                                                    }`}>
                                                    <Feather name="user" size={16} color={focusedField === "username" ? "#f59e0b" : "#52525b"} />
                                                    <TextInput
                                                        className="flex-1 h-full ml-3.5 text-zinc-200 text-sm font-medium tracking-wide"
                                                        placeholder="John Bias"
                                                        placeholderTextColor="#3f3f46"
                                                        onBlur={() => { onBlur(); setFocusedField(null); }}
                                                        onFocus={() => setFocusedField("username")}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        autoCapitalize="none"
                                                    />
                                                </View>
                                            )}
                                        />
                                        {errors.email && (
                                            <Text className="text-amber-500/90 text-[11px] mt-1.5 ml-2 tracking-wide font-medium">
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </View>
                                )
                            }
                            {/* Email Input Field */}
                            <View>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "Identity required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid format",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className={`flex-row items-center rounded-2xl px-4 h-14 border ${focusedField === "email"
                                            ? "bg-zinc-900 border-zinc-500"
                                            : "bg-zinc-900/40 border-zinc-800/60"
                                            }`}>
                                            <Feather name="mail" size={16} color={focusedField === "email" ? "#f59e0b" : "#52525b"} />
                                            <TextInput
                                                className="flex-1 h-full ml-3.5 text-zinc-200 text-sm font-medium tracking-wide"
                                                placeholder="Email address"
                                                placeholderTextColor="#3f3f46"
                                                onBlur={() => { onBlur(); setFocusedField(null); }}
                                                onFocus={() => setFocusedField("email")}
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                            />
                                        </View>
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-amber-500/90 text-[11px] mt-1.5 ml-2 tracking-wide font-medium">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>

                            {/* Password Input Field */}
                            <View>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: "Security keys required",
                                        minLength: { value: 6, message: "Security threshold is 6 units" },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View className={`flex-row items-center rounded-2xl px-4 h-14 border ${focusedField === "password"
                                            ? "bg-zinc-900 border-zinc-500"
                                            : "bg-zinc-900/40 border-zinc-800/60"
                                            }`}>
                                            <Feather name="lock" size={16} color={focusedField === "password" ? "#f59e0b" : "#52525b"} />
                                            <TextInput
                                                className="flex-1 h-full ml-3.5 text-zinc-200 text-sm font-medium tracking-wide"
                                                placeholder="Password"
                                                placeholderTextColor="#3f3f46"
                                                secureTextEntry={!showPassword}
                                                onBlur={() => { onBlur(); setFocusedField(null); }}
                                                onFocus={() => setFocusedField("password")}
                                                onChangeText={onChange}
                                                value={value}
                                                autoCapitalize="none"
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={12} activeOpacity={0.7}>
                                                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="#52525b" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.password && (
                                    <Text className="text-amber-500/90 text-[11px] mt-1.5 ml-2 tracking-wide font-medium">
                                        {errors.password.message}
                                    </Text>
                                )}
                            </View>

                            {/* Confirm Password (Only when Registration active) */}
                            {!isLogin && (
                                <View>
                                    <Controller
                                        control={control}
                                        name="confirmPassword"
                                        rules={{
                                            required: "Password matching verification required",
                                            validate: (value) => value === passwordValue || "Signature match failure",
                                        }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View className={`flex-row items-center rounded-2xl px-4 h-14 border ${focusedField === "confirmPassword"
                                                ? "bg-zinc-900 border-zinc-500"
                                                : "bg-zinc-900/40 border-zinc-800/60"
                                                }`}>
                                                <Feather name="shield" size={16} color={focusedField === "confirmPassword" ? "#f59e0b" : "#52525b"} />
                                                <TextInput
                                                    className="flex-1 h-full ml-3.5 text-zinc-200 text-sm font-medium tracking-wide"
                                                    placeholder="Confirm signature"
                                                    placeholderTextColor="#3f3f46"
                                                    secureTextEntry={!showConfirmPassword}
                                                    onBlur={() => { onBlur(); setFocusedField(null); }}
                                                    onFocus={() => setFocusedField("confirmPassword")}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    autoCapitalize="none"
                                                />
                                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={12} activeOpacity={0.7}>
                                                    <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={16} color="#52525b" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    {errors.confirmPassword && (
                                        <Text className="text-amber-500/90 text-[11px] mt-1.5 ml-2 tracking-wide font-medium">
                                            {errors.confirmPassword.message}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Main CTA Primary Action */}
                            <TouchableOpacity
                                className="rounded-2xl bg-zinc-100 h-14 items-center justify-center mt-6 active:opacity-90"
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                activeOpacity={0.85}
                            >
                                <Text className="text-black font-bold text-sm tracking-wide">
                                    {isSubmitting ? "Verifying..." : isLogin ? "Continue" : "Register Node"}
                                </Text>
                            </TouchableOpacity>

                            {/* View Toggle Strategy */}
                            <TouchableOpacity className="py-2 mt-2" onPress={() => { setIsLogin(!isLogin); reset(); }} activeOpacity={0.7}>
                                <Text className="text-center text-xs text-zinc-500 font-medium tracking-wide">
                                    {isLogin ? "Need a dynamic workspace profile? " : "Existing profile? "}
                                    <Text className="text-zinc-300 font-semibold underline">{isLogin ? "Create account" : "Login"}</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Social Single Sign On Layer */}
                        <View className="mb-4">
                            <TouchableOpacity
                                className="flex-row items-center border border-orange-400/50 justify-center bg-transparent rounded-2xl h-14 active:bg-zinc-900/40"
                                activeOpacity={0.8}
                            >
                                <GoogleIcon width={16} height={16} />
                                <Text className="text-zinc-300 font-semibold text-md tracking-wide ml-3">
                                    Google
                                </Text>
                            </TouchableOpacity>

                            {/* Structural Fine Legal terms */}
                            <Text className="text-zinc-600 text-center text-[10px] mt-8 leading-relaxed font-medium tracking-wide">
                                Protected by encryption layers. By entering, you agree with our{"\n"}
                                <Text className="text-zinc-500 underline">Terms of Architecture</Text> & <Text className="text-zinc-500 underline">Privacy Systems</Text>
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

export default Auth;