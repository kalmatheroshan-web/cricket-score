import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TeamProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 bg-white p-5 justify-center items-center">
      <Text className="text-xl font-bold text-slate-900">Team Profile</Text>
      <Text className="text-sm text-orange-600 mt-2">Team ID: {id}</Text>
    </View>
  );
}