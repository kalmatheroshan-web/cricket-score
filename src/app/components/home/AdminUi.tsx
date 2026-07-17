import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Calendar, Trophy, ChevronRight, Check } from 'lucide-react-native';

interface TeamPlayer {
  id: string;
  name: string;
  jerseyNumber: number|undefined;
}

export default function AdminUi() {
  const [matchTitle, setMatchTitle] = useState('');
  const [selectedBatsman, setSelectedBatsman] = useState<string | null>(null);
  const [selectedBowler, setSelectedBowler] = useState<string | null>(null);

  const [players, setPlayers] = useState<TeamPlayer[]>([]);

  useEffect(() => {
    // Mock fetching players from backend or Redux store
    // setPlayers(fetchedPlayers);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
  
        {/* Header Section */}
        <View className="my-6">
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Match Console
          </Text>
          <Text className="text-zinc-400 text-sm mt-1">
            Create fixtures and initialize opening roster lineups
          </Text>
        </View>

        {/* Bento Card 1: Match Meta Setup */}
        <View className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 mb-5 shadow-xl">
          <View className="flex-row items-center mb-4">
            <View className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl mr-3">
              <Trophy size={20} color="#3b82f6" />
            </View>
            <Text className="text-white font-semibold text-base">Match Details</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Fixture Title
              </Text>
              <TextInput
                value={matchTitle}
                onChangeText={setMatchTitle}
                placeholder="e.g., Grand Finale | Astra Titans vs Knights"
                placeholderTextColor="#52525b"
                className="bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-2xl font-medium focus:border-blue-500"
              />
            </View>
          </View>
        </View>

        {/* Bento Card 2: Player Assignment Roster split into columns */}
        <View className="flex-row justify-between mb-6">

          {/* Batsman Selection Column */}
          <View className="w-[48%] bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg mr-2">
                <Users size={16} color="#f59e0b" />
              </View>
              <Text className="text-white font-semibold text-sm">Opening Batsman</Text>
            </View>

            <ScrollView className="max-h-48" nestedScrollEnabled={true}>
              <View className="space-y-2">
                {players.map((player) => {
                  const isSelected = selectedBatsman === player.id;
                  return (
                    <Pressable
                      key={`bat-${player.id}`}
                      onPress={() => setSelectedBatsman(player.id)}
                      className={`p-3 rounded-xl flex-row justify-between items-center border ${isSelected
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-zinc-950 border-zinc-900'
                        }`}
                    >
                      <View className="flex-row items-center">
                        <Text className={`text-xs font-medium ${isSelected ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {player.name}
                        </Text>
                        {player.jerseyNumber !== undefined && (
                          <Text className="text-xs text-zinc-500 ml-2">#{player.jerseyNumber}</Text>
                        )}
                      </View>
                      {isSelected && <Check size={12} color="#f59e0b" />}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Bowler Selection Column */}
          <View className="w-[48%] bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mr-2">
                <Users size={16} color="#10b981" />
              </View>
              <Text className="text-white font-semibold text-sm">Opening Bowler</Text>
            </View>

            <ScrollView className="max-h-48" nestedScrollEnabled={true}>
              <View className="space-y-2">
                {players.map((player) => {
                  const isSelected = selectedBowler === player.id;
                  return (
                    <Pressable
                      key={`bowl-${player.id}`}
                      onPress={() => setSelectedBowler(player.id)}
                      className={`p-3 rounded-xl flex-row justify-between items-center border ${isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-zinc-950 border-zinc-900'
                        }`}
                    >
                      <Text className={`text-xs font-medium ${isSelected ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {player.name}
                      </Text>
                      {isSelected && <Check size={12} color="#10b981" />}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

        </View>

        {/* Live Preview Summary Card */}
        <View className="bg-zinc-900/40 border border-zinc-800/60 border-dashed rounded-3xl p-5 mb-8">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Live Overview Pipeline
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Match Title:</Text>
              <Text className="text-white text-xs font-medium">{matchTitle || 'Untitled Match'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Striker Assigned:</Text>
              <Text className="text-amber-400 text-xs font-semibold">
                {players.find(p => p.id === selectedBatsman)?.name || 'Unassigned'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Attack Bowler:</Text>
              <Text className="text-emerald-400 text-xs font-semibold">
                {players.find(p => p.id === selectedBowler)?.name || 'Unassigned'}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-blue-600 p-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-blue-500/20 mb-10"
        >
          <Plus size={18} color="#fff" className="mr-2" />
          <Text className="text-white font-bold text-base tracking-wide">
            Initialize & Launch Match
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}