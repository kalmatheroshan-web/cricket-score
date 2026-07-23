import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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

// Helper to extract runs, wickets, overs from a score object
const parseScore = (scoreObj: any) => {
  if (!scoreObj) return { runs: 0, wickets: 0, overs: 0, balls: 0 };
  const runs = scoreObj.runs ?? 0;
  const wickets = scoreObj.wickets ?? 0;
  const overs = scoreObj.overs ?? 0; // could be decimal, e.g., 16.2
  const whole = Math.floor(overs);
  const decimal = Math.round((overs % 1) * 10) || 0; // balls (0-5)
  return { runs, wickets, overs: whole, balls: decimal };
};

export default function Scorer({ match }: { match: any }) {
  const router = useRouter();

  if (!match) {
    Alert.alert("Error", "No match data provided.");
    router.back();
    return null;
  }

  const matchId = match._id;

  // Determine batting and bowling teams based on score.battingTeam / bowlingTeam
  const battingTeamId = match.score?.battingTeam;
  const bowlingTeamId = match.score?.bowlingTeam;

  // Find the actual team objects (assuming they are populated)
  const team1 = match.team1;
  const team2 = match.team2;

  // Determine which team is batting and which is bowling
  let battingTeam = null;
  let bowlingTeam = null;
  if (battingTeamId && team1 && team2) {
    if (team1._id === battingTeamId) {
      battingTeam = team1;
      bowlingTeam = team2;
    } else if (team2._id === battingTeamId) {
      battingTeam = team2;
      bowlingTeam = team1;
    }
  }
  // Fallback: if not determined, assume team1 bats, team2 bowls
  if (!battingTeam) {
    battingTeam = team1;
    bowlingTeam = team2;
  }

  // Extract players
  const battingPlayers = battingTeam?.players || [];
  const bowlingPlayers = bowlingTeam?.players || [];

  // Build player lists for selection modal (with proper mapping)
  const buildPlayerList = (players: any[]) =>
    players.map((p: any) => ({
      id: p._id || p.id,
      name: p.name || p.playerName || "Unnamed",
      role: p.role || p.roleName || "",
    }));

  const battingPlayerOptions = buildPlayerList(battingPlayers);
  const bowlingPlayerOptions = buildPlayerList(bowlingPlayers);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize match state from match.score
  const initialScore = match.score || {};
  const currentInnings = initialScore.currentInnings || 1;
  const inningsKey = currentInnings === 1 ? "team1Score" : "team2Score";
  const scoreData = initialScore[inningsKey] || {};
  const { runs, wickets, overs, balls } = parseScore(scoreData);

  const [matchState, setMatchState] = useState<MatchState>({
    runs,
    wickets,
    overs,
    balls,
    currentInnings,
    currentStriker: "Select Striker",
    currentNonStriker: "Select Non-Striker",
    currentBowler: "Select Bowler",
  });

  const [recentBalls, setRecentBalls] = useState<string[]>([]);
  const [playerModal, setPlayerModal] = useState<{
    visible: boolean;
    type: "striker" | "nonStriker" | "bowler" | null;
  }>({ visible: false, type: null });

  // Get the appropriate player list based on modal type
  const getPlayerListForModal = () => {
    if (!playerModal.type) return [];
    if (playerModal.type === "striker" || playerModal.type === "nonStriker") {
      return battingPlayerOptions;
    }
    if (playerModal.type === "bowler") {
      return bowlingPlayerOptions;
    }
    return [];
  };

  // Socket Connection Setup
  useEffect(() => {
    if (!matchId) return;

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      showToast("success", "Connected to Live Scoring Server");
      socketInstance.emit("join_match", matchId);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      showToast("error", "Disconnected from Server");
    });

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
    setMatchState((prev) => {
      const updated = {
        ...prev,
        currentStriker: prev.currentNonStriker,
        currentNonStriker: prev.currentStriker,
      };
      emitMatchState(updated, "SWAP");
      return updated;
    });
  };

  // Helper: add a ball outcome, handle over completion and recent balls reset
  const addBallOutcome = (outcome: string, overCompleted: boolean) => {
    // Add the new outcome to recent balls (for current over)
    setRecentBalls((prev) => [outcome, ...prev.slice(0, 5)]);
    // If over just completed, clear the recent balls (start fresh next over)
    if (overCompleted) {
      setRecentBalls([]);
    }
  };

  // Score Handlers
  const handleAddRun = (runValue: number) => {
    setMatchState((prev) => {
      let nextBalls = prev.balls + 1;
      let nextOvers = prev.overs;
      let overCompleted = false;

      if (nextBalls >= 6) {
        nextOvers += 1;
        nextBalls = 0;
        overCompleted = true;
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
      // Update recent balls after state update (but we need to know overCompleted)
      // We'll call addBallOutcome outside the setState because we have overCompleted here.
      // Actually we cannot call it inside setState because it's a state update itself.
      // We'll schedule it after the state update.
      setTimeout(() => {
        addBallOutcome(String(runValue), overCompleted);
      }, 0);

      return updated;
    });
  };

  const handleWicket = () => {
    if (matchState.wickets >= 10) {
      Alert.alert("Innings Ended", "10 wickets have fallen.");
      return;
    }

    setMatchState((prev) => {
      let nextBalls = prev.balls + 1;
      let nextOvers = prev.overs;
      let overCompleted = false;

      if (nextBalls >= 6) {
        nextOvers += 1;
        nextBalls = 0;
        overCompleted = true;
      }

      const updated: MatchState = {
        ...prev,
        wickets: prev.wickets + 1,
        balls: nextBalls,
        overs: nextOvers,
        currentStriker: "Select New Striker", // new batsman needed
      };

      emitMatchState(updated, "W");
      setTimeout(() => {
        addBallOutcome("W", overCompleted);
      }, 0);

      return updated;
    });

    showToast("error", "Wicket!", `Wicket #${matchState.wickets + 1} fallen.`);
  };

  const handleExtra = (type: "WD" | "NB") => {
    setMatchState((prev) => {
      const updated: MatchState = {
        ...prev,
        runs: prev.runs + 1,
      };
      emitMatchState(updated, type);
      // Extras don't count as a legal ball, so we don't increment balls or overs.
      // Also, we don't reset recent balls.
      setTimeout(() => {
        setRecentBalls((prevBalls) => [type, ...prevBalls.slice(0, 5)]);
      }, 0);
      return updated;
    });
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
          className={`flex-row items-center px-3 py-1 rounded-full border ${
            isConnected ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
          }`}
        >
          {isConnected ? <Wifi size={12} color="#059669" /> : <WifiOff size={12} color="#e11d48" />}
          <Text
            className={`text-[10px] font-bold ml-1.5 uppercase ${
              isConnected ? "text-emerald-700" : "text-rose-700"
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
                      className={`w-7 h-7 rounded-lg items-center justify-center border ${
                        isWicket
                          ? "bg-rose-500 border-rose-600"
                          : isBoundary
                          ? "bg-amber-500 border-amber-600"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      <Text
                        className={`text-xs font-black ${
                          isWicket || isBoundary ? "text-white" : "text-slate-200"
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
                className={`flex-1 min-w-[28%] h-14 rounded-2xl items-center justify-center border shadow-xs ${
                  run === 4 || run === 6
                    ? "bg-amber-500 border-amber-600 active:bg-amber-600"
                    : "bg-white border-slate-200 active:bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xl font-black ${
                    run === 4 || run === 6 ? "text-white" : "text-slate-900"
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

            <FlatList
              data={getPlayerListForModal()}
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}