import React, { useState, useEffect } from "react";
import {
    Pressable,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Eye, EyeOff, User } from "lucide-react-native";

import { GoogleIcon } from "@/icons/GoogleIcons";
import { login, signup } from "../../services/api/auth";
import { signupSuccess } from "@/redux/Slices/authSlice";

// Custom lightweight Zod Resolver
const zodResolver = (schema: z.ZodTypeAny) => async (values: unknown) => {
    const result = schema.safeParse(values);

    if (result.success) {
        return { values: result.data, errors: {} };
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const errors = Object.keys(fieldErrors).reduce((acc, key) => {
        const messages = fieldErrors[key as keyof typeof fieldErrors];
        if (messages?.length) {
            acc[key] = {
                type: "validation",
                message: messages[0],
            };
        }
        return acc;
    }, {} as Record<string, { type: string; message: string }>);

    return { values: {}, errors };
};

type AuthMode = "login" | "signup";

// Dynamic schema based on mode
const createAuthSchema = (mode: AuthMode) =>
    z.object({
        username: mode === "signup"
            ? z.string().min(3, "Username must be at least 3 characters")
            : z.string().optional(),
        email: z.string().min(1, "Email is required").email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

type AuthFormData = z.infer<ReturnType<typeof createAuthSchema>>;

export default function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(createAuthSchema(mode)),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    // Check persistent storage on mount
    useEffect(() => {
        async function checkAuthSession() {
            try {
                const storedUser = await SecureStore.getItemAsync("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    dispatch(signupSuccess({ user: parsedUser }));

                    if (parsedUser.role === "admin") {
                        router.replace("/admin/adminui");
                    } else if (parsedUser.role === "scorer") {
                        router.replace("/scorer" as any);
                    } else {
                        router.replace("/home/Home");
                    }
                }
            } catch (err) {
                console.error("Failed to load session:", err);
            }
        }
        checkAuthSession();
    }, [dispatch, router]);

    useEffect(() => {
        reset({
            username: "",
            email: "",
            password: "",
        });
    }, [mode, reset]);

    const handleForm = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            let response: any;

            if (mode === "login") {
                response = await (dispatch as any)(
                    login({ email: data.email, password: data.password })
                );
            } else {
                response = await (dispatch as any)(signup(data));
            }

            if (response?.user) {
                // await SecureStore.setItemAsync("user", JSON.stringify(response.user));
                console.log(response.user);


                if (response.user.role === "admin") {
                    router.replace("/admin/adminui");
                } else if (response.user.role === "scorer") {
                    router.replace("/scorer" as any);
                } else {
                    router.replace("/home/leaderboard");
                }
            }
        } catch (error) {
            console.error("Auth process error:", error);
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header / Branding */}
                        <View className="mb-6 items-start">
                            <View className="flex-row items-center space-x-2 mb-6">
                                <Text className="text-3xl">🏏</Text>
                                <View className="flex-row items-baseline">
                                    <Text className="text-3xl font-black text-blue-600 tracking-tight">Cric</Text>
                                    <Text className="text-3xl font-black text-slate-900 tracking-tight">Show</Text>
                                    <View className="h-2 w-2 rounded-full bg-blue-600 ml-1" />
                                </View>
                            </View>

                            {/* Segmented Switcher */}
                            <View className="flex-row bg-slate-200/60 p-1 rounded-2xl w-52 mb-6">
                                <Pressable
                                    onPress={() => setMode("login")}
                                    className={`flex-1 py-2 rounded-xl items-center justify-center ${mode === "login" ? "bg-white shadow-sm" : ""
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-bold ${mode === "login" ? "text-slate-900" : "text-slate-500"
                                            }`}
                                    >
                                        Sign In
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => setMode("signup")}
                                    className={`flex-1 py-2 rounded-xl items-center justify-center ${mode === "signup" ? "bg-white shadow-sm" : ""
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-bold ${mode === "signup" ? "text-slate-900" : "text-slate-500"
                                            }`}
                                    >
                                        Sign Up
                                    </Text>
                                </Pressable>
                            </View>

                            <Text className="text-2xl font-bold tracking-tight text-slate-900">
                                {mode === "login" ? "Welcome back" : "Get your stadium pass"}
                            </Text>
                            <Text className="text-sm text-slate-500 mt-1">
                                {mode === "login"
                                    ? "Live Scores • Every Match • Every Moment"
                                    : "Create an account to save favorite teams & stats."}
                            </Text>
                        </View>

                        {/* Input Form Card */}
                        <View className="bg-white rounded-3xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
                            {/* Username Input (Sign Up only) */}
                            {mode === "signup" && (
                                <View className="border-b border-slate-100 p-4">
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Username
                                    </Text>
                                    <Controller
                                        control={control}
                                        name="username"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                placeholder="johndoe"
                                                placeholderTextColor="#94a3b8"
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                className="text-slate-900 text-base font-medium h-7 p-0"
                                            />
                                        )}
                                    />
                                    {errors.username && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.username.message}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Email Input */}
                            <View className="border-b border-slate-100 p-4">
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Email Address
                                </Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="name@example.com"
                                            placeholderTextColor="#94a3b8"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            className="text-slate-900 text-base font-medium h-7 p-0"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="p-4">
                                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Password
                                </Text>
                                <View className="flex-row items-center justify-between">
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                placeholder="••••••••"
                                                placeholderTextColor="#94a3b8"
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                className="flex-1 text-slate-900 text-base font-medium h-7 p-0"
                                            />
                                        )}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword((prev) => !prev)}
                                        activeOpacity={0.7}
                                        className="p-1"
                                    >
                                        {showPassword ? (
                                            <Eye color="#64748b" size={20} />
                                        ) : (
                                            <EyeOff color="#64748b" size={20} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {errors.password && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.password.message}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Forgot Password Link */}
                        {mode === "login" && (
                            <Pressable className="self-end mb-5">
                                <Text className="text-xs font-semibold text-slate-500 active:text-blue-600">
                                    Forgot password?
                                </Text>
                            </Pressable>
                        )}

                        {/* Submit Button */}
                        <Pressable
                            onPress={handleSubmit(handleForm)}
                            disabled={isLoading}
                            className={`bg-blue-600 h-14 rounded-2xl items-center justify-center mb-5 shadow-sm ${isLoading ? "opacity-70" : "active:bg-blue-700"
                                }`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text className="text-white font-bold text-sm tracking-wide">
                                    {mode === "login" ? "Continue" : "Create Account"}
                                </Text>
                            )}
                        </Pressable>

                        {/* Divider */}
                        <View className="flex-row items-center mb-5">
                            <View className="flex-1 h-[1px] bg-slate-200" />
                            <Text className="text-[10px] font-bold text-slate-400 mx-3 uppercase tracking-widest">
                                or
                            </Text>
                            <View className="flex-1 h-[1px] bg-slate-200" />
                        </View>

                        {/* Google Social Button */}
                        <Pressable
                            className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center border border-slate-200 active:bg-slate-50 shadow-sm"
                        >
                            <View className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center">
                                <GoogleIcon width={18} height={18} />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-slate-900">
                                    {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
                                </Text>
                            </View>
                        </Pressable>

                        {/* Disclaimers */}
                        <Text className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
                            By continuing, you agree to CricShow&apos;s{" "}
                            <Text className="underline font-medium text-slate-600">Terms of Service</Text> &{" "}
                            <Text className="underline font-medium text-slate-600">Privacy Policy</Text>.
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}