import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
    Play,
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    User,
    ChevronRight,
    LogOut
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - replace with your actual API state/Redux store values
const MOCK_ACTIVE_MATCH = {
    id: "m-101",
    tournament: "City Premier League 2026",
    teamA: "Royal Strikers",
    teamB: "Thunder Knights",
    scoreA: "142/4 (16.2 ov)",
    scoreB: "Yet to Bat",
    venue: "Central Cricket Ground",
    status: "In Progress",
};

const MOCK_UPCOMING_MATCHES = [
    {
        id: "m-102",
        tournament: "District Cup - Quarter Finals",
        teamA: "Apex Warriors",
        teamB: "Falcon XI",
        time: "Tomorrow, 02:30 PM",
        venue: "St. Xavier's Oval",
    },
    {
        id: "m-103",
        tournament: "City Premier League 2026",
        teamA: "Rising Stars",
        teamB: "Metro Kings",
        time: "Jul 26, 10:00 AM",
        venue: "Green Park Arena",
    },
];

export default function ScorerDashboard() {
    const [activeMatch, setActiveMatch] = useState(MOCK_ACTIVE_MATCH);

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View className="flex-row items-center justify-between my-2">
                    <View className="flex-row items-center space-x-3">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center border border-blue-200">
                            <User size={24} color="#2563eb" />
                        </View>
                        <View>
                            <Text className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Official Scorer
                            </Text>
                            <Text className="text-xl font-bold text-slate-900">
                                Welcome Back! 👋
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity className="p-2.5 bg-red-50 rounded-full border border-red-100">
                        <LogOut size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Grid */}
                <View className="flex-row space-x-3 my-4">
                    <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <View className="w-8 h-8 bg-amber-100 rounded-lg items-center justify-center mb-2">
                            <Play size={16} color="#d97706" />
                        </View>
                        <Text className="text-2xl font-black text-slate-800">1</Text>
                        <Text className="text-xs font-semibold text-slate-500">Live Match</Text>
                    </View>

                    <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mb-2">
                            <Calendar size={16} color="#2563eb" />
                        </View>
                        <Text className="text-2xl font-black text-slate-800">2</Text>
                        <Text className="text-xs font-semibold text-slate-500">Assigned</Text>
                    </View>

                    <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                        <View className="w-8 h-8 bg-emerald-100 rounded-lg items-center justify-center mb-2">
                            <CheckCircle2 size={16} color="#059669" />
                        </View>
                        <Text className="text-2xl font-black text-slate-800">14</Text>
                        <Text className="text-xs font-semibold text-slate-500">Completed</Text>
                    </View>
                </View>

                {/* Live / Active Match Card */}
                <View className="my-2">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-lg font-bold text-slate-900">Active Match</Text>
                        <View className="flex-row items-center bg-red-100 px-2.5 py-1 rounded-full border border-red-200">
                            <View className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                            <Text className="text-xs font-bold text-red-700 uppercase">Live</Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <View className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-3">
                            <Text className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                                {activeMatch.tournament}
                            </Text>
                            <View className="flex-row items-center">
                                <MapPin size={12} color="#64748b" className="mr-1" />
                                <Text className="text-xs text-slate-500 font-medium">
                                    {activeMatch.venue}
                                </Text>
                            </View>
                        </View>

                        {/* Teams & Score Display */}
                        <View className="space-y-3">
                            <View className="flex-row justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <Text className="text-base font-bold text-slate-800">
                                    {activeMatch.teamA}
                                </Text>
                                <Text className="text-base font-black text-blue-600">
                                    {activeMatch.scoreA}
                                </Text>
                            </View>

                            <View className="flex-row justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <Text className="text-base font-bold text-slate-800">
                                    {activeMatch.teamB}
                                </Text>
                                <Text className="text-sm font-semibold text-slate-400">
                                    {activeMatch.scoreB}
                                </Text>
                            </View>
                        </View>

                        {/* Resume / Open Console Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="mt-4 bg-blue-600 py-3.5 px-4 rounded-xl flex-row items-center justify-center space-x-2 shadow-sm shadow-blue-500/30"
                            onPress={() => {
                                // Navigate to scoring screen/console here
                                console.log("Open Scoring Console for:", activeMatch.id);
                            }}
                        >
                            <Play size={18} color="#ffffff" fill="#ffffff" />
                            <Text className="text-white font-bold text-base">
                                Open Scoring Console
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Upcoming Assigned Matches */}
                <View className="mt-5 mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-slate-900">
                            Upcoming Assignments
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-xs font-semibold text-blue-600">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-3">
                        {MOCK_UPCOMING_MATCHES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.7}
                                className="bg-white p-4 rounded-2xl border border-slate-200/80 flex-row items-center justify-between"
                            >
                                <View className="flex-1 pr-2">
                                    <Text className="text-xs font-bold text-blue-600 mb-1">
                                        {item.tournament}
                                    </Text>
                                    <Text className="text-sm font-bold text-slate-800">
                                        {item.teamA} vs {item.teamB}
                                    </Text>

                                    <View className="flex-row items-center mt-2 space-x-3">
                                        <View className="flex-row items-center">
                                            <Clock size={12} color="#64748b" className="mr-1" />
                                            <Text className="text-xs text-slate-500 font-medium">
                                                {item.time}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <MapPin size={12} color="#64748b" className="mr-1" />
                                            <Text className="text-xs text-slate-500 font-medium" numberOfLines={1}>
                                                {item.venue}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <ChevronRight size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}