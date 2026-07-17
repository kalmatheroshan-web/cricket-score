import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { ReduxUser } from "../../types";

interface HeaderProps {
  isLoggedIn: boolean;
  user: ReduxUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header = memo(({ isLoggedIn, user, onLogin, onLogout }: HeaderProps) => {
  const statsList = [
    { label: "Matches", value: String(user?.stats?.matchesTracked ?? 0), color: "text-white" },
    { label: "Favorites", value: String(user?.favoriteTeams?.length ?? 0), color: "text-[#f5c542]" },
    { label: "Wins", value: String(user?.stats?.winsPredicted ?? 0), color: "text-green-400" },
  ];

  return (
    <View className="mb-5">
      {isLoggedIn && user ? (
        <View className="bg-neutral-900/70 rounded-3xl p-5 border border-neutral-800/60 shadow-lg shadow-black/30">
          <View className="flex-row items-center mb-5">
            <View className="w-16 h-16 rounded-full bg-[#f5c542] justify-center items-center mr-4">
              <Ionicons name="person" size={28} color="#000" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center space-x-2 flex-wrap">
                <Text className="text-white text-xl font-bold tracking-wide">{user.username}</Text>
                {user.role && user.role !== "user" && (
                  <View className="bg-amber-500/20 px-2 py-0.5 rounded-md">
                    <Text className="text-amber-400 text-[10px] font-black uppercase tracking-wider">{user.role}</Text>
                  </View>
                )}
              </View>
              <Text className="text-neutral-400 text-sm">{user.email}</Text>
            </View>
            <Pressable onPress={onLogout} className="p-2 rounded-full bg-red-950/30 border border-red-900/40">
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>

          <View className="flex-row space-x-3">
            {statsList.map((stat, i) => (
              <View key={i} className="flex-1 bg-black/40 border border-neutral-800/60 p-3 rounded-2xl items-center">
                <Text className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</Text>
                <Text className={`${stat.color} text-xl font-black mt-1`}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View className="bg-neutral-900/50 rounded-3xl p-6 border border-neutral-800/60 shadow-xl items-center">
          <Text className="text-white text-2xl font-bold tracking-tight mb-1">Welcome to CricPlus</Text>
          <Text className="text-neutral-400 text-xs text-center max-w-[260px] mb-5 leading-5">
            Sign in to track your favorite teams, get live alerts, and personalize your feed.
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onLogin} className="w-full py-4 rounded-2xl bg-[#f5c542]">
            <Text className="text-black font-bold text-sm tracking-wide text-center">Login / Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-6 mb-3">
        <Text className="text-white text-xl font-bold tracking-tight">Today's Fixtures</Text>
        <Pressable className="flex-row items-center space-x-1">
          {({ pressed }) => (
            <>
              <Text className={`text-xs font-semibold ${pressed ? "text-white" : "text-[#f5c542]"}`}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color={pressed ? "#fff" : "#f5c542"} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
});