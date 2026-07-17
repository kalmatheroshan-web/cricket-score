import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MatchDetails = () => {
    const [activeTab, setActiveTab] = useState<"IND" | "AUS">("IND");

    const liveMatch = {
        series: "ICC World Test Championship • Final",
        venue: "The Oval, London",
        status: "LIVE",
        overs: "42.1 overs",
        target: "Target: 342",
        teams: {
            team1: { name: "India", code: "IND", score: "245/3", current: true },
            team2: { name: "Australia", code: "AUS", score: "311 & 180", current: false }
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-[#0a0a0a]"
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* 1. Header Metadata */}
            <View className="mb-4">
                <Text className="text-neutral-400 text-xs font-bold uppercase tracking-widest">{liveMatch.series}</Text>
                <Text className="text-neutral-500 text-xs mt-0.5">{liveMatch.venue}</Text>
            </View>

            {/* 2. Main Premium Scorecard Card */}
            <View className="bg-neutral-900/60 border border-neutral-800/80 rounded-[28px] p-5 mb-6 overflow-hidden shadow-xl">
                {/* Glowing Background Accent Effect */}
                <View className="absolute -top-24 -right-24 w-48 h-48 bg-[#f5c542]/5 rounded-full blur-3xl" />

                <View className="flex-row justify-between items-center mb-5">
                    <View className="flex-row items-center bg-[#ef4444]/10 border border-[#ef4444]/20 px-2.5 py-1 rounded-full space-x-1.5">
                        <View className="w-2 h-2 bg-[#ef4444] rounded-full animate-pulse" />
                        <Text className="text-[#ef4444] text-[10px] font-black tracking-wider uppercase">{liveMatch.status}</Text>
                    </View>
                    <Text className="text-neutral-400 text-xs font-semibold">{liveMatch.overs}</Text>
                </View>

                {/* Team Scores Display */}
                <View className="space-y-4">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center space-x-3">
                            <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center border border-blue-500/30">
                                <Text className="text-white font-bold text-xs">🇮🇳</Text>
                            </View>
                            <Text className="text-white text-lg font-bold tracking-tight">{liveMatch.teams.team1.name}</Text>
                        </View>
                        <View className="flex-row items-baseline space-x-1">
                            <Text className="text-white text-2xl font-black">{liveMatch.teams.team1.score}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center opacity-60">
                        <View className="flex-row items-center space-x-3">
                            <View className="w-8 h-8 rounded-full bg-yellow-600 items-center justify-center border border-yellow-500/30">
                                <Text className="text-white font-bold text-xs">🇦🇺</Text>
                            </View>
                            <Text className="text-neutral-300 text-base font-medium">{liveMatch.teams.team2.name}</Text>
                        </View>
                        <Text className="text-neutral-300 text-lg font-bold">{liveMatch.teams.team2.score}</Text>
                    </View>
                </View>

                <View className="h-[1px] bg-neutral-800/60 my-4" />
                <Text className="text-[#f5c542] text-xs font-semibold tracking-wide text-center">
                    🇮🇳 India needs 97 runs to win from 28.5 overs
                </Text>
            </View>

            {/* 3. Innings Tab Switcher */}
            <View className="flex-row bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-900 mb-6">
                {(["IND", "AUS"] as const).map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl items-center justify-center ${activeTab === tab ? "bg-neutral-800 border border-neutral-700/50" : ""
                            }`}
                    >
                        <Text className={`text-sm font-bold tracking-wide ${activeTab === tab ? "text-white" : "text-neutral-500"}`}>
                            {tab === "IND" ? "India Innings" : "Australia Innings"}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* 4. Live Mini-Batter & Bowler Widgets */}
            <Text className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">Current Center</Text>

            {/* Batsmen Block */}
            <View className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-4 mb-4 space-y-3.5">
                <View className="flex-row justify-between items-center border-b border-neutral-800/40 pb-2">
                    <Text className="text-neutral-500 text-xs font-bold uppercase w-5/12">Batter</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-2/12">R</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-2/12">B</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-1/12">4s</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-right w-2/12">SR</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center w-5/12 space-x-1.5">
                        <Text className="text-white text-sm font-bold truncate">Virat Kohli</Text>
                        <Ionicons name="star" size={10} color="#f5c542" />
                    </View>
                    <Text className="text-white text-sm font-black text-center w-2/12">84</Text>
                    <Text className="text-neutral-400 text-sm font-medium text-center w-2/12">112</Text>
                    <Text className="text-neutral-400 text-sm font-medium text-center w-1/12">9</Text>
                    <Text className="text-neutral-400 text-xs font-medium text-right w-2/12">75.00</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-300 text-sm font-medium w-5/12 truncate">KL Rahul</Text>
                    <Text className="text-white text-sm font-black text-center w-2/12">42</Text>
                    <Text className="text-neutral-400 text-sm font-medium text-center w-2/12">65</Text>
                    <Text className="text-neutral-400 text-sm font-medium text-center w-1/12">4</Text>
                    <Text className="text-neutral-400 text-xs font-medium text-right w-2/12">64.61</Text>
                </View>
            </View>

            {/* Bowler Block */}
            <View className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-4 mb-6 space-y-3.5">
                <View className="flex-row justify-between items-center border-b border-neutral-800/40 pb-2">
                    <Text className="text-neutral-500 text-xs font-bold uppercase w-5/12">Bowler</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-2/12">O</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-2/12">M</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-center w-1/12">R</Text>
                    <Text className="text-neutral-500 text-xs font-bold text-right w-2/12">W</Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text className="text-[#f5c542] text-sm font-bold w-5/12 truncate">Pat Cummins</Text>
                    <Text className="text-neutral-300 text-sm font-medium text-center w-2/12">14.1</Text>
                    <Text className="text-neutral-300 text-sm font-medium text-center w-2/12">2</Text>
                    <Text className="text-neutral-300 text-sm font-medium text-center w-1/12">54</Text>
                    <Text className="text-white text-sm font-black text-right w-2/12">2</Text>
                </View>
            </View>

            {/* 5. Visual Over / Recent Balls Strip */}
            <Text className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">Recent Balls (Over 42)</Text>
            <View className="flex-row items-center space-x-3 bg-neutral-900/30 border border-neutral-900 p-4 rounded-2xl mb-2">
                {["1", "4", "0", "Wd", "6", "W"].map((ball, idx) => {
                    let bgClass = "bg-neutral-800 border border-neutral-700/60";
                    let textClass = "text-neutral-300";

                    if (ball === "6" || ball === "4") {
                        bgClass = "bg-green-600/10 border border-green-500/30";
                        textClass = "text-green-400 font-bold";
                    } else if (ball === "W") {
                        bgClass = "bg-red-600/10 border border-red-500/30";
                        textClass = "text-red-400 font-black";
                    }

                    return (
                        <View key={idx} className={`w-9 h-9 rounded-full items-center justify-center ${bgClass}`}>
                            <Text className={`text-xs ${textClass}`}>{ball}</Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default MatchDetails;