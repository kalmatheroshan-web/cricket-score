import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Match } from "../../../types";

interface MatchCardProps {
    match: Match;
    isBookmarked: boolean;
    onToggleBookmark: (id: number) => void;
}
const MatchCard = memo(({ match, isBookmarked, onToggleBookmark }: MatchCardProps) => {
    const statusConfig = {
        Live: { text: "LIVE", bg: "bg-red-500/20", textColor: "text-red-400", dotColor: "bg-red-500" },
        Upcoming: { text: "UPCOMING", bg: "bg-blue-500/20", textColor: "text-blue-400", dotColor: "bg-blue-500" },
        Completed: { text: "FINISHED", bg: "bg-neutral-700/30", textColor: "text-neutral-400", dotColor: "bg-neutral-500" },
    };

    const status = statusConfig[match.status];

    const getTeamEmoji = (team: string) => {
        const map: Record<string, string> = {
            India: "🇮🇳", Australia: "🇦🇺", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "New Zealand": "🇳🇿",
            Pakistan: "🇵🇰", "South Africa": "🇿🇦", "Sri Lanka": "🇱🇰", Bangladesh: "🇧🇩",
        };
        return map[team] || "🏏";
    };

    return (
        <View className="bg-neutral-900/70 rounded-2xl p-4 mb-4 border border-neutral-800/60 shadow-lg shadow-black/30">
            <View className="flex-row justify-between items-center mb-3">
                <View className={`${status.bg} px-3 py-1 rounded-full flex-row items-center`}>
                    <View className={`w-1.5 h-1.5 rounded-full ${status.dotColor} mr-2`} />
                    <Text className={`text-xs font-bold tracking-wider ${status.textColor}`}>{status.text}</Text>
                </View>
                <Pressable hitSlop={10} onPress={() => onToggleBookmark(match.id)}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={isBookmarked ? "#f5c542" : "#737373"}
                    />
                </Pressable>
            </View>

            <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center space-x-2">
                    <Text className="text-2xl">{getTeamEmoji(match.team1)}</Text>
                    <Text className="text-white text-base font-semibold tracking-wide" numberOfLines={1}>{match.team1}</Text>
                </View>
                <View className="px-3"><Text className="text-neutral-500 text-xs font-black tracking-widest">VS</Text></View>
                <View className="flex-1 flex-row items-center justify-end space-x-2">
                    <Text className="text-white text-base font-semibold tracking-wide text-right" numberOfLines={1}>{match.team2}</Text>
                    <Text className="text-2xl">{getTeamEmoji(match.team2)}</Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center border-t border-neutral-800/50 mt-3 pt-3">
                <Text className="text-neutral-400 text-xs font-medium">ICC World Cup</Text>
                <Text className="text-[#f5c542] font-bold text-lg tracking-tight">{match.score}</Text>
            </View>

            {match.status === "Live" && (
                <View className="mt-2 flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    <Text className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Live • 6 overs remaining</Text>
                </View>
            )}
        </View>
    );
});


export default MatchCard; 