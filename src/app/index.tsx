import React, { useCallback, useState, memo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";


// ---------- Types ----------
interface Match {
  id: number;
  team1: string;
  team2: string;
  status: "Live" | "Upcoming" | "Completed";
  score: string;
}

// ---------- Sample Data ----------
const MATCHES_DATA: Match[] = [
  {
    id: 1,
    team1: "India",
    team2: "Australia",
    status: "Live",
    score: "245/3 (42.1)",
  },
  {
    id: 2,
    team1: "England",
    team2: "New Zealand",
    status: "Upcoming",
    score: "10:30 AM",
  },
  {
    id: 3,
    team1: "Pakistan",
    team2: "South Africa",
    status: "Completed",
    score: "289/7 (50)",
  },
  {
    id: 4,
    team1: "Sri Lanka",
    team2: "Bangladesh",
    status: "Live",
    score: "112/2 (18.4)",
  },
];

// ---------- Memoized Match Card ----------
const MatchCard = React.memo(({ match }: { match: Match }) => {
  const statusConfig = {
    Live: {
      text: "LIVE",
      bg: "bg-red-500/20",
      textColor: "text-red-400",
      dotColor: "bg-red-500",
    },
    Upcoming: {
      text: "UPCOMING",
      bg: "bg-blue-500/20",
      textColor: "text-blue-400",
      dotColor: "bg-blue-500",
    },
    Completed: {
      text: "FINISHED",
      bg: "bg-neutral-700/30",
      textColor: "text-neutral-400",
      dotColor: "bg-neutral-500",
    },
  };

  const status = statusConfig[match.status];

  const getTeamEmoji = (team: string) => {
    const map: Record<string, string> = {
      India: "🇮🇳",
      Australia: "🇦🇺",
      England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      "New Zealand": "🇳🇿",
      Pakistan: "🇵🇰",
      "South Africa": "🇿🇦",
      "Sri Lanka": "🇱🇰",
      Bangladesh: "🇧🇩",
    };
    return map[team] || "🏏";
  };

  const user = useSelector((state: RootState) => state.auth);
  console.log("Home ", user);

  return (
    <View className="bg-neutral-900/70 rounded-2xl p-4 mb-4 border border-neutral-800/60 shadow-lg shadow-black/30">
      <View className="flex-row justify-between items-center mb-3">
        <View className={`${status.bg} px-3 py-1 rounded-full flex-row items-center`}>
          <View className={`w-1.5 h-1.5 rounded-full ${status.dotColor} mr-2`} />
          <Text className={`text-xs font-bold tracking-wider ${status.textColor}`}>
            {status.text}
          </Text>
        </View>
        <Pressable hitSlop={10}>
          {({ pressed }) => (
            <Ionicons
              name="bookmark-outline"
              size={20}
              color={pressed ? "#f5c542" : "#737373"}
            />
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center space-x-2">
          <Text className="text-2xl">{getTeamEmoji(match.team1)}</Text>
          <Text className="text-white text-base font-semibold tracking-wide" numberOfLines={1}>
            {match.team1}
          </Text>
        </View>

        <View className="px-3">
          <Text className="text-neutral-500 text-xs font-black tracking-widest">VS</Text>
        </View>

        <View className="flex-1 flex-row items-center justify-end space-x-2">
          <Text className="text-white text-base font-semibold tracking-wide text-right" numberOfLines={1}>
            {match.team2}
          </Text>
          <Text className="text-2xl">{getTeamEmoji(match.team2)}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center border-t border-neutral-800/50 mt-3 pt-3">
        <Text className="text-neutral-400 text-xs font-medium">ICC World Cup</Text>
        <Text className="text-[#f5c542] font-bold text-lg tracking-tight">
          {match.score}
        </Text>
      </View>

      {match.status === "Live" && (
        <View className="mt-2 flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
          <Text className="text-red-400 text-[10px] font-bold uppercase tracking-widest">
            Live • 6 overs remaining
          </Text>
        </View>
      )}
    </View>
  );
});

// ---------- Memoized Header ----------
const Header = memo(({ isLoggedIn, onLogin, onLogout }: any) => (
  <View className="mb-5">
    {isLoggedIn ? (
      <View className="bg-neutral-900/70 rounded-3xl p-5 border border-neutral-800/60 shadow-lg shadow-black/30">
        <View className="flex-row items-center mb-5">
          <View className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5c542] to-[#d4a837] justify-center items-center mr-4">
            <Ionicons name="person" size={28} color="#000" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold tracking-wide">Rahul Sharma</Text>
            <Text className="text-neutral-400 text-sm">rahul@cricplus.com</Text>
          </View>
          <Pressable onPress={onLogout} className="p-2 rounded-full bg-red-950/30 border border-red-900/40">
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </Pressable>
        </View>

        <View className="flex-row space-x-3">
          {[
            { label: "Matches", value: "12", color: "text-white" },
            { label: "Favorites", value: "3", color: "text-[#f5c542]" },
            { label: "Wins", value: "8", color: "text-green-400" },
          ].map((stat, i) => (
            <View
              key={i}
              className="flex-1 bg-black/40 border border-neutral-800/60 p-3 rounded-2xl items-center"
            >
              <Text className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                {stat.label}
              </Text>
              <Text className={`${stat.color} text-xl font-black mt-1`}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>
    ) : (
      <View className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/40 rounded-3xl p-6 border border-neutral-800/60 shadow-xl items-center">
        <Text className="text-white text-2xl font-bold tracking-tight mb-1">
          Welcome to CricPlus
        </Text>
        <Text className="text-neutral-400 text-xs text-center max-w-[260px] mb-5 leading-5">
          Sign in to track your favorite teams, get live alerts, and personalize your feed.
        </Text>
        {/* Use TouchableOpacity for smooth, flash‑free feedback */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onLogin}
          className="w-full py-4 rounded-2xl bg-[#f5c542] shadow-lg shadow-[#f5c542]/20"
        >
          <Text className="text-black font-bold text-sm tracking-wide text-center">
            Login / Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    )}

    <View className="flex-row items-center justify-between mt-6 mb-3">
      <Text className="text-white text-xl font-bold tracking-tight">
        Today's Fixtures
      </Text>
      <Pressable className="flex-row items-center space-x-1">
        {({ pressed }) => (
          <>
            <Text className={`text-xs font-semibold ${pressed ? "text-white" : "text-[#f5c542]"}`}>
              View All
            </Text>
            <Ionicons name="chevron-forward" size={14} color={pressed ? "#fff" : "#f5c542"} />
          </>
        )}
      </Pressable>
    </View>
  </View>
));

// ---------- Memoized Footer ----------
const Footer = memo(() => (
  <View className="mt-2 mb-6 items-center">
    <Text className="text-neutral-600 text-xs font-medium tracking-wide">
      © 2026 CricPlus • All rights reserved
    </Text>
  </View>
));

// ---------- Main Component ----------
export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const router = useRouter();

  const handleLogin = useCallback(() => {
    // Small delay allows the touch feedback to complete before navigation
    requestAnimationFrame(() => {
      router.push("/components/login");
    });
  }, [router]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    Alert.alert("Logged Out", "You have been successfully logged out.");
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        {/* Top Navigation */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-neutral-900/80">
          <Text className="text-white text-2xl font-black tracking-tighter">
            CRIC<Text className="text-[#f5c542]">PLUS</Text>
          </Text>
          <View className="flex-row items-center space-x-4">
            <Pressable className="p-2">
              <Ionicons name="search-outline" size={22} color="#a3a3a3" />
            </Pressable>
            <Pressable
              onPress={() => setSettingsModalVisible(true)}
              className="p-2 rounded-full bg-neutral-800/40 border border-neutral-700/40"
            >
              <Ionicons name="options-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={MATCHES_DATA}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MatchCard match={item} />}
          ListHeaderComponent={<Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />}
          ListFooterComponent={Footer}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />

        {/* Settings Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={settingsModalVisible}
          statusBarTranslucent
          onRequestClose={() => setSettingsModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/75">
            <View className="w-full bg-neutral-900 rounded-t-[32px] p-6 border-t border-neutral-800/80 shadow-2xl">
              <View className="w-12 h-1.5 bg-neutral-700 rounded-full self-center mb-5" />

              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-white text-xl font-bold tracking-tight">Settings</Text>
                <Pressable onPress={() => setSettingsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#a3a3a3" />
                </Pressable>
              </View>

              {isLoggedIn ? (
                <View>
                  {[
                    { label: "Account", icon: "person-outline" },
                    { label: "Notifications", icon: "notifications-outline" },
                    { label: "Appearance", icon: "moon-outline" },
                    { label: "Statistics", icon: "stats-chart-outline" },
                  ].map((item, idx) => (
                    <Pressable
                      key={idx}
                      className="flex-row items-center justify-between py-4 border-b border-neutral-800/50"
                    >
                      <View className="flex-row items-center space-x-3">
                        <Ionicons name={item.icon as any} size={22} color="#a3a3a3" />
                        <Text className="text-neutral-300 text-base font-medium">{item.label}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#525252" />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View className="bg-black/40 rounded-2xl p-5 border border-neutral-800/60 items-center my-3">
                  <Text className="text-neutral-400 text-sm text-center">
                    Please log in to access your settings and preferences.
                  </Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                })}
                className="mt-5 w-full py-3.5 rounded-2xl bg-neutral-800 border border-neutral-700/60"
                onPress={() => setSettingsModalVisible(false)}
              >
                <Text className="text-white font-bold text-sm tracking-wide text-center">Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}