import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  UserCheck,
  Swords,
  CheckCircle2,
  User,
  ChevronDown,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react-native";
import { createMatch } from "../services/api/match";
import { getScorer } from "../services/api/auth";

interface MatchFormData {
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  assignedScorer: string;
}

interface TeamPreset {
  id: string;
  teamName: string;
  shortName: string;
}

interface Scorer {
  _id: string;
  username?: string;
  state?: string;
  venues?: string[] | string;
  venue?: string[] | string;
}

// Preset Times for quick selection
const QUICK_TIMES = ["09:00", "11:30", "14:00", "16:15", "18:30", "20:00"];

function CreateMatch() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [popularTeams, setPopularTeams] = useState<TeamPreset[]>([]);
  const [quickScorers, setQuickScorers] = useState<Scorer[]>([]);
  const [availableVenues, setAvailableVenues] = useState<string[]>([]);
  const [venueSearchQuery, setVenueSearchQuery] = useState("");
  const [isLoadingScorers, setIsLoadingScorers] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modals state
  const [venuePickerVisible, setVenuePickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const todayStr = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<MatchFormData>({
    mode: "onChange",
    defaultValues: {
      team1: "",
      team2: "",
      date: todayStr,
      time: "16:15",
      venue: "",
      assignedScorer: "",
    },
  });

  const currentTeam1 = watch("team1");
  const currentTeam2 = watch("team2");
  const currentDate = watch("date");
  const currentTime = watch("time");
  const currentVenue = watch("venue");
  const selectedScorerId = watch("assignedScorer");

  const selectedScorerObj = useMemo(
    () => quickScorers.find((s) => String(s._id) === String(selectedScorerId)),
    [quickScorers, selectedScorerId]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingScorers(true);
        setFetchError(null);
        const response = await getScorer();

        if (response?.teams?.length) {
          setPopularTeams(
            response.teams.map((ele: any) => ({
              id: ele._id,
              teamName: ele.teamName,
              shortName: ele.shortName,
            }))
          );
        }

        // Global response.venues extraction
        if (response?.venues && Array.isArray(response.venues)) {
          setAvailableVenues(response.venues);
        }

        const loadedScorers = response?.scorers || response?.data || [];
        setQuickScorers(loadedScorers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load data. Please check your connection.");
      } finally {
        setIsLoadingScorers(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectScorer = useCallback(
    (scorer: Scorer, onChange: (id: string) => void) => {
      onChange(scorer._id);

      const scorerVenues = Array.isArray(scorer.venues)
        ? scorer.venues
        : Array.isArray(scorer.venue)
          ? scorer.venue
          : [];

      // Combine scorer venues with general available venues
      if (scorerVenues.length > 0) {
        setAvailableVenues((prev) => Array.from(new Set([...scorerVenues, ...prev])));
        setValue("venue", scorerVenues[0], { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleQuickTeamSelect = useCallback(
    (team: TeamPreset) => {
      const val = team.shortName || team.teamName || "";
      if (!currentTeam1) {
        setValue("team1", val, { shouldValidate: true });
      } else if (!currentTeam2 && val !== currentTeam1) {
        setValue("team2", val, { shouldValidate: true });
      }
    },
    [currentTeam1, currentTeam2, setValue]
  );

  // Filter venues by user search input inside modal
  const filteredVenues = useMemo(() => {
    if (!venueSearchQuery.trim()) return availableVenues;
    return availableVenues.filter((v) =>
      v.toLowerCase().includes(venueSearchQuery.toLowerCase())
    );
  }, [availableVenues, venueSearchQuery]);

  // Calendar Helper Functions
  const daysInMonth = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const date = new Date(year, month, 1);
    const days: (Date | null)[] = [];

    const firstDayIndex = date.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [calendarMonth]);

  const changeMonth = (delta: number) => {
    const next = new Date(calendarMonth);
    next.setMonth(next.getMonth() + delta);
    setCalendarMonth(next);
  };

  const onSubmit = async (data: MatchFormData) => {
    const team1Id = popularTeams.find(
      (ele) => ele.shortName === data.team1.trim()
    )?.id || "";
    const team2Id = popularTeams.find(
      (ele) => ele.shortName === data.team2.trim()
    )?.id || "";


    const payload = {
      team1: team1Id,
      team2: team2Id,
      dateTime: `${data.date}T${data.time}:00.000Z`,
      venue: data.venue.trim(),
      assignedScorer: data.assignedScorer,
    };

    try {
      await createMatch(payload);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create match.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50/70" edges={["top", "bottom"]}>
      {/* Top Header */}
      <View className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex-row items-center justify-between shadow-xs">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-slate-100/80 border border-slate-200/60 items-center justify-center active:bg-slate-200/80"
        >
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-base font-bold text-slate-900 tracking-tight">
            Configure Fixture
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Text className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
              Step 1
            </Text>
            <Text className="text-[10px] font-bold text-slate-300">•</Text>
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              2
            </Text>
          </View>
        </View>

        <View className="w-10 h-10 items-center justify-center">
          <Sparkles size={18} color="#d97706" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5 pt-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        >
          {/* Header Title */}
          <View className="mb-6">
            <Text className="text-3xl font-black text-slate-900 tracking-tight">
              Create Match
            </Text>
            <Text className="text-slate-500 text-sm mt-0.5 font-medium">
              Setup live parameters, venue, and assign official scorer
            </Text>
          </View>

          {/* TEAMS SECTION */}
          <View className="mb-6">
            <Text className="text-slate-400 uppercase text-[11px] font-bold tracking-wider mb-2.5 ml-1">
              Matchup Teams
            </Text>
            <View className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
              <View className="flex-row items-center justify-between gap-3">
                {/* Home Team */}
                <Controller
                  control={control}
                  name="team1"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                      <Text className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1">
                        Home Team
                      </Text>
                      <TextInput
                        className="text-slate-900 text-lg font-bold p-0 h-7"
                        placeholder="e.g. IND"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />

                {/* VS Badge */}
                <View className="w-9 h-9 rounded-full bg-slate-900 items-center justify-center border-2 border-white shadow-xs">
                  <Swords size={16} color="#f59e0b" />
                </View>

                {/* Away Team */}
                <Controller
                  control={control}
                  name="team2"
                  rules={{
                    required: true,
                    validate: (v) => v !== currentTeam1,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                      <Text className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-1">
                        Away Team
                      </Text>
                      <TextInput
                        className="text-slate-900 text-lg font-bold p-0 h-7"
                        placeholder="e.g. AUS"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
              </View>

              {/* Quick Teams Chip Carousel */}
              {popularTeams.length > 0 && (
                <View className="mt-4 pt-3.5 border-t border-slate-100">
                  <Text className="text-slate-400 text-[11px] font-semibold mb-2">
                    Quick Preset Select:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                  >
                    {popularTeams.map((team) => (
                      <TouchableOpacity
                        key={team.id}
                        activeOpacity={0.7}
                        onPress={() => handleQuickTeamSelect(team)}
                        className="bg-slate-100/80 active:bg-amber-50 px-3.5 py-2 rounded-xl mr-2 border border-slate-200/60"
                      >
                        <Text className="text-slate-700 text-xs font-bold">
                          + {team.shortName || team.teamName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* SCHEDULE & VENUE SECTION */}
          <View className="mb-6">
            <Text className="text-slate-400 uppercase text-[11px] font-bold tracking-wider mb-2.5 ml-1">
              Schedule & Location
            </Text>

            <View className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              {/* VENUE PICKER TRIGGER */}
              <View className="mb-3">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-7 h-7 rounded-lg bg-amber-50 items-center justify-center">
                    <MapPin size={15} color="#d97706" />
                  </View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                    Match Venue
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setVenuePickerVisible(true)}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 flex-row justify-between items-center"
                >
                  <Text
                    className={`font-semibold text-sm ${currentVenue ? "text-slate-900" : "text-slate-400"
                      }`}
                  >
                    {currentVenue || "Select Venue / Stadium"}
                  </Text>
                  <ChevronDown size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* Date & Time Picker Buttons */}
              <View className="flex-row gap-3 pt-1">
                {/* DATE PICKER TRIGGER */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-7 h-7 rounded-lg bg-slate-100 items-center justify-center">
                      <CalendarIcon size={15} color="#334155" />
                    </View>
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Date
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setDatePickerVisible(true)}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 flex-row justify-between items-center"
                  >
                    <Text className="text-slate-900 font-bold text-sm">
                      {currentDate || "YYYY-MM-DD"}
                    </Text>
                    <ChevronDown size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {/* TIME PICKER TRIGGER */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-7 h-7 rounded-lg bg-slate-100 items-center justify-center">
                      <ClockIcon size={15} color="#334155" />
                    </View>
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Time
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setTimePickerVisible(true)}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 flex-row justify-between items-center"
                  >
                    <Text className="text-slate-900 font-bold text-sm">
                      {currentTime || "HH:MM"}
                    </Text>
                    <ChevronDown size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* OFFICIAL SCORER SECTION */}
          <View className="mb-6">
            <Text className="text-slate-400 uppercase text-[11px] font-bold tracking-wider mb-2.5 ml-1">
              Official Match Scorer
            </Text>

            <Controller
              control={control}
              name="assignedScorer"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
                  <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-8 h-8 rounded-xl bg-amber-50 items-center justify-center">
                        <UserCheck size={18} color="#d97706" />
                      </View>
                      <Text className="text-slate-900 font-bold text-sm">
                        Select Scorer
                      </Text>
                    </View>

                    {selectedScorerObj && (
                      <View className="bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                        <Text className="text-[10px] font-bold text-amber-700">
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>

                  {isLoadingScorers && (
                    <View className="py-8 items-center justify-center">
                      <ActivityIndicator size="small" color="#d97706" />
                      <Text className="text-xs text-slate-400 mt-2 font-medium">
                        Loading match scorers...
                      </Text>
                    </View>
                  )}

                  {fetchError && (
                    <Text className="text-xs text-rose-500 my-2 font-medium">
                      {fetchError}
                    </Text>
                  )}

                  {!isLoadingScorers && quickScorers.length === 0 && !fetchError && (
                    <View className="py-6 items-center justify-center">
                      <User size={24} color="#94a3b8" />
                      <Text className="text-xs text-slate-400 mt-1 font-medium">
                        No scorers available
                      </Text>
                    </View>
                  )}

                  <ScrollView
                    style={{ maxHeight: 220 }}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {quickScorers.map((scorer) => {
                      const isSelected = value === scorer._id;
                      const initial = scorer.username?.[0]?.toUpperCase() || "?";

                      return (
                        <Pressable
                          key={scorer._id}
                          onPress={() => handleSelectScorer(scorer, onChange)}
                          className={`p-3.5 mb-2.5 rounded-2xl flex-row items-center justify-between border transition-all ${isSelected
                            ? "bg-amber-50/80 border-amber-500/80"
                            : "bg-slate-50/80 border-slate-200/60"
                            }`}
                        >
                          <View className="flex-row items-center gap-3">
                            <View
                              className={`w-10 h-10 rounded-xl items-center justify-center border ${isSelected
                                ? "bg-amber-500 border-amber-600"
                                : "bg-slate-200/70 border-slate-300/40"
                                }`}
                            >
                              <Text
                                className={`font-bold text-sm uppercase ${isSelected ? "text-white" : "text-slate-700"
                                  }`}
                              >
                                {initial}
                              </Text>
                            </View>
                            <View>
                              <Text className="text-slate-900 font-bold text-sm capitalize">
                                {scorer.username}
                              </Text>
                              {scorer.state && (
                                <Text className="text-slate-400 text-xs font-medium mt-0.5 capitalize">
                                  Region: {scorer.state}
                                </Text>
                              )}
                            </View>
                          </View>

                          {isSelected && (
                            <CheckCircle2 size={22} color="#d97706" />
                          )}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            />
          </View>

          {/* SUBMIT BUTTON */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className={`h-14 rounded-2xl items-center justify-center shadow-sm mt-2 ${isValid && !isSubmitting
              ? "bg-slate-900 active:bg-slate-800"
              : "bg-slate-200"
              }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className={`font-bold text-sm tracking-wide ${isValid && !isSubmitting ? "text-white" : "text-slate-400"
                  }`}
              >
                PUBLISH FIXTURE
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================= MODAL 1: CUSTOM VENUE PICKER ================= */}
      <Modal
        visible={venuePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVenuePickerVisible(false)}
      >
        <View className="flex-1 bg-slate-900/40 justify-end">
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="bg-white rounded-t-3xl max-h-[70%] p-5 shadow-xl border-t border-slate-100"
          >
            {/* Header */}
            <View className="pb-3 border-b border-slate-100 flex-row justify-between items-center">
              <View>
                <Text className="text-slate-900 text-base font-bold">
                  Select Venue
                </Text>
                <Text className="text-slate-400 text-xs">
                  Choose stadium or ground location
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setVenuePickerVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Quick Search Input */}
            <View className="mt-3.5 mb-2 flex-row items-center bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2">
              <Search size={16} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-2 text-slate-900 font-medium text-xs p-1"
                placeholder="Search venue..."
                placeholderTextColor="#94a3b8"
                value={venueSearchQuery}
                onChangeText={setVenueSearchQuery}
              />
              {venueSearchQuery !== "" && (
                <TouchableOpacity onPress={() => setVenueSearchQuery("")}>
                  <X size={14} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Venues List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="mt-1"
              keyboardShouldPersistTaps="handled"
            >
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue, index) => {
                  const isSelected = currentVenue === venue;

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => {
                        setValue("venue", venue, { shouldValidate: true });
                        setVenuePickerVisible(false);
                      }}
                      className={`p-3.5 mb-2 rounded-2xl flex-row items-center justify-between border ${isSelected
                        ? "bg-amber-50/80 border-amber-500/80"
                        : "bg-slate-50/70 border-slate-200/60 active:bg-slate-100"
                        }`}
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          className={`w-9 h-9 rounded-xl items-center justify-center border ${isSelected
                            ? "bg-amber-500 border-amber-600"
                            : "bg-slate-200/60 border-slate-300/40"
                            }`}
                        >
                          <MapPin
                            size={16}
                            color={isSelected ? "#ffffff" : "#64748b"}
                          />
                        </View>
                        <Text
                          className={`font-semibold text-sm ${isSelected ? "text-amber-950 font-bold" : "text-slate-800"
                            }`}
                        >
                          {venue}
                        </Text>
                      </View>

                      {isSelected && <CheckCircle2 size={20} color="#d97706" />}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="py-8 items-center justify-center">
                  <MapPin size={24} color="#cbd5e1" />
                  <Text className="text-slate-400 text-xs font-medium mt-2">
                    No venues found matching search
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 2: CUSTOM DATE PICKER ================= */}
      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View className="flex-1 bg-slate-900/40 justify-end">
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="bg-white rounded-t-3xl p-5 shadow-xl border-t border-slate-100"
          >
            {/* Modal Header */}
            <View className="pb-3 border-b border-slate-100 flex-row justify-between items-center">
              <View>
                <Text className="text-slate-900 text-base font-bold">
                  Select Match Date
                </Text>
                <Text className="text-slate-400 text-xs">
                  Choose scheduled fixture date
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDatePickerVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Calendar Controller */}
            <View className="flex-row items-center justify-between py-3">
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                className="p-2 rounded-xl bg-slate-100"
              >
                <ChevronLeft size={18} color="#0f172a" />
              </TouchableOpacity>

              <Text className="text-slate-900 font-bold text-sm">
                {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                {calendarMonth.getFullYear()}
              </Text>

              <TouchableOpacity
                onPress={() => changeMonth(1)}
                className="p-2 rounded-xl bg-slate-100"
              >
                <ChevronRight size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Calendar Days Header */}
            <View className="flex-row justify-around border-b border-slate-100 pb-2 mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                <Text
                  key={idx}
                  className="text-slate-400 font-bold text-center text-xs w-9"
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap justify-start">
              {daysInMonth.map((day, idx) => {
                if (!day) {
                  return <View key={idx} className="w-[14.28%] h-10" />;
                }

                const isoDate = day.toISOString().split("T")[0];
                const isSelected = currentDate === isoDate;

                return (
                  <View key={idx} className="w-[14.28%] h-10 p-0.5">
                    <TouchableOpacity
                      onPress={() => {
                        setValue("date", isoDate, { shouldValidate: true });
                        setDatePickerVisible(false);
                      }}
                      className={`w-full h-full rounded-xl items-center justify-center ${isSelected
                        ? "bg-amber-500 shadow-xs"
                        : "bg-slate-50 active:bg-slate-200"
                        }`}
                    >
                      <Text
                        className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-800"
                          }`}
                      >
                        {day.getDate()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL 3: CUSTOM TIME PICKER ================= */}
      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View className="flex-1 bg-slate-900/40 justify-end">
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="bg-white rounded-t-3xl p-5 shadow-xl border-t border-slate-100"
          >
            <View className="pb-3 border-b border-slate-100 flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-slate-900 text-base font-bold">
                  Select Start Time
                </Text>
                <Text className="text-slate-400 text-xs">
                  Pick a preset or enter manually
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setTimePickerVisible(false)}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Quick Time Presets */}
            <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              Popular Match Slots
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {QUICK_TIMES.map((slot) => {
                const isSelected = currentTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => {
                      setValue("time", slot, { shouldValidate: true });
                      setTimePickerVisible(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl border ${isSelected
                      ? "bg-amber-500 border-amber-600"
                      : "bg-slate-50 border-slate-200/80 active:bg-slate-100"
                      }`}
                  >
                    <Text
                      className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-800"
                        }`}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Time Manual Entry */}
            <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              Custom Time (HH:MM)
            </Text>
            <View className="flex-row items-center gap-3">
              <TextInput
                className="flex-1 bg-slate-50 text-slate-900 font-bold text-center text-lg rounded-2xl px-4 py-3 border border-slate-200/80"
                placeholder="16:15"
                placeholderTextColor="#94a3b8"
                maxLength={5}
                value={currentTime}
                onChangeText={(val) =>
                  setValue("time", val, { shouldValidate: true })
                }
              />
              <TouchableOpacity
                onPress={() => setTimePickerVisible(false)}
                className="bg-slate-900 px-6 py-3.5 rounded-2xl"
              >
                <Text className="text-white font-bold text-xs uppercase tracking-wider">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default CreateMatch;