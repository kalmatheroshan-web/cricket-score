import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import {
  Trophy,
  Users,
  Activity,
  Plus,
  Settings,
  LogOut,
  ChevronRight,
  Radio,
  Search,
} from "lucide-react-native";
import { useDispatch } from "react-redux";
import { logout } from "@/services/api/auth";

// Mock types for dashboard data
interface LiveMatch {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
}

function AdminUi() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Example active matches data
  const [activeMatches] = useState<LiveMatch[]>([
    {
      id: "1",
      teamA: "IND",
      teamB: "AUS",
      scoreA: "284/4 (45.2)",
      scoreB: "Yet to bat",
      status: "1st Innings • Live",
    },
    {
      id: "2",
      teamA: "ENG",
      teamB: "SA",
      scoreA: "198/10",
      scoreB: "142/3 (24.0)",
      status: "Target 199 • Live",
    },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleLogout = async () => {
    await logout()(dispatch);
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-zinc-50">
      <SafeAreaView className="flex-1">
        {/* Header Section */}
        <View className="px-6 pt-4 pb-4 bg-zinc-50 border-b border-zinc-200/60 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center space-x-1.5">
              <Text className="text-xl font-black text-orange-600 tracking-tight">
                Cric
              </Text>
              <Text className="text-xl font-black text-zinc-900 tracking-tight">
                Show
              </Text>
              <View className="h-1.5 w-1.5 rounded-full bg-orange-500 ml-0.5" />
              <View className="bg-orange-100 px-2 py-0.5 rounded-md ml-2 border border-orange-200">
                <Text className="text-[10px] font-extrabold text-orange-700 tracking-wider uppercase">
                  Admin
                </Text>
              </View>
            </View>
            <Text className="text-xs font-medium text-zinc-400 mt-0.5">
              System Control & Management
            </Text>
          </View>

          {/* Quick Action Icons */}
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/80 items-center justify-center"
            >
              <Settings size={18} color="#71717a" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 items-center justify-center"
            >
              <LogOut size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerClassName="px-6 py-6 pb-12"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Welcome Banner */}
          <View className="mb-6">
            <Text className="text-2xl font-bold tracking-tight text-zinc-900">
              Dashboard Overview
            </Text>
            <Text className="text-xs text-zinc-400 mt-0.5">
              Real-time match status and platform metrics
            </Text>
          </View>

          {/* Metric Cards Grid */}
          <View className="flex-row space-x-3 mb-6">
            {/* Metric 1 */}
            <View className="flex-1 bg-white p-4 rounded-3xl border border-zinc-200/70">
              <View className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center mb-3">
                <Radio size={16} color="#ea580c" />
              </View>
              <Text className="text-2xl font-black text-zinc-900 tracking-tight">
                02
              </Text>
              <Text className="text-[11px] font-semibold text-zinc-400 tracking-tight mt-0.5">
                Live Matches
              </Text>
            </View>

            {/* Metric 2 */}
            <View className="flex-1 bg-white p-4 rounded-3xl border border-zinc-200/70">
              <View className="w-8 h-8 rounded-xl bg-zinc-100 items-center justify-center mb-3">
                <Trophy size={16} color="#18181b" />
              </View>
              <Text className="text-2xl font-black text-zinc-900 tracking-tight">
                18
              </Text>
              <Text className="text-[11px] font-semibold text-zinc-400 tracking-tight mt-0.5">
                Active Tournaments
              </Text>
            </View>

            {/* Metric 3 */}
            <View className="flex-1 bg-white p-4 rounded-3xl border border-zinc-200/70">
              <View className="w-8 h-8 rounded-xl bg-zinc-100 items-center justify-center mb-3">
                <Users size={16} color="#18181b" />
              </View>
              <Text className="text-2xl font-black text-zinc-900 tracking-tight">
                1.4k
              </Text>
              <Text className="text-[11px] font-semibold text-zinc-400 tracking-tight mt-0.5">
                Total Users
              </Text>
            </View>
          </View>

          {/* Primary Quick Action Button */}
          <Pressable
            onPress={() => router.push("../components/createMatch")}
            className="bg-zinc-900 h-14 rounded-2xl flex-row items-center justify-center space-x-2 mb-8 active:opacity-90"
            android_ripple={{ color: "#3f3f46" }}
          >
            <Plus color="#ffffff" size={18} />
            <Text className="text-white font-semibold text-sm tracking-wide">
              Create New Match
            </Text>
          </Pressable>

          {/* Section: Live Matches */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center space-x-2">
              <View className="h-2 w-2 rounded-full bg-red-500" />
              <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Active Matches
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.6}>
              <Text className="text-xs font-semibold text-orange-600">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Monolithic List Block */}
          <View className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden mb-8">
            {activeMatches.map((match, idx) => (
              <TouchableOpacity
                key={match.id}
                activeOpacity={0.7}
                className={`p-4 flex-row items-center justify-between bg-zinc-50/5 ${idx < activeMatches.length - 1 ? "border-b border-zinc-100" : ""
                  }`}
              >
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center space-x-2 mb-1">
                    <Text className="text-xs font-bold text-zinc-900">
                      {match.teamA} vs {match.teamB}
                    </Text>
                    <Text className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      {match.status}
                    </Text>
                  </View>
                  <Text className="text-xs text-zinc-500 font-medium">
                    {match.teamA}: {match.scoreA} • {match.teamB}: {match.scoreB}
                  </Text>
                </View>
                <ChevronRight size={18} color="#a1a1aa" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: Management Tools */}
          <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Quick Operations
          </Text>

          <View className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 border-b border-zinc-100 flex-row items-center justify-between bg-zinc-50/5"
            >
              <View className="flex-row items-center space-x-3">
                <View className="w-9 h-9 rounded-xl bg-zinc-100 items-center justify-center">
                  <Activity size={18} color="#18181b" />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-zinc-900">
                    Manage Squads & Players
                  </Text>
                  <Text className="text-[11px] text-zinc-400 mt-0.5">
                    Update team rosters and profiles
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#a1a1aa" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="p-4 flex-row items-center justify-between bg-zinc-50/5"
            >
              <View className="flex-row items-center space-x-3">
                <View className="w-9 h-9 rounded-xl bg-zinc-100 items-center justify-center">
                  <Search size={18} color="#18181b" />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-zinc-900">
                    Audit Logs & Analytics
                  </Text>
                  <Text className="text-[11px] text-zinc-400 mt-0.5">
                    Review recent platform updates
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default AdminUi;