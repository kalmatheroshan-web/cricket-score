import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Flame,
  Trophy,
  UserCheck,
} from "lucide-react-native";

interface TeamScore {
  runs: number;
  wickets: number;
  overs: number;
}

interface MatchScore {
  team1Score?: TeamScore;
  team2Score?: TeamScore;
  currentInnings?: number;
  battingTeam?: string;
  bowlingTeam?: string;
}

export interface TeamDetails {
  _id: string;
  teamName?: string;
  shortName?: string;
  logoUrl?: string;
  logo?: string;
}

export interface MatchItem {
  _id: string;
  team1: string | TeamDetails | undefined;
  team2: string | TeamDetails | undefined;
  status: "Live" | "Upcoming" | "Completed" | string;
  dateTime: string;
  venue?: string;
  assignedScorer?: string;
  score?: MatchScore;
  createdAt?: string;
  updatedAt?: string;
}

export default function Leaderboard({ item }: { item: MatchItem }) {
  if (!item) return null;

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"score" | "info">("score");

  const parseTeam = (
    team: string | TeamDetails | undefined,
    fallbackName: string
  ) => {
    if (typeof team === "object" && team !== null) {
      const name = team.teamName || fallbackName;
      const shortName =
        team.shortName || name.slice(0, 3).toUpperCase() || fallbackName;
      // Checks both logoUrl (from API) and logo
      const logo = team.logoUrl || team.logo;

      return {
        id: team._id,
        name,
        shortName,
        logo,
      };
    }
    return {
      id: typeof team === "string" ? team : fallbackName,
      name: fallbackName,
      shortName: fallbackName,
      logo: undefined,
    };
  };

  const team1 = parseTeam(item.team1, "TM1");
  const team2 = parseTeam(item.team2, "TM2");

  const isLive = item.status?.toLowerCase() === "live";
  const isUpcoming = item.status?.toLowerCase() === "upcoming";
  const isCompleted = item.status?.toLowerCase() === "completed";

  const handleCardPress = () => {
    router.push(`/match/${item._id}` as any);
  };

  const handleTeamPress = (teamId: string) => {
    router.push(`/teams/${teamId}` as any);
  };

  const renderScoreRow = (
    team: ReturnType<typeof parseTeam>,
    teamScore?: TeamScore,
    isBatting?: boolean
  ) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleTeamPress(team.id)}
        className="flex-row items-center justify-between py-2.5 px-3 rounded-2xl active:bg-orange-50/50"
      >
        {/* Team Logo & Name */}
        <View className="flex-row items-center space-x-3 flex-1 mr-2">
          {team.logo ? (
            <Image
              source={{ uri: team.logo }}
              className="w-8 h-8 rounded-full bg-slate-100"
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 justify-center items-center">
              <Text className="text-xs font-black text-orange-600">
                {team.shortName.slice(0, 3)}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                numberOfLines={1}
                className="text-base font-extrabold text-slate-900 mr-1.5"
              >
                {team.name}
              </Text>
              {isLive && isBatting && (
                <View className="w-2 h-2 rounded-full bg-orange-500" />
              )}
            </View>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {team.shortName}
            </Text>
          </View>
        </View>

        {/* Dynamic Score Output */}
        {isUpcoming ? (
          <Text className="text-xs font-semibold text-slate-400 tracking-wider">
            Yet to bat
          </Text>
        ) : (
          <View className="items-end">
            <Text className="text-lg font-black text-slate-900 tracking-tight">
              {teamScore?.runs ?? 0}/{teamScore?.wickets ?? 0}
            </Text>
            <Text className="text-[11px] font-bold text-orange-600">
              ({teamScore?.overs ?? 0} ov)
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      className="w-80 bg-white rounded-3xl p-4 mr-3 border border-orange-100 shadow-sm justify-between"
    >
      {/* 1. Header: Venue & Live Badge */}
      <View className="flex-row justify-between items-center pb-2.5 border-b border-orange-50">
        <View className="flex-row items-center flex-1 mr-2">
          <MapPin size={13} color="#f97316" />
          <Text
            numberOfLines={1}
            className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex-1"
          >
            {item.venue || "TBD Stadium"}
          </Text>
        </View>

        {/* Dynamic Status Pill */}
        {isLive ? (
          <View className="flex-row items-center bg-orange-500 px-2.5 py-1 rounded-full space-x-1">
            <Flame size={12} color="#ffffff" />
            <Text className="text-[10px] font-black text-white tracking-wider uppercase ml-0.5">
              LIVE
            </Text>
          </View>
        ) : isCompleted ? (
          <View className="flex-row items-center bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <Trophy size={11} color="#059669" />
            <Text className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase ml-1">
              FINAL
            </Text>
          </View>
        ) : (
          <View className="bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
            <Text className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              {item.status || "UPCOMING"}
            </Text>
          </View>
        )}
      </View>

      {/* 2. Scorecard / Info Interactive Tabs */}
      <View className="flex-row bg-slate-100/80 p-0.5 rounded-xl my-3">
        <TouchableOpacity
          onPress={() => setActiveTab("score")}
          className={`flex-1 py-1 rounded-lg items-center ${activeTab === "score" ? "bg-white shadow-xs" : ""
            }`}
        >
          <Text
            className={`text-[11px] font-bold ${activeTab === "score" ? "text-orange-600" : "text-slate-400"
              }`}
          >
            Scorecard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("info")}
          className={`flex-1 py-1 rounded-lg items-center ${activeTab === "info" ? "bg-white shadow-xs" : ""
            }`}
        >
          <Text
            className={`text-[11px] font-bold ${activeTab === "info" ? "text-orange-600" : "text-slate-400"
              }`}
          >
            Match Info
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Interactive Content Panel */}
      {activeTab === "score" ? (
        <View className="space-y-1 my-1">
          {renderScoreRow(
            team1,
            item.score?.team1Score,
            item.score?.battingTeam === team1.id
          )}
          <View className="h-[1px] bg-slate-100 my-0.5" />
          {renderScoreRow(
            team2,
            item.score?.team2Score,
            item.score?.battingTeam === team2.id
          )}
        </View>
      ) : (
        <View className="p-3 bg-orange-50/50 rounded-2xl space-y-2 my-1 border border-orange-100/50">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-slate-400">Date & Time</Text>
            <View className="flex-row items-center">
              <Calendar size={12} color="#f97316" />
              <Text className="text-xs font-bold text-slate-700 ml-1">
                {item.dateTime
                  ? new Date(item.dateTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "TBD"}
              </Text>
            </View>
          </View>

          {item.assignedScorer && (
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-slate-400">
                Official Scorer
              </Text>
              <View className="flex-row items-center">
                <UserCheck size={12} color="#f97316" />
                <Text className="text-xs font-bold text-slate-700 ml-1">
                  Verified Scorer
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* 4. Bottom Footer CTA */}
      <View className="pt-2.5 mt-2 border-t border-slate-100 flex-row items-center justify-between">
        <Text className="text-xs font-bold text-orange-600">
          {isLive ? "Tap for ball-by-ball overview" : "View match details"}
        </Text>
        <ChevronRight size={16} color="#f97316" />
      </View>
    </TouchableOpacity>
  );
}