import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Shield, Award, UserPlus, Trash2, CheckCircle2 } from 'lucide-react-native';

interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  jerseyNumber: string;
}

export default function TeamBuilderUi() {
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'>('Batsman');
  const [jerseyNumber, setJerseyNumber] = useState('');
  
  // Array storing the dynamically added players
  const [roster, setRoster] = useState<Player[]>([]);

  // Add player handler with validation logic
  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      Alert.alert('Missing Detail', 'Please enter a player name.');
      return;
    }
    if (roster.length >= 12) {
      Alert.alert('Squad Full', 'A premium match squad is capped at a maximum of 12 players.');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerName.trim(),
      role: playerRole,
      jerseyNumber: jerseyNumber.trim() || 'N/A'
    };

    setRoster([...roster, newPlayer]);
    
    // Reset quick-add sub-form inputs
    setPlayerName('');
    setJerseyNumber('');
  };

  // Remove player handler
  const handleRemovePlayer = (id: string) => {
    setRoster(roster.filter(player => player.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Header Console */}
        <View className="my-6">
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Squad Architect
          </Text>
          <Text className="text-zinc-400 text-sm mt-1">
            Build out your core 11-12 player team specifications
          </Text>
        </View>

        {/* 1. Team Metadata Bento Card */}
        <View className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 mb-5 shadow-xl">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl mr-3">
                <Shield size={20} color="#3b82f6" />
              </View>
              <Text className="text-white font-semibold text-base">Club Identity</Text>
            </View>
            
            {/* Squad Size Premium Indicator Counter */}
            <View className={`px-3 py-1 rounded-full border ${
              roster.length >= 11 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'
            }`}>
              <Text className={`text-xs font-bold ${roster.length >= 11 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {roster.length} / 12 Members
              </Text>
            </View>
          </View>

          <TextInput
            value={teamName}
            onChangeText={setTeamName}
            placeholder="e.g., Astra Titans Franchise"
            placeholderTextColor="#52525b"
            className="bg-zinc-950 border border-zinc-800 text-white px-4 py-3.5 rounded-2xl font-medium focus:border-blue-500"
          />
        </View>

        {/* 2. Dynamic Player Ingestion Form Box */}
        <View className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 mb-5 shadow-xl">
          <View className="flex-row items-center mb-4">
            <View className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl mr-3">
              <UserPlus size={20} color="#a855f7" />
            </View>
            <Text className="text-white font-semibold text-base">Draft New Player</Text>
          </View>

          <View className="space-y-4">
            {/* Row: Name and Jersey */}
            <View className="flex flex-row justify-between">
              <View className="w-[68%]">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">Player Name</Text>
                <TextInput
                  value={playerName}
                  onChangeText={setPlayerName}
                  placeholder="Full Name"
                  placeholderTextColor="#52525b"
                  className="bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-xl font-medium text-sm"
                />
              </View>
              <View className="w-[28%]">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">Jersey #</Text>
                <TextInput
                  value={jerseyNumber}
                  onChangeText={setJerseyNumber}
                  placeholder="07"
                  keyboardType="numeric"
                  placeholderTextColor="#52525b"
                  className="bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-xl font-medium text-sm text-center"
                />
              </View>
            </View>

            {/* Role Custom Switcher Segment */}
            <View className="mt-3">
              <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Specialization Role</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] as const).map((role) => {
                  const isActive = playerRole === role;
                  return (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setPlayerRole(role)}
                      className={`px-3 py-2 rounded-xl border ${
                        isActive ? 'bg-purple-500/20 border-purple-500' : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${isActive ? 'text-purple-300' : 'text-zinc-400'}`}>
                        {role}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Trigger Button to Inject to State List */}
            <TouchableOpacity
              onPress={handleAddPlayer}
              activeOpacity={0.8}
              className="bg-zinc-800 border border-zinc-700 p-3.5 rounded-xl flex-row justify-center items-center mt-4"
            >
              <Plus size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-semibold text-sm">Add Player to Lineup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Live Active Roster Render List */}
        <View className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 mb-8">
          <Text className="text-zinc-400 font-semibold text-sm mb-4">Current Roster Pipeline</Text>
          
          {roster.length === 0 ? (
            <View className="py-8 items-center justify-center">
              <Users size={32} color="#27272a" />
              <Text className="text-zinc-600 text-xs mt-2 text-center">No structural records added yet. Add at least 11 players to qualify.</Text>
            </View>
          ) : (
            <View className="space-y-2.5">
              {roster.map((player, index) => (
                <View 
                  key={player.id} 
                  className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-2xl flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center flex-1 pr-4">
                    {/* Index Counter Badge */}
                    <View className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 items-center justify-center mr-3">
                      <Text className="text-zinc-400 text-[10px] font-bold">{index + 1}</Text>
                    </View>
                    
                    <View>
                      <Text className="text-white font-semibold text-sm tracking-wide">{player.name}</Text>
                      <View className="flex-row items-center mt-0.5">
                        <Text className="text-purple-400 text-[11px] font-medium mr-2">{player.role}</Text>
                        <Text className="text-zinc-600 text-[11px]"># {player.jerseyNumber}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Remove Operation Action Button */}
                  <TouchableOpacity 
                    onPress={() => handleRemovePlayer(player.id)}
                    className="p-2 bg-red-500/10 rounded-xl"
                  >
                    <Trash2 size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Final Global Submission Action */}
        <TouchableOpacity 
          disabled={roster.length < 11}
          activeOpacity={0.8}
          className={`p-4 rounded-2xl flex-row justify-center items-center shadow-lg mb-10 ${
            roster.length >= 11 ? 'bg-blue-600 shadow-blue-500/10' : 'bg-zinc-800 opacity-40'
          }`}
        >
          <CheckCircle2 size={18} color="#fff" className="mr-2" />
          <Text className="text-white font-bold text-base tracking-wide">
            Save and Initialize Roster
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}