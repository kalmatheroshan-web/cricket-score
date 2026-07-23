import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { io, Socket } from "socket.io-client";
import {
    ArrowLeft,
    Flame,
    MapPin,
    RefreshCw,
    Trophy,
    WifiOff,
} from "lucide-react-native";

// --- Socket Endpoint (Replace with your backend URL)
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;
console.log(SOCKET_URL);

// --- Types ---
interface BatterStats {
    id: string;
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isStriker: boolean;
}

interface BowlerStats {
    id: string;
    name: string;
    overs: number;
    maidens: number;
    runsConceded: number;
    wickets: number;
}

interface BallEvent {
    id: string;
    ballNumber: string; // e.g., "14.2"
    result: string;     // e.g., "4", "6", "W", "1", "0", "Nb"
    commentary: string;
    timestamp: string;
}

interface LiveMatchData {
    matchId: string;
    status: "Live" | "Completed" | "Upcoming";
    venue: string;
    target?: number;
    currentInnings: number;
    team1: { name: string; shortName: string; runs: number; wickets: number; overs: number };
    team2: { name: string; shortName: string; runs: number; wickets: number; overs: number };
    battingTeam: "team1" | "team2";
    currentBatters: BatterStats[];
    currentBowler: BowlerStats;
    recentBalls: string[]; // e.g., ["1", "4", "W", "0", "6", "1"]
    commentary: BallEvent[];
}

