import { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
    Play,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    User,
    ChevronRight,
    LogOut,
    X,
    RefreshCw,
} from "lucide-react-native";
import { get_scrorer_match } from "@/services/api/match";
import Scorer from "@/components/scorer";
import { logout } from "@/services/api/auth";
import { router } from "expo-router";

// ------------------ Constants ------------------
const COLORS = {
    primary: "#2563eb",
    primaryLight: "#dbeafe",
    success: "#059669",
    successLight: "#d1fae5",
    warning: "#d97706",
    warningLight: "#fef3c7",
    danger: "#ef4444",
    dangerLight: "#fee2e2",
    slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
    },
};

// ------------------ Helper Functions ------------------
const formatMatchTime = (dateTime: any) => {
    if (!dateTime) return "TBD";
    const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "TBD";
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

// Format score object (e.g., { runs: 142, wickets: 4, overs: 16.2 })
const formatScore = (scoreObj: any) => {
    if (!scoreObj || typeof scoreObj !== "object") return "–";
    const runs = scoreObj.runs ?? scoreObj.Runs ?? "–";
    const wickets = scoreObj.wickets ?? scoreObj.Wickets ?? "–";
    const overs = scoreObj.overs ?? scoreObj.Overs ?? "–";
    const oversStr = overs !== "–" ? ` (${overs} ov)` : "";
    return `${runs}/${wickets}${oversStr}`;
};

// Get team display name from populated team object or fallback
const getTeamDisplayName = (team: any) => {
    if (!team) return "Unknown Team";
    return team.teamName || team.shortName || `Team ${team._id?.slice(-4) || ""}`;
};

// ------------------ Main Component ------------------
export default function ScorerDashboard() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showScorerModal, setShowScorerModal] = useState(false);

    // Active match: status "In Progress" or "Live"
    const activeMatch = matches.find(
        (m) => m.status === "In Progress" || m.status === "Live"
    );
    const upcomingMatches = matches.filter((m) => m.status === "Upcoming");
    const completedMatches = matches.filter((m) => m.status === "Completed");

    // Fetch matches from API
    const fetchMatches = useCallback(async () => {
        try {
            setError(null);
            if (user && typeof user === "object" && "_id" in user) {
                const res = await get_scrorer_match((user as any)._id);
                if (Array.isArray(res?.matches)) {
                    setMatches(res.matches);
                } else {
                    setMatches([]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch matches:", err);
            setError("Unable to load your matches.");
            setMatches([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMatches();
        setRefreshing(false);
    }, [fetchMatches]);

    // Stats
    const stats = {
        live: activeMatch ? 1 : 0,
        assigned: upcomingMatches.length,
        completed: completedMatches.length,
    };

    // User initials
    const getUserInitials = () => user?.username?.charAt(0).toUpperCase() || "U";
    const dispatch = useDispatch();
    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1 px-4 pt-2"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View className="flex-row items-center justify-between mt-2 mb-4">
                    <View className="flex-row items-center space-x-3">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center border-2 border-blue-200">
                            <Text className="text-blue-700 font-bold text-lg">
                                {getUserInitials()}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Scorer
                            </Text>
                            <Text className="text-xl font-bold text-slate-900">
                                Welcome back, {user?.username || "Scorer"} 👋
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => { logout()(dispatch); router.replace('/login') }}
                        className="p-2.5 bg-red-50 rounded-full border border-red-200 active:opacity-70"
                        accessible
                        accessibilityLabel="Logout"
                    >
                        <LogOut size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View className="flex-row space-x-3 mb-5">
                    <StatCard
                        icon={<Play size={16} color={COLORS.warning} />}
                        value={stats.live}
                        label="Live Match"
                        bgColor={COLORS.warningLight}
                    />
                    <StatCard
                        icon={<Calendar size={16} color={COLORS.primary} />}
                        value={stats.assigned}
                        label="Assigned"
                        bgColor={COLORS.primaryLight}
                    />
                    <StatCard
                        icon={<CheckCircle2 size={16} color={COLORS.success} />}
                        value={stats.completed}
                        label="Completed"
                        bgColor={COLORS.successLight}
                    />
                </View>

                {/* Active Match Section */}
                <View className="mb-5">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-lg font-bold text-slate-900">
                            Active Match
                        </Text>
                        {activeMatch && (
                            <View className="flex-row items-center bg-red-100 px-3 py-1 rounded-full border border-red-200">
                                <View className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                                <Text className="text-xs font-bold text-red-700 uppercase">
                                    Live
                                </Text>
                            </View>
                        )}
                    </View>

                    {loading ? (
                        <MatchSkeleton />
                    ) : error ? (
                        <ErrorCard message={error} onRetry={fetchMatches} />
                    ) : activeMatch ? (
                        <ActiveMatchCard
                            match={activeMatch}
                            onPressScorer={() => setShowScorerModal(true)}
                        />
                    ) : (
                        <EmptyMatchCard />
                    )}
                </View>

                {/* Upcoming Assignments */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-slate-900">
                            Upcoming Assignments
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-xs font-semibold text-blue-600">
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {upcomingMatches.length === 0 ? (
                        <Text className="text-slate-400 text-center py-6">
                            No upcoming matches.
                        </Text>
                    ) : (
                        <View className="space-y-3">
                            {upcomingMatches.map((item) => (
                                <UpcomingMatchCard key={item._id} match={item} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* ✅ Scorer Modal – pass the full activeMatch object */}
            <Modal
                visible={showScorerModal}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row justify-between items-center px-4 py-3 border-b border-slate-200">
                        <Text className="text-lg font-bold text-slate-900">
                            Scoring Console
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowScorerModal(false)}
                            className="p-2 bg-slate-100 rounded-full active:opacity-70"
                            accessible
                            accessibilityLabel="Close scorer"
                        >
                            <X size={22} color={COLORS.slate[700]} />
                        </TouchableOpacity>
                    </View>
                    {/* Pass the entire match object */}
                    <Scorer match={activeMatch} />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

// ------------------ Sub‑components (unchanged) ------------------
const StatCard = ({ icon, value, label, bgColor }: any) => (
    <TouchableOpacity
        activeOpacity={0.7}
        className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm"
        style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
        }}
    >
        <View
            className="w-8 h-8 rounded-lg items-center justify-center mb-1.5"
            style={{ backgroundColor: bgColor }}
        >
            {icon}
        </View>
        <Text className="text-2xl font-black text-slate-800">{value}</Text>
        <Text className="text-xs font-semibold text-slate-500">{label}</Text>
    </TouchableOpacity>
);

const ActiveMatchCard = ({ match, onPressScorer }: any) => {
    const team1Name = getTeamDisplayName(match.team1);
    const team2Name = getTeamDisplayName(match.team2);

    const team1Score = match.score?.team1Score
        ? formatScore(match.score.team1Score)
        : "–";
    const team2Score = match.score?.team2Score
        ? formatScore(match.score.team2Score)
        : "–";

    const tournament = "Match";

    return (
        <View className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
            <View className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <Text className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {tournament}
                </Text>
                <View className="flex-row items-center">
                    <MapPin size={12} color={COLORS.slate[400]} />
                    <Text className="text-xs text-slate-500 font-medium ml-1">
                        {match.venue || "TBD"}
                    </Text>
                </View>
            </View>

            <View className="space-y-2.5">
                <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Text className="text-base font-bold text-slate-800">
                        {team1Name}
                    </Text>
                    <Text className="text-base font-black text-blue-600">
                        {team1Score}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Text className="text-base font-bold text-slate-800">
                        {team2Name}
                    </Text>
                    <Text className="text-base font-black text-blue-600">
                        {team2Score}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                className="mt-4 bg-blue-600 py-3.5 px-4 rounded-xl flex-row items-center justify-center space-x-2"
                style={{
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                }}
                onPress={onPressScorer}
            >
                <Play size={18} color="#fff" fill="#fff" />
                <Text className="text-white font-bold text-base">
                    Open Scoring Console
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const UpcomingMatchCard = ({ match }: any) => {
    const team1Name = getTeamDisplayName(match.team1);
    const team2Name = getTeamDisplayName(match.team2);
    const time = formatMatchTime(match.dateTime);
    const venue = match.venue || "TBD";
    const tournament = "Match";

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 flex-row items-center justify-between shadow-sm"
        >
            <View className="flex-1 pr-2">
                <Text className="text-xs font-bold text-blue-600 mb-1">
                    {tournament}
                </Text>
                <Text className="text-sm font-bold text-slate-800">
                    {team1Name} vs {team2Name}
                </Text>
                <View className="flex-row items-center mt-2 space-x-3">
                    <View className="flex-row items-center">
                        <Clock size={12} color={COLORS.slate[400]} />
                        <Text className="text-xs text-slate-500 font-medium ml-1">
                            {time}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <MapPin size={12} color={COLORS.slate[400]} />
                        <Text
                            className="text-xs text-slate-500 font-medium ml-1"
                            numberOfLines={1}
                        >
                            {venue}
                        </Text>
                    </View>
                </View>
            </View>
            <ChevronRight size={20} color={COLORS.slate[400]} />
        </TouchableOpacity>
    );
};

// Skeleton
const MatchSkeleton = () => (
    <View className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <View className="flex-row justify-between mb-3">
            <View className="w-32 h-4 bg-slate-200 rounded" />
            <View className="w-20 h-4 bg-slate-200 rounded" />
        </View>
        <View className="space-y-2.5">
            <View className="h-12 bg-slate-100 rounded-xl" />
            <View className="h-12 bg-slate-100 rounded-xl" />
        </View>
        <View className="mt-4 h-12 bg-slate-200 rounded-xl" />
    </View>
);

// Error
const ErrorCard = ({ message, onRetry }: any) => (
    <View className="bg-red-50 rounded-2xl border border-red-200 p-4 items-center">
        <Text className="text-red-600 text-center font-medium">{message}</Text>
        <TouchableOpacity
            onPress={onRetry}
            className="mt-2 flex-row items-center bg-red-100 px-4 py-2 rounded-full"
        >
            <RefreshCw size={14} color={COLORS.danger} />
            <Text className="text-red-700 font-semibold ml-2">Retry</Text>
        </TouchableOpacity>
    </View>
);

// Empty
const EmptyMatchCard = () => (
    <View className="bg-white rounded-2xl border border-slate-200/90 p-6 items-center">
        <Text className="text-slate-400 text-center">No active match assigned.</Text>
        <Text className="text-slate-400 text-sm mt-1">
            Check back later or refresh.
        </Text>
    </View>
);