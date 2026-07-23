import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, User } from "lucide-react-native";
import { getMatches } from "@/services/api/match";
import Leaderboard, { MatchItem } from "./leaderboard";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

export default function Home() {
    const router = useRouter();
    const [liveMatches, setLiveMatches] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        let isMounted = true;
        const fetchMatches = async () => {
            try {
                const res = await getMatches();

                if (isMounted && res?.matches) {
                    setLiveMatches(res.matches);
                }
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchMatches();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-amber-50/30">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Top Header */}
                <View className="flex-row justify-between items-center px-5 py-4">
                    <View>
                        <View className="flex-row items-baseline">
                            <Text className="text-3xl font-black text-orange-500 tracking-tighter">
                                Cric
                            </Text>
                            <Text className="text-3xl font-black text-slate-900 tracking-tighter">
                                Show
                            </Text>
                            <View className="h-2 w-2 rounded-full bg-orange-500 ml-0.5" />
                        </View>
                        <Text className="text-xs font-bold text-slate-400 tracking-wider mt-0.5 uppercase">
                            Live Scores • Fast Highlights
                        </Text>
                    </View>

                    {/* Action Icons */}
                    <View className="flex-row items-center space-x-3">
                        <TouchableOpacity className="w-10 h-10 rounded-2xl bg-white justify-center items-center border border-orange-100 shadow-sm">
                            <Settings size={20} color="#1E293B" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push("/home/profile")}
                            activeOpacity={0.8}
                            className="w-11 h-11 rounded-full bg-orange-500 items-center justify-center shadow-lg"
                        >
                            <Text className="text-white text-lg font-bold">
                                {user?.username?.[0]?.toUpperCase() ?? "U"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Live / Upcoming Matches Carousel */}
                <View className="mt-2">
                    <View className="flex-row justify-between items-baseline px-5 mb-3">
                        <Text className="text-xl font-black tracking-tight text-slate-900">
                            Available Matches
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="h-44 justify-center items-center">
                            <ActivityIndicator color="#f97316" size="small" />
                        </View>
                    ) : liveMatches.length > 0 ? (
                        <FlatList
                            data={liveMatches}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <Leaderboard item={item} />}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
                        />
                    ) : (
                        <View className="mx-5 p-6 bg-white rounded-3xl border border-orange-100 items-center justify-center">
                            <Text className="text-slate-500 text-xs font-medium tracking-wide">
                                No active or upcoming matches available right now.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}