export default function MatchDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [matchData, setMatchData] = useState<LiveMatchData | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"live" | "scorecard" | "info">("live");

    useEffect(() => {
        if (!id) return;

        // 1. Initialize Socket Connection
        const socket: Socket = io(SOCKET_URL, {
            transports: ["websocket"],
            query: { matchId: id },
        });

        socket.on("connect", () => {
            console.log(socket.id, 'match socket');

            setIsConnected(true);
            socket.emit("join_match", id);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("match_init", (data: LiveMatchData) => {
            setMatchData(data);
        });

        socket.on("score_update", (updatedData: LiveMatchData) => {
            setMatchData(updatedData);
        });

        return () => {
            socket.emit("leave_match", id);
            socket.disconnect();
        };
    }, [id]);

    if (!matchData) {
        return (
            <SafeAreaView className="flex-1 bg-amber-50/30 justify-center items-center">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-slate-500 font-semibold text-xs tracking-wider mt-3">
                    CONNECTING TO LIVE SCORE...
                </Text>
            </SafeAreaView>
        );
    }

    const batting = matchData[matchData.battingTeam];
    const bowling = matchData[matchData.battingTeam === "team1" ? "team2" : "team1"];
    const runRate = batting.overs > 0 ? (batting.runs / batting.overs).toFixed(2) : "0.00";

    return (
        <SafeAreaView className="flex-1 bg-amber-50/20">
            {/* Top Navigation Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-orange-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-9 h-9 rounded-full bg-orange-50 items-center justify-center border border-orange-100"
                >
                    <ArrowLeft size={18} color="#ea580c" />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-xs font-black uppercase text-slate-800 tracking-wider">
                        {matchData.team1.shortName} vs {matchData.team2.shortName}
                    </Text>
                    <View className="flex-row items-center space-x-1 mt-0.5">
                        <MapPin size={10} color="#94a3b8" />
                        <Text className="text-[10px] font-semibold text-slate-400">
                            {matchData.venue}
                        </Text>
                    </View>
                </View>

                {/* Live Indicator / Connection Badge */}
                <View className="flex-row items-center">
                    {isConnected ? (
                        <View className="flex-row items-center bg-orange-500 px-2.5 py-1 rounded-full space-x-1">
                            <Flame size={12} color="#ffffff" />
                            <Text className="text-[10px] font-black text-white uppercase tracking-wider">
                                LIVE
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center bg-slate-100 px-2 py-1 rounded-full">
                            <WifiOff size={11} color="#64748b" />
                            <Text className="text-[10px] font-bold text-slate-500 ml-1">
                                RECONNECTING
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Main Scorecard Header Hero */}
                <View className="bg-white mx-4 mt-4 p-5 rounded-3xl border border-orange-100 shadow-sm">
                    {/* Status Bar */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-[11px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                            Innings {matchData.currentInnings}
                        </Text>
                        {matchData.target && (
                            <Text className="text-xs font-bold text-slate-500">
                                Target: <Text className="text-slate-900 font-black">{matchData.target}</Text>
                            </Text>
                        )}
                    </View>

                    {/* Teams Display */}
                    <View className="flex-row justify-between items-center py-2">
                        {/* Batting Team Primary */}
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
                                Batting
                            </Text>
                            <Text className="text-2xl font-black text-slate-900 tracking-tight">
                                {batting.shortName}
                            </Text>
                            <View className="flex-row items-baseline mt-1 space-x-1">
                                <Text className="text-3xl font-black text-orange-600 tracking-tight">
                                    {batting.runs}/{batting.wickets}
                                </Text>
                                <Text className="text-sm font-bold text-slate-500">
                                    ({batting.overs} ov)
                                </Text>
                            </View>
                        </View>

                        <View className="h-12 w-[1px] bg-orange-100 mx-3" />

                        {/* Bowling Team Secondary */}
                        <View className="items-end">
                            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Bowling
                            </Text>
                            <Text className="text-lg font-extrabold text-slate-700">
                                {bowling.shortName}
                            </Text>
                            <Text className="text-sm font-bold text-slate-500 mt-1">
                                {bowling.runs}/{bowling.wickets} ({bowling.overs} ov)
                            </Text>
                        </View>
                    </View>

                    {/* Run Rate & Over Breakdown Strip */}
                    <View className="mt-4 pt-3 border-t border-slate-100 flex-row justify-between items-center">
                        <Text className="text-xs font-bold text-slate-500">
                            CRR: <Text className="text-slate-900 font-black">{runRate}</Text>
                        </Text>

                        {/* Recent Balls Strip */}
                        <View className="flex-row items-center space-x-1.5">
                            <Text className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                                This Over:
                            </Text>
                            {matchData.recentBalls?.map((ball, idx) => {
                                const isWicket = ball === "W";
                                const isBoundary = ball === "4" || ball === "6";
                                return (
                                    <View
                                        key={idx}
                                        className={`w-6 h-6 rounded-full items-center justify-center border ${isWicket
                                            ? "bg-red-500 border-red-600"
                                            : isBoundary
                                                ? "bg-orange-500 border-orange-600"
                                                : "bg-slate-100 border-slate-200"
                                            }`}
                                    >
                                        <Text
                                            className={`text-[10px] font-black ${isWicket || isBoundary ? "text-white" : "text-slate-700"
                                                }`}
                                        >
                                            {ball}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View className="flex-row mx-4 bg-slate-200/60 p-1 rounded-2xl mt-4">
                    {(["live", "scorecard", "info"] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-xl items-center ${activeTab === tab ? "bg-white shadow-xs" : ""
                                }`}
                        >
                            <Text
                                className={`text-xs font-bold capitalize ${activeTab === tab ? "text-orange-600" : "text-slate-500"
                                    }`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Live Tab View: Active Players & Ball-By-Ball Commentary */}
                {activeTab === "live" && (
                    <View className="mx-4 mt-4 space-y-4">
                        {/* Active Batters & Bowler Table */}
                        <View className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm">
                            <Text className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                                Current On Pitch
                            </Text>

                            {/* Batters */}
                            <View className="space-y-2">
                                <View className="flex-row justify-between pb-1 border-b border-slate-100">
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase flex-2">Batter</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">R</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">B</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">4s</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">6s</Text>
                                </View>

                                {matchData.currentBatters?.map((batter) => (
                                    <View key={batter.id} className="flex-row justify-between items-center py-1">
                                        <View className="flex-row items-center flex-2">
                                            <Text className="text-xs font-bold text-slate-900">
                                                {batter.name}
                                            </Text>
                                            {batter.isStriker && (
                                                <Text className="text-orange-600 font-black ml-1 text-xs">*</Text>
                                            )}
                                        </View>
                                        <Text className="text-xs font-black text-slate-900 w-8 text-center">{batter.runs}</Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">{batter.balls}</Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">{batter.fours}</Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">{batter.sixes}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Bowler */}
                            <View className="mt-4 pt-3 border-t border-slate-100">
                                <View className="flex-row justify-between pb-1 border-b border-slate-100">
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase flex-2">Bowler</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">O</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">M</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">R</Text>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase w-8 text-center">W</Text>
                                </View>

                                {matchData.currentBowler && (
                                    <View className="flex-row justify-between items-center py-1">
                                        <Text className="text-xs font-bold text-slate-900 flex-2">
                                            {matchData.currentBowler.name}
                                        </Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">
                                            {matchData.currentBowler.overs}
                                        </Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">
                                            {matchData.currentBowler.maidens}
                                        </Text>
                                        <Text className="text-xs font-medium text-slate-500 w-8 text-center">
                                            {matchData.currentBowler.runsConceded}
                                        </Text>
                                        <Text className="text-xs font-black text-orange-600 w-8 text-center">
                                            {matchData.currentBowler.wickets}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Ball-by-Ball Live Commentary Stream */}
                        <View className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm mb-6">
                            <Text className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                                Live Commentary
                            </Text>

                            {matchData.commentary?.map((item) => (
                                <View
                                    key={item.id}
                                    className="flex-row py-2.5 border-b border-slate-100 space-x-3 items-start"
                                >
                                    <View className="w-10 h-7 rounded-lg bg-orange-50 border border-orange-200 items-center justify-center">
                                        <Text className="text-xs font-black text-orange-600">
                                            {item.ballNumber}
                                        </Text>
                                    </View>

                                    <View className="flex-1">
                                        <Text className="text-xs font-medium text-slate-800 leading-snug">
                                            {item.commentary}
                                        </Text>
                                    </View>

                                    <View
                                        className={`px-2 py-0.5 rounded-md ${item.result === "W"
                                            ? "bg-red-500"
                                            : item.result === "4" || item.result === "6"
                                                ? "bg-orange-500"
                                                : "bg-slate-100"
                                            }`}
                                    >
                                        <Text
                                            className={`text-xs font-black ${item.result === "W" || item.result === "4" || item.result === "6"
                                                ? "text-white"
                                                : "text-slate-700"
                                                }`}
                                        >
                                            {item.result}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}