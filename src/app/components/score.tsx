import { Text, View, ScrollView, StatusBar, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ScoreScreen() {   // ← PascalCase component name
    const router = useRouter();

    const match = {
        team1: { name: "India", short: "IND", score: "245/3", overs: "38.2", runRate: "6.39" },
        team2: { name: "Australia", short: "AUS", score: "210/5", overs: "34.1", runRate: "6.14" },
        requiredRunRate: "7.5",
        batsmen: [
            { name: "V. Kohli", runs: "78", balls: "62", fours: "8", sixes: "2", sr: "125.8", active: true },
            { name: "S. Yadav", runs: "42", balls: "28", fours: "5", sixes: "1", sr: "150.0", active: false },
        ],
        bowlers: [
            { name: "P. Cummins", overs: "7", maidens: "1", runs: "38", wickets: "2", economy: "5.43" },
            { name: "A. Zampa", overs: "6", maidens: "0", runs: "32", wickets: "1", economy: "5.33" },
        ],
        status: "India need 32 runs in 18 balls",
        target: "Target: 278",
    };

    return (
        <SafeAreaView className="flex-1 bg-black bg-gradient-to-b from-[#0b0e14] to-[#05080c]">
            <StatusBar barStyle="light-content" backgroundColor="#0b0e14" />

            {/* Header with Back Button and Live Badge */}
            <View className="flex-row justify-between items-center px-5 pt-3 mb-4">
                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 active:bg-white/10 active:scale-95 transition-all"
                    >
                        <Text className="text-white text-xl font-bold">←</Text>
                    </Pressable>
                    <View>
                        <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">ICC Men's Major</Text>
                        <Text className="text-xl font-black text-white tracking-tight">Live Match</Text>
                    </View>
                </View>
                <View className="flex-row items-center bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <View className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                    <Text className="text-red-400 font-bold text-xs uppercase tracking-widest">Live</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Main Scoreboard – Glassmorphism + Gradient Border */}
                <View className="bg-[#121824] rounded-3xl p-5 mb-5 border border-white/5 shadow-2xl shadow-black/50">
                    <View className="flex-row justify-between items-center mb-2">
                        {/* Team 1 (batting) */}
                        <View className="flex-1 items-start">
                            <View className="flex-row items-center mb-1">
                                <Text className="text-white text-base font-bold tracking-wide">{match.team1.short}</Text>
                                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-2" />
                            </View>
                            <Text className="text-white text-3xl font-black tracking-tighter">{match.team1.score}</Text>
                            <Text className="text-slate-400 text-xs mt-1 font-medium">Overs {match.team1.overs}</Text>
                            <Text className="text-slate-500 text-[10px] font-bold mt-0.5">CRR {match.team1.runRate}</Text>
                        </View>

                        {/* VS & Target */}
                        <View className="items-center px-2">
                            <View className="bg-white/5 px-2.5 py-1 rounded-md mb-1 border border-white/5">
                                <Text className="text-amber-400 text-[10px] font-black tracking-widest uppercase">VS</Text>
                            </View>
                            <Text className="text-slate-500 text-[11px] font-medium tracking-wide">{match.target}</Text>
                        </View>

                        {/* Team 2 */}
                        <View className="flex-1 items-end">
                            <View className="flex-row items-center mb-1">
                                <Text className="text-slate-400 text-base font-bold tracking-wide">{match.team2.short}</Text>
                            </View>
                            <Text className="text-slate-400 text-3xl font-black tracking-tighter">{match.team2.score}</Text>
                            <Text className="text-slate-500 text-xs mt-1 font-medium">Overs {match.team2.overs}</Text>
                            <Text className="text-slate-500 text-[10px] font-bold mt-0.5">RR {match.team2.runRate}</Text>
                        </View>
                    </View>

                    {/* Status + Required RR */}
                    <View className="mt-5 pt-4 border-t border-white/5 flex-row justify-between items-center">
                        <Text className="text-amber-300 text-xs font-bold tracking-wide flex-1 pr-2">{match.status}</Text>
                        <View className="bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                            <Text className="text-amber-400 text-[11px] font-extrabold tracking-wide">REQ RR {match.requiredRunRate}</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Balls – Momentum Ticker */}
                <View className="flex-row items-center justify-between bg-[#121824] rounded-2xl p-3 mb-5 border border-white/5">
                    <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider pl-1">Recent</Text>
                    <View className="flex-row items-center gap-1.5">
                        {['1', '4', '0', 'W', '2', '6'].map((ball, i) => (
                            <View
                                key={i}
                                className={`w-7 h-7 items-center justify-center rounded-full border ${ball === 'W' ? 'bg-red-500/20 border-red-500/30' :
                                        ball === '6' ? 'bg-amber-500/20 border-amber-500/30' :
                                            ball === '4' ? 'bg-emerald-500/20 border-emerald-500/30' :
                                                'bg-white/5 border-white/10'
                                    }`}
                            >
                                <Text className={`text-xs font-black ${ball === 'W' ? 'text-red-400' :
                                        ball === '6' ? 'text-amber-400' :
                                            ball === '4' ? 'text-emerald-400' :
                                                'text-slate-300'
                                    }`}>
                                    {ball}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Batting Stats */}
                <View className="bg-[#121824] rounded-2xl p-4 mb-5 border border-white/5 shadow-sm">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white font-extrabold text-sm tracking-wide uppercase">🏏 Batting</Text>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Innings 2</Text>
                    </View>

                    {/* Header */}
                    <View className="flex-row border-b border-white/5 pb-2 mb-1">
                        <Text className="text-slate-500 text-[10px] flex-1 font-bold tracking-wider">BATSMAN</Text>
                        <Text className="text-slate-500 text-[10px] w-10 text-center font-bold tracking-wider">R</Text>
                        <Text className="text-slate-500 text-[10px] w-8 text-center font-bold tracking-wider">B</Text>
                        <Text className="text-slate-500 text-[10px] w-6 text-center font-bold tracking-wider">4s</Text>
                        <Text className="text-slate-500 text-[10px] w-6 text-center font-bold tracking-wider">6s</Text>
                        <Text className="text-slate-500 text-[10px] w-12 text-right font-bold tracking-wider">SR</Text>
                    </View>

                    {match.batsmen.map((b, i) => (
                        <View key={i} className={`flex-row py-3 items-center ${i !== match.batsmen.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <View className="flex-1 flex-row items-center">
                                <Text className={`text-sm ${b.active ? 'text-emerald-400 font-bold' : 'text-white font-medium'}`}>
                                    {b.name}
                                </Text>
                                {b.active && <Text className="text-emerald-400 text-xs ml-1">*</Text>}
                            </View>
                            <Text className="text-white text-sm w-10 text-center font-black">{b.runs}</Text>
                            <Text className="text-slate-400 text-sm w-8 text-center font-medium">{b.balls}</Text>
                            <Text className="text-slate-400 text-sm w-6 text-center">{b.fours}</Text>
                            <Text className="text-slate-400 text-sm w-6 text-center">{b.sixes}</Text>
                            <Text className="text-slate-400 text-sm w-12 text-right font-semibold">{b.sr}</Text>
                        </View>
                    ))}
                </View>

                {/* Bowling Stats */}
                <View className="bg-[#121824] rounded-2xl p-4 border border-white/5 shadow-sm">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-white font-extrabold text-sm tracking-wide uppercase">🎯 Bowling</Text>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Innings 1</Text>
                    </View>

                    <View className="flex-row border-b border-white/5 pb-2 mb-1">
                        <Text className="text-slate-500 text-[10px] flex-1 font-bold tracking-wider">BOWLER</Text>
                        <Text className="text-slate-500 text-[10px] w-8 text-center font-bold tracking-wider">O</Text>
                        <Text className="text-slate-500 text-[10px] w-6 text-center font-bold tracking-wider">M</Text>
                        <Text className="text-slate-500 text-[10px] w-8 text-center font-bold tracking-wider">R</Text>
                        <Text className="text-slate-500 text-[10px] w-8 text-center font-bold tracking-wider">W</Text>
                        <Text className="text-slate-500 text-[10px] w-12 text-right font-bold tracking-wider">ECON</Text>
                    </View>

                    {match.bowlers.map((b, i) => (
                        <View key={i} className={`flex-row py-3 items-center ${i !== match.bowlers.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <Text className="text-white text-sm font-medium flex-1">{b.name}</Text>
                            <Text className="text-slate-400 text-sm w-8 text-center">{b.overs}</Text>
                            <Text className="text-slate-400 text-sm w-6 text-center">{b.maidens}</Text>
                            <Text className="text-slate-400 text-sm w-8 text-center">{b.runs}</Text>
                            <Text className="text-amber-400 text-sm w-8 text-center font-black">{b.wickets}</Text>
                            <Text className="text-slate-400 text-sm w-12 text-right font-semibold">{b.economy}</Text>
                        </View>
                    ))}
                </View>

                {/* Extra Polish: "Live Update" footer */}
                <Text className="text-center text-slate-600 text-[10px] font-medium tracking-widest uppercase mt-6">
                    Updating live • Tap to refresh
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}