import { useState, useEffect } from "react";
import { GoogleIcon } from "@/icons/GoogleIcons";
import { Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { login, signup } from "../../services/api/auth";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Eye, EyeClosed } from "lucide-react-native";

const zodResolver = <T extends z.ZodTypeAny>(schema: T) => async (values: unknown) => {
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

// Form schemas defined using Zod
const authSchema = z.object({
    username: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
}).superRefine((data, ctx) => {
    // Custom check: Require username if signing up
    if (!data.username && ctx.path.includes("username")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Username is required for registration",
        });
    }
});

type AuthFormData = z.infer<typeof authSchema>;


function Auth() {
    const [showeye, setEye] = useState(false);
    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    // Clear validation states and input text when switching between modes
    useEffect(() => {
        reset({
            username: "",
            email: "",
            password: "",
        });
    }, [mode, reset]);

    const dispatch = useDispatch();
    const router = useRouter();
    const handleForm = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            if (mode === "login") {
                console.log("Attempting Login with:", { email: data.email, password: data.password });
                await login({ email: data.email, password: data.password })(dispatch);

            } else {
                console.log("Attempting Signup with:", data);
                await signup(data)(dispatch);
            }
            router.replace('/components/admin/adminui')
        } catch (error) {
            console.error("Auth process encountered an error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-zinc-50">
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerClassName="px-6 justify-center flex-grow py-6"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Brand & Header Section */}
                        <View className="mb-8 items-start mt-4">
                            <View className="flex-row items-center space-x-2 mb-6">
                                <Text className="text-4xl">🏏</Text>
                                <View className="flex-row items-baseline">
                                    <Text className="text-3xl font-black text-orange-600 tracking-tight">Cric</Text>
                                    <Text className="text-3xl font-black text-zinc-900 tracking-tight">Show</Text>
                                    <View className="h-1.5 w-1.5 rounded-full bg-orange-500 ml-0.5" />
                                </View>
                            </View>

                            {/* Segmented Switcher */}
                            <View className="flex-row bg-zinc-200/50 p-1 rounded-2xl w-48 mb-8 border border-zinc-200/20">
                                <Pressable
                                    onPress={() => setMode("login")}
                                    className={`flex-1 py-2 rounded-xl items-center justify-center ${mode === "login" ? "bg-white" : ""}`}
                                >
                                    <Text className={`text-sm font-semibold tracking-tight ${mode === "login" ? "text-zinc-900" : "text-zinc-400"}`}>
                                        Sign In
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setMode("signup")}
                                    className={`flex-1 py-2 rounded-xl items-center justify-center ${mode === "signup" ? "bg-white" : ""}`}
                                >
                                    <Text className={`text-sm font-semibold tracking-tight ${mode === "signup" ? "text-zinc-900" : "text-zinc-400"}`}>
                                        Join
                                    </Text>
                                </Pressable>
                            </View>

                            <Text className="text-2xl font-bold tracking-tight text-zinc-900">
                                {mode === "login" ? "Welcome back" : "Get your stadium pass"}
                            </Text>
                            <Text className="text-sm text-zinc-400 mt-1 font-normal">
                                {mode === "login" ? "Live Scores • Every Match • Every Moment" : "Create a premium account to track your teams."}
                            </Text>
                        </View>

                        {/* Custom Monolithic Card Structure containing Controller Wrapped Inputs */}
                        <View className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden mb-5">
                            {mode === "signup" && (
                                <View className="border-b border-zinc-100 p-4 bg-zinc-50/5">
                                    <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Username</Text>
                                    <Controller
                                        control={control}
                                        name="username"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                placeholder="username"
                                                placeholderTextColor="#a1a1aa"
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                className="text-zinc-900 text-base p-0 font-medium tracking-wide h-6"
                                            />
                                        )}
                                    />
                                    {errors.username && <Text className="text-red-500 text-xs mt-1">{errors.username.message}</Text>}
                                </View>
                            )}

                            <View className="border-b border-zinc-100 p-4 bg-zinc-50/5">
                                <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email address</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            placeholder="name@example.com"
                                            placeholderTextColor="#a1a1aa"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            className="text-zinc-900 text-base p-0 font-medium tracking-wide h-6"
                                        />
                                    )}
                                />
                                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
                            </View>
                            <View className="p-4 bg-zinc-50/5">
                                <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                    Password
                                </Text>

                                <View className="flex-row items-center justify-between">
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                placeholder="••••••••"
                                                placeholderTextColor="#a1a1aa"
                                                secureTextEntry={!showeye}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                className="flex-1 text-zinc-900 text-base p-0 font-medium tracking-wide h-6"
                                            />
                                        )}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setEye((prev) => !prev)}
                                        activeOpacity={0.7}
                                        className="p-1"
                                    >
                                        {showeye ? (
                                            <Eye color="#a1a1aa" size={20} />
                                        ) : (
                                            <EyeClosed color="#a1a1aa" size={20} />
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
                            <Pressable className="self-end mb-6 mr-1">
                                <Text className="text-xs font-semibold text-zinc-400 active:text-zinc-900">
                                    Forgot password?
                                </Text>
                            </Pressable>
                        )}

                        {/* Primary Action Button */}
                        <Pressable
                            onPress={handleSubmit(handleForm)}
                            disabled={isLoading}
                            className={`bg-zinc-900 h-14 rounded-2xl items-center justify-center mb-5 ${isLoading ? "opacity-70" : "active:opacity-90"}`}
                            android_ripple={{ color: "#3f3f46" }}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text className="text-white font-semibold text-sm tracking-wide">
                                    {mode === "login" ? "Continue" : "Create Account"}
                                </Text>
                            )}
                        </Pressable>

                        {/* Architectural Divider */}
                        <View className="flex-row items-center mb-5">
                            <View className="flex-1 h-[0.5px] bg-zinc-200" />
                            <Text className="text-[10px] font-bold text-zinc-300 mx-4 uppercase tracking-widest">or</Text>
                            <View className="flex-1 h-[0.5px] bg-zinc-200" />
                        </View>

                        {/* Premium Google Option */}
                        <Pressable
                            className="bg-white rounded-2xl px-5 py-4 flex-row items-center border border-zinc-200 active:bg-zinc-50"
                            android_ripple={{ color: "#f4f4f5" }}
                        >
                            <View className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 items-center justify-center">
                                <GoogleIcon width={18} height={18} />
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-sm font-semibold text-zinc-900 tracking-tight">
                                    {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
                                </Text>
                                <Text className="text-[11px] text-zinc-400 mt-0.5">
                                    Secure one-click instant access
                                </Text>
                            </View>
                        </Pressable>

                        {/* Tail Disclaimers */}
                        <Text className="text-center text-[11px] text-zinc-400 mt-8 leading-relaxed px-4">
                            By continuing, you accept our premium terms. {"\n"}
                            <Text className="underline font-medium text-zinc-500">Terms of Use</Text> & <Text className="underline font-medium text-zinc-500">Privacy Policy</Text>.
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

export default Auth;