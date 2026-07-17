import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import HeaderComponent from "./components/home/Header";
import MatchCard from "./components/home/MatchCard";
import { RoleGuard } from "../guards/RoleGuard";
import { RootState } from "../hooks/store";
import { ReduxUser, UserRole } from "../types";
import AdminUi from "./components/home/AdminUi";

// ---------- Core Configuration Map ----------
const FEATURE_ROLES: Record<string, (UserRole)[]> = {
  // ViewFixturesList: ["user", "admin", "scorer"],
  ViewFixturesList: ["user"],
  ViewHeaderComponentProfile: ["admin"],
  AccessSettingsModal: ["user", "admin"],
};

// ---------- Sample Data ----------
const MATCHES_DATA = [
  { id: 1, team1: "India", team2: "Australia", status: "Live" as const, score: "245/3 (42.1)" },
  { id: 2, team1: "England", team2: "New Zealand", status: "Upcoming" as const, score: "10:30 AM" },
  { id: 3, team1: "Pakistan", team2: "South Africa", status: "Completed" as const, score: "289/7 (50)" },
];

export default function Index() {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth) as { user: ReduxUser | null };
  // console.log("Current Redux User : ", user);

  const isLoggedIn = !!user;
  const currentRole = user?.role;

  // ---------- REDIRECT UNAUTHENTICATED USERS ----------
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleLogin = useCallback(() => {
    requestAnimationFrame(() => router.push("/login"));
  }, [router]);

  const handleLogout = useCallback(() => {
    Alert.alert("Logged Out", "You have been successfully logged out.");
  }, []);

  const handleToggleBookmark = useCallback((matchId: number) => {
    if (!isLoggedIn) {
      Alert.alert("Authentication Required", "Please log in to bookmark matches.");
      return;
    }
    console.log(`Toggling bookmark for match ID: ${matchId}`);
  }, [isLoggedIn]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">

        {/* Top Navbar */}
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

        {/* Protected Fixtures Content */}
        <RoleGuard
          userRole={currentRole}
          allowedRoles={FEATURE_ROLES.ViewFixturesList}
          fallback={
            <AdminUi/>
          }
        >
          <FlatList
            data={MATCHES_DATA}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push({
                  pathname: "/components/home/MatchDetails",
                  params: { id: item.id }
                })}
              >
                <MatchCard
                  match={item}
                  isBookmarked={user?.bookmarkedMatches?.includes(item.id.toString()) ?? false}
                  onToggleBookmark={handleToggleBookmark}
                />
              </Pressable>
            )}

            // Header Component with Role-Based Access Control
            ListHeaderComponent={
              <RoleGuard userRole={currentRole} allowedRoles={FEATURE_ROLES.ViewHeaderComponentProfile}>
                <HeaderComponent
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              </RoleGuard>
            }

            ListFooterComponent={() => (
              <View className="mt-2 mb-6 items-center">
                <Text className="text-neutral-600 text-xs font-medium tracking-wide">
                  © 2026 CricPlus • All rights reserved
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          />
        </RoleGuard>

        {/* Settings Modal Layer with RBAC Protection */}
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

              <RoleGuard
                userRole={currentRole}
                allowedRoles={FEATURE_ROLES.AccessSettingsModal}
                fallback={
                  <View className="bg-black/40 rounded-2xl p-5 border border-neutral-800/60 items-center my-3">
                    <Text className="text-neutral-400 text-sm text-center">
                      Please log in to access your settings and preferences.
                    </Text>
                  </View>
                }
              >
                <View>
                  {[
                    { label: "Account", icon: "person-outline" },
                    { label: "Notifications", icon: "notifications-outline" },
                    { label: "Appearance", icon: "moon-outline" },
                    { label: "Statistics", icon: "stats-chart-outline" },
                  ].map((item, idx) => (
                    <Pressable key={idx} className="flex-row items-center justify-between py-4 border-b border-neutral-800/50">
                      <View className="flex-row items-center space-x-3">
                        <Ionicons name={item.icon as any} size={22} color="#a3a3a3" />
                        <Text className="text-neutral-300 text-base font-medium">{item.label}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#525252" />
                    </Pressable>
                  ))}
                </View>
              </RoleGuard>

              <Pressable
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