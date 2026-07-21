import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Shield, Trophy, ChevronRight, Activity } from "lucide-react-native";
import Calendar from "../../../icons/Calander"; // Retained your original import path

// Standard date generator for the horizontal calendar selector
const generateNextDays = (count = 7) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      fullDate: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
    });
  }
  return days;
};

export default function Adminui() {
  const router = useRouter();
  const dateList = generateNextDays(7);

  // Local state matching the props expected by your Calendar component/system
  // Calendar expects a Date, so store selectedDate as a Date instance
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(dateList[0].fullDate));

  return (
    <View className="flex-1 bg-zinc-50">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="px-6 py-6 flex-grow"
            showsVerticalScrollIndicator={false}
          >
            {/* Header / Brand Section */}
            <View className="mb-6 flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center space-x-1 mb-1">
                  <Text className="text-xl font-black text-orange-600 tracking-tight">
                    Cric
                  </Text>
                  <Text className="text-xl font-black text-zinc-900 tracking-tight">
                    Show
                  </Text>
                  <View className="h-1.5 w-1.5 rounded-full bg-orange-500 ml-0.5" />
                </View>
                <Text className="text-2xl font-bold tracking-tight text-zinc-900">
                  Admin Console
                </Text>
              </View>

              <View className="bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200/60 flex-row items-center">
                <Shield size={14} color="#ea580c" />
                <Text className="text-xs font-semibold text-orange-700 ml-1.5">
                  Live Access
                </Text>
              </View>
            </View>

            {/* Quick Metrics Bar */}
            <View className="flex-row space-x-3 mb-6">
              <View className="flex-1 bg-white p-4 rounded-2xl border border-zinc-200/70">
                <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Live Matches
                </Text>
                <View className="flex-row items-center mt-1">
                  <Activity size={16} color="#16a34a" />
                  <Text className="text-xl font-black text-zinc-900 ml-1.5">
                    03
                  </Text>
                </View>
              </View>

              <View className="flex-1 bg-white p-4 rounded-2xl border border-zinc-200/70">
                <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Tournaments
                </Text>
                <View className="flex-row items-center mt-1">
                  <Trophy size={16} color="#ea580c" />
                  <Text className="text-xl font-black text-zinc-900 ml-1.5">
                    08
                  </Text>
                </View>
              </View>
            </View>

            {/* Schedule & Date Selection Card */}
            <View className="bg-white rounded-3xl border border-zinc-200/70 p-4 mb-6">
              <View className="flex-row items-center justify-between mb-4 px-1">
                <View className="flex-row items-center space-x-2">
                  <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                  <Text className="text-sm font-bold text-zinc-900 ml-2">
                    Match Schedule
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-zinc-400">
                  {selectedDate.toISOString().split("T")[0]}
                </Text>
              </View>

              {/* Horizontal Strip for Quick Date Switching */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {dateList.map((item) => {
                  const isSelected = item.fullDate === selectedDate.toISOString().split("T")[0];
                  return (
                    <TouchableOpacity
                      key={item.fullDate}
                      onPress={() => setSelectedDate(new Date(item.fullDate))}
                      activeOpacity={0.8}
                      className={`items-center justify-center py-2.5 px-4 rounded-2xl mr-2 border ${isSelected
                          ? "bg-zinc-900 border-zinc-900"
                          : "bg-zinc-50 border-zinc-200/60"
                        }`}
                    >
                      <Text
                        className={`text-[10px] font-bold uppercase ${isSelected ? "text-zinc-400" : "text-zinc-400" }`}
                      >
                        {item.dayName}
                      </Text>
                      <Text
                        className={`text-base font-bold mt-0.5 ${isSelected ? "text-white" : "text-zinc-900" }`}
                      >
                        {item.dayNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={() => console.log("Create New Match Pressed")}
              className="bg-zinc-900 h-14 rounded-2xl items-center justify-center flex-row mb-6 active:opacity-90"
              android_ripple={{ color: "#3f3f46" }}
            >
              <Plus color="#ffffff" size={18} />
              <Text className="text-white font-semibold text-sm tracking-wide ml-2">
                Create New Match
              </Text>
            </Pressable>

            {/* Architectural Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-[0.5px] bg-zinc-200" />
              <Text className="text-[10px] font-bold text-zinc-300 mx-4 uppercase tracking-widest">
                Quick Actions
              </Text>
              <View className="flex-1 h-[0.5px] bg-zinc-200" />
            </View>

            {/* Action Item Group */}
            <View className="space-y-3">
              <Pressable
                className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-zinc-200/70 active:bg-zinc-50 mb-3"
                android_ripple={{ color: "#f4f4f5" }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 items-center justify-center mr-3">
                    <Trophy color="#ea580c" size={20} />
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-zinc-900 tracking-tight">
                      Manage Squads & Teams
                    </Text>
                    <Text className="text-[11px] text-zinc-400 mt-0.5">
                      Update rosters and playing XI
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#a1a1aa" size={18} />
              </Pressable>

              <Pressable
                className="bg-white rounded-2xl p-4 flex-row items-center justify-between border border-zinc-200/70 active:bg-zinc-50 mb-3"
                android_ripple={{ color: "#f4f4f5" }}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/60 items-center justify-center mr-3">
                    <Activity color="#18181b" size={20} />
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-zinc-900 tracking-tight">
                      Live Scoring Override
                    </Text>
                    <Text className="text-[11px] text-zinc-400 mt-0.5">
                      Manual ball-by-ball updates
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#a1a1aa" size={18} />
              </Pressable>
            </View>

            {/* Disclaimer / Tail Note */}
            <Text className="text-center text-[11px] text-zinc-400 mt-8 leading-relaxed px-4">
              Logged in with Administrator Privileges. {"\n"}
              Changes affect real-time match data across all streams.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}