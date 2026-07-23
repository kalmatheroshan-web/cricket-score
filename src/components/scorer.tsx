import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  RotateCcw,
  Zap,
  Activity,
  X,
  Target,
  ShieldAlert,
  Users,
  ChevronDown,
} from "lucide-react-native";
import { io, Socket } from "socket.io-client";
import { showToast } from "../services/api/apis";
import { getScorer } from "../services/api/auth";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

interface MatchState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number; // 0 to 5
  currentInnings: number;
  currentStriker: string;
  currentNonStriker: string;
  currentBowler: string;
}

interface Player {
  id: string;
  name: string;
  role?: string;
}

export default function Scorer() {
  const router = useRouter();
  const { matchId = "demo_match_1" } = useLocalSearchParams<{ matchId: string }>();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Match State
  const [matchState, setMatchState] = useState<MatchState>({
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    currentInnings: 1,
    currentStriker: "Select Striker",
    currentNonStriker: "Select Non-Striker",
    currentBowler: "Select Bowler",
  });

  const [recentBalls, setRecentBalls] = useState<string[]>([]);

  // Player Selection Modal State
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);
  const [playerModal, setPlayerModal] = useState<{
    visible: boolean;
    type: "striker" | "nonStriker" | "bowler" | null;
  }>({ visible: false, type: null });

  // Fetch Team Players from API
  const fetchTeamPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const response = await getScorer();
      if (response?.data && Array.isArray(response.data)) {
        setPlayersList(response.data);
      } else {
        // Fallback demo roster
        setPlayersList([
          { id: "1", name: "Rohit Sharma", role: "Batsman" },
          { id: "2", name: "Shubman Gill", role: "Batsman" },
          { id: "3", name: "Virat Kohli", role: "Batsman" },
          { id: "4", name: "KL Rahul", role: "Wicketkeeper" },
          { id: "5", name: "Hardik Pandya", role: "All-rounder" },
          { id: "6", name: "Jasprit Bumrah", role: "Bowler" },
          { id: "7", name: "Mohammed Siraj", role: "Bowler" },
        ]);
      }
    } catch (error) {
      console.error("Failed to load players:", error);
      showToast("error", "Could not fetch roster");
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    fetchTeamPlayers();
  }, []);

  // Socket Connection Setup
  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      showToast("success", "Connected to Live Scoring Server");

      // Join the room for this specific match
      socketInstance.emit("join_match", matchId);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      showToast("error", "Disconnected from Server");
    });

    // Listen for incoming score updates from server
    socketInstance.on("score_update", (data: Partial<MatchState> & { ballOutcome?: string }) => {
      if (data) {
        setMatchState((prev) => ({
          ...prev,
          runs: data.runs ?? prev.runs,
          wickets: data.wickets ?? prev.wickets,
          overs: data.overs !== undefined ? Math.floor(data.overs) : prev.overs,
          balls: data.overs !== undefined ? Math.round((data.overs % 1) * 10) : prev.balls,
          currentInnings: data.currentInnings ?? prev.currentInnings,
          currentStriker: data.currentStriker ?? prev.currentStriker,
          currentNonStriker: data.currentNonStriker ?? prev.currentNonStriker,
          currentBowler: data.currentBowler ?? prev.currentBowler,
        }));

        if (data.ballOutcome) {
          setRecentBalls((prev) => [data.ballOutcome!, ...prev.slice(0, 5)]);
        }
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit("leave_match", matchId);
      socketInstance.disconnect();
    };
  }, [matchId]);

  // Emit Score Update to Server
  const emitMatchState = useCallback(
    (newState: MatchState, ballOutcome: string) => {
      const formattedOvers = parseFloat(`${newState.overs}.${newState.balls}`);

      const payload = {
        matchId,
        runs: newState.runs,
        wickets: newState.wickets,
        overs: formattedOvers,
        currentInnings: newState.currentInnings,
        currentStriker: newState.currentStriker,
        currentNonStriker: newState.currentNonStriker,
        currentBowler: newState.currentBowler,
        ballOutcome,
      };

      if (socket && isConnected) {
        socket.emit("update_score", payload);
      }
    },
    [socket, isConnected, matchId]
  );

  // Swap Strike
  const swapStrike = () => {
    setMatchState((prev) => ({
      ...prev,
      currentStriker: prev.currentNonStriker,
      currentNonStriker: prev.currentStriker,
    }));
  };

  // Score Handlers
  const handleAddRun = (runValue: number) => {
    setMatchState((prev) => {
      let nextBalls = prev.balls + 1;
      let nextOvers = prev.overs;

      const overCompleted = nextBalls >= 6;
      if (overCompleted) {
        nextOvers += 1;
        nextBalls = 0;
      }

      // Rotate strike on odd runs or when an over completes
      const shouldSwapForRuns = runValue % 2 !== 0;
      const finalSwap = overCompleted ? !shouldSwapForRuns : shouldSwapForRuns;

      const updated: MatchState = {
        ...prev,
        runs: prev.runs + runValue,
        balls: nextBalls,
        overs: nextOvers,
        currentStriker: finalSwap ? prev.currentNonStriker : prev.currentStriker,
        currentNonStriker: finalSwap ? prev.currentStriker : prev.currentNonStriker,
      };

      emitMatchState(updated, String(runValue));
      return updated;
    });

    setRecentBalls((prev) => [String(runValue), ...prev.slice(0, 5)]);
  };

  const handleWicket = () => {
    if (matchState.wickets >= 10) {
      Alert.alert("Innings Ended", "10 wickets have fallen.");
      return;
    }

    setMatchState((prev) => {
      let nextBalls = prev.balls + 1;
      let nextOvers = prev.overs;

      if (nextBalls >= 6) {
        nextOvers += 1;
        nextBalls = 0;
      }

      const updated: MatchState = {
        ...prev,
        wickets: prev.wickets + 1,
        balls: nextBalls,
        overs: nextOvers,
        currentStriker: "Select New Striker",
      };

      emitMatchState(updated, "W");
      return updated;
    });

    setRecentBalls((prev) => ["W", ...prev.slice(0, 5)]);
    showToast("error", "Wicket!", `Wicket #${matchState.wickets + 1} fallen.`);
  };

  const handleExtra = (type: "WD" | "NB") => {
    setMatchState((prev) => {
      const updated: MatchState = {
        ...prev,
        runs: prev.runs + 1,
      };
      emitMatchState(updated, type);
      return updated;
    });

    setRecentBalls((prev) => [type, ...prev.slice(0, 5)]);
  };

  const selectPlayer = (playerName: string) => {
    if (!playerModal.type) return;

    setMatchState((prev) => {
      const keyMap = {
        striker: "currentStriker",
        nonStriker: "currentNonStriker",
        bowler: "currentBowler",
      };

      const updated = {
        ...prev,
        [keyMap[playerModal.type!]]: playerName,
      };
      emitMatchState(updated, "PLAYER_CHANGE");
      return updated;
    });

    setPlayerModal({ visible: false, type: null });
  };

  // Run calculation helper
  const totalBallsBowled = matchState.overs * 6 + matchState.balls;
  const currentRunRate = totalBallsBowled > 0 ? ((matchState.runs / totalBallsBowled) * 6).toFixed(1) : "0.0";

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top"]}>
      {/* HEADER */}
      <View className="bg-white border-b border-slate-200 px-5 py-3.5 flex-row items-center justify-between shadow-xs">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 items-center justify-center active:bg-slate-100"
        >
          <ArrowLeft size={18} color="#0f172a" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Official Console
          </Text>
          <Text className="text-sm font-extrabold text-slate-900">
            Innings {matchState.currentInnings}
          </Text>
        </View>

        {/* Live Status Indicator */}
        <View
          className={`flex-row items-center px-3 py-1 rounded-full border ${isConnected ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
            }`}
        >
          {isConnected ? <Wifi size={12} color="#059669" /> : <WifiOff size={12} color="#e11d48" />}
          <Text
            className={`text-[10px] font-bold ml-1.5 uppercase ${isConnected ? "text-emerald-700" : "text-rose-700"
              }`}
          >
            {isConnected ? "Live" : "Offline"}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* SCOREBOARD CARD */}
        <View className="bg-slate-900 rounded-3xl p-5 shadow-lg mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">
                Total Score
              </Text>
              <View className="flex-row items-baseline">
                <Text className="text-5xl font-black text-white tracking-tight">
                  {matchState.runs}
                </Text>
                <Text className="text-3xl font-black text-amber-500 ml-1">
                  /{matchState.wickets}
                </Text>
              </View>
            </View>

            <View className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl items-end">
              <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                Overs
              </Text>
              <Text className="text-2xl font-black text-white">
                {matchState.overs}.{matchState.balls}
              </Text>
              <Text className="text-[9px] text-amber-400 font-bold mt-0.5">
                CRR: {currentRunRate}
              </Text>
            </View>
          </View>

          {/* Recent Balls Bar */}
          <View className="mt-5 pt-3.5 border-t border-slate-800 flex-row items-center justify-between">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
              This Over
            </Text>

            <View className="flex-row gap-1.5">
              {recentBalls.length === 0 ? (
                <Text className="text-slate-500 text-xs font-medium italic">
                  Awaiting ball...
                </Text>
              ) : (
                recentBalls.map((ball, idx) => {
                  const isWicket = ball === "W";
                  const isBoundary = ball === "4" || ball === "6";

                  return (
                    <View
                      key={idx}
                      className={`w-7 h-7 rounded-lg items-center justify-center border ${isWicket
                        ? "bg-rose-500 border-rose-600"
                        : isBoundary
                          ? "bg-amber-500 border-amber-600"
                          : "bg-slate-800 border-slate-700"
                        }`}
                    >
                      <Text
                        className={`text-xs font-black ${isWicket || isBoundary ? "text-white" : "text-slate-200"
                          }`}
                      >
                        {ball}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        {/* ACTIVE PLAYERS BOARD */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 px-1">
            <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
              Active Pitch
            </Text>
            <TouchableOpacity onPress={swapStrike} className="flex-row items-center gap-1 active:opacity-70">
              <RotateCcw size={12} color="#d97706" />
              <Text className="text-amber-600 text-xs font-bold">Swap Strike</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white border border-slate-200 rounded-3xl p-3 shadow-xs space-y-2">
            {/* Striker */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPlayerModal({ visible: true, type: "striker" })}
              className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-xl bg-amber-500 items-center justify-center">
                  <Zap size={16} color="#ffffff" />
                </View>
                <View>
                  <Text className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                    Striker ★
                  </Text>
                  <Text className="text-slate-900 font-bold text-sm">
                    {matchState.currentStriker}
                  </Text>
                </View>
              </View>
              <ChevronDown size={16} color="#d97706" />
            </TouchableOpacity>

            {/* Non-Striker */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPlayerModal({ visible: true, type: "nonStriker" })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex-row items-center justify-between mt-2"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-xl bg-slate-200 items-center justify-center">
                  <Target size={16} color="#475569" />
                </View>
                <View>
                  <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Non-Striker
                  </Text>
                  <Text className="text-slate-800 font-bold text-sm">
                    {matchState.currentNonStriker}
                  </Text>
                </View>
              </View>
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>

            {/* Bowler */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPlayerModal({ visible: true, type: "bowler" })}
              className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex-row items-center justify-between mt-2"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-xl bg-slate-200 items-center justify-center">
                  <Activity size={16} color="#475569" />
                </View>
                <View>
                  <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Bowler
                  </Text>
                  <Text className="text-slate-800 font-bold text-sm">
                    {matchState.currentBowler}
                  </Text>
                </View>
              </View>
              <ChevronDown size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SCORING ACTIONS GRID */}
        <View className="mb-6">
          <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-2.5 ml-1">
            Scoring Actions
          </Text>

          {/* Runs Grid */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            {[0, 1, 2, 3, 4, 6].map((run) => (
              <TouchableOpacity
                key={run}
                activeOpacity={0.7}
                onPress={() => handleAddRun(run)}
                className={`flex-1 min-w-[28%] h-14 rounded-2xl items-center justify-center border shadow-xs ${run === 4 || run === 6
                  ? "bg-amber-500 border-amber-600 active:bg-amber-600"
                  : "bg-white border-slate-200 active:bg-slate-100"
                  }`}
              >
                <Text
                  className={`text-xl font-black ${run === 4 || run === 6 ? "text-white" : "text-slate-900"
                    }`}
                >
                  +{run}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wickets & Extras Row */}
          <View className="flex-row gap-2 mb-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleWicket}
              className="flex-1 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex-row items-center justify-center gap-2 active:bg-rose-100"
            >
              <ShieldAlert size={18} color="#e11d48" />
              <Text className="text-rose-700 font-black text-xs">WICKET</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleExtra("WD")}
              className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl items-center justify-center active:bg-slate-50"
            >
              <Text className="text-slate-800 font-bold text-xs">WIDE (+1)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleExtra("NB")}
              className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl items-center justify-center active:bg-slate-50"
            >
              <Text className="text-slate-800 font-bold text-xs">NO BALL (+1)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* PLAYER ROSTER SELECTOR MODAL */}
      <Modal visible={playerModal.visible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[70%] p-5 border-t border-slate-200">
            <View className="flex-row justify-between items-center pb-4 border-b border-slate-100">
              <View className="flex-row items-center gap-2">
                <Users size={18} color="#d97706" />
                <Text className="text-slate-900 font-black text-base uppercase">
                  Select {playerModal.type}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPlayerModal({ visible: false, type: null })}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {loadingPlayers ? (
              <View className="py-10 items-center">
                <ActivityIndicator color="#d97706" />
                <Text className="text-slate-400 text-xs mt-2 font-medium">
                  Loading roster...
                </Text>
              </View>
            ) : (
              <FlatList
                data={playersList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => selectPlayer(item.name)}
                    className="p-3.5 border-b border-slate-100 flex-row items-center justify-between active:bg-amber-50 rounded-xl"
                  >
                    <Text className="text-slate-900 font-bold text-sm">
                      {item.name}
                    </Text>
                    {item.role && (
                      <Text className="text-slate-400 text-xs font-medium">
                        {item.role}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}