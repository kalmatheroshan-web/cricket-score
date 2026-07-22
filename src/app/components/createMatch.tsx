import { useEffect, useState } from "react";
import { Picker } from '@react-native-picker/picker';
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Swords,
  CheckCircle2,
} from "lucide-react-native";
import { createMatch } from "../../services/api/match";
import { getScorer } from "../../services/api/auth";

const POPULAR_TEAMS = ["India", "Australia", "England", "South Africa", "Pakistan"];

interface MatchFormData {
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  assignedScorer: string;
}

function CreateMatch() {
  const router = useRouter();

  const [quickScorers, setQuickScorers] = useState<any[]>([]);
  const [isLoadingScorers, setIsLoadingScorers] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      date: "2026-08-15",
      time: "14:30",
      venue: "",
      assignedScorer: "",
    },
  });

  const currentTeam1 = watch("team1");
  const currentTeam2 = watch("team2");
  const selectedScorerId = watch("assignedScorer");
  const currentVenue = watch("venue");

  const selectedScorerObj = quickScorers.find((s) => s._id === selectedScorerId);
  const availableVenues: string[] = selectedScorerObj?.venue || [];

  // Fetch Scorers on Mount
  useEffect(() => {
    const fetchScorers = async () => {
      try {
        setIsLoadingScorers(true);
        const response = await getScorer();

        if (response?.success) {
          setQuickScorers(response.scorers || response.data || []);
        } else {
          setFetchError("Failed to fetch scorers");
        }
      } catch (error) {
        console.error("Error fetching scorers:", error);
        setFetchError("Something went wrong");
      } finally {
        setIsLoadingScorers(false);
      }
    };

    fetchScorers();
  }, []);

  // Handle selecting a scorer and auto-filling the first available venue
  const handleSelectScorer = (scorer: any, onChange: (id: string) => void) => {
    onChange(scorer._id);

    // Auto-select the first venue of the selected scorer if available
    if (scorer.venue && scorer.venue.length > 0) {
      setValue("venue", scorer.venue[0], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: MatchFormData) => {
    const payload = {
      team1: data.team1,
      team2: data.team2,
      dateTime: `${data.date}T${data.time}:00.000Z`,
      venue: data.venue,
      assignedScorer: data.assignedScorer,
    };

    try {
      console.log("Creating Match Payload:", payload);
      await createMatch(payload);
      router.back();
    } catch (error) {
      console.error("Failed to create match:", error);
    }
  };

  return (
    <View className="flex-1 bg-zinc-50">
      <SafeAreaView className="flex-1">
        {/* Header Bar */}
        <View className="px-6 pt-4 pb-4 bg-zinc-50 border-b border-zinc-200/60 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/80 items-center justify-center"
          >
            <ArrowLeft size={18} color="#18181b" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-base font-bold text-zinc-900 tracking-tight">
              Fixture Configurator
            </Text>
            <Text className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              Step 1 of 2
            </Text>
          </View>

          <View className="w-10 h-10" />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="px-6 py-6 pb-12"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {/* Context Headline */}
            <View className="mb-6">
              <Text className="text-2xl font-bold tracking-tight text-zinc-900">
                Setup Live Match
              </Text>
              <Text className="text-xs text-zinc-400 mt-1 font-normal">
                Define participating teams, stadium coordinates, and dispatch an official scorer.
              </Text>
            </View>

            {/* SECTION 1: Official Scorer Assignment */}
            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
              Match Official Assignment
            </Text>

            <Controller
              control={control}
              name="assignedScorer"
              rules={{ required: true }}
              render={({ field: { onChange, value: selectedScorer } }) => (
                <View className="bg-white rounded-3xl border border-zinc-200/70 p-4 mb-6">
                  <View className="flex-row items-center space-x-3 mb-3">
                    <View className="w-8 h-8 rounded-xl bg-zinc-100 items-center justify-center">
                      <UserCheck size={16} color="#18181b" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-zinc-900">
                        Assign Official Scorer
                      </Text>
                      <Text className="text-[11px] text-zinc-400">
                        Select scorer to unlock their assigned venues
                      </Text>
                    </View>
                  </View>

                  {isLoadingScorers && (
                    <ActivityIndicator size="small" color="#f97316" className="my-4" />
                  )}

                  {fetchError && (
                    <Text className="text-xs text-red-500 my-2">{fetchError}</Text>
                  )}

                  {/* Scorer List Scroller */}
                  <ScrollView
                    className="max-h-48"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  >
                    {quickScorers.map((scorer) => {
                      const isSelected = selectedScorer === scorer._id;

                      return (
                        <Pressable
                          key={scorer._id}
                          onPress={() => handleSelectScorer(scorer, onChange)}
                          className={`p-3 rounded-2xl my-1 flex-row items-center justify-between border ${isSelected
                            ? "bg-orange-50/50 border-orange-500/40"
                            : "bg-zinc-50/60 border-zinc-200/50"
                            }`}
                        >
                          <View className="flex-row items-center space-x-3">
                            <View
                              className={`w-7 h-7 rounded-full items-center justify-center ${isSelected ? "bg-orange-500" : "bg-zinc-200"
                                }`}
                            >
                              <Text
                                className={`text-xs font-bold uppercase ${isSelected ? "text-white" : "text-zinc-600"
                                  }`}
                              >
                                {scorer.username?.charAt(0)}
                              </Text>
                            </View>
                            <View className="ml-3 justify-center">
                              <Text className="text-sm font-bold text-zinc-900 tracking-wide capitalize">
                                {scorer.username}
                              </Text>

                              <Text className="text-xs font-medium text-zinc-400 capitalize mt-0.5">
                                State • <Text className="font-semibold text-zinc-800">{scorer.state}</Text>
                              </Text>
                            </View>
                          </View>

                          {isSelected && <CheckCircle2 size={18} color="#ea580c" />}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            />

            {/* SECTION 2: Team Matchup Arena */}
            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
              Matchup Teams
            </Text>

            <View className="bg-white rounded-3xl border border-zinc-200/70 p-4 mb-6 relative overflow-hidden">
              <View className="absolute left-1/2 top-1/2 -ml-5 -mt-5 z-10 w-10 h-10 rounded-full bg-zinc-900 items-center justify-center border-2 border-white shadow-sm">
                <Swords size={16} color="#f97316" />
              </View>

              <View className="flex-row space-x-3">
                {/* Team 1 Controller */}
                <Controller
                  control={control}
                  name="team1"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 bg-zinc-50/80 p-3 rounded-2xl border border-zinc-200/50">
                      <Text className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Home Team
                      </Text>
                      <TextInput
                        placeholder="e.g. India"
                        placeholderTextColor="#a1a1aa"
                        value={value}
                        onChangeText={onChange}
                        className="text-zinc-900 text-sm font-bold p-0 h-7"
                      />
                    </View>
                  )}
                />

                {/* Team 2 Controller */}
                <Controller
                  control={control}
                  name="team2"
                  rules={{
                    required: true,
                    validate: (val) => val !== currentTeam1 || "Teams must be different",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 bg-zinc-50/80 p-3 rounded-2xl border border-zinc-200/50">
                      <Text className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Away Team
                      </Text>
                      <TextInput
                        placeholder="e.g. Australia"
                        placeholderTextColor="#a1a1aa"
                        value={value}
                        onChangeText={onChange}
                        className="text-zinc-900 text-sm font-bold p-0 h-7"
                      />
                    </View>
                  )}
                />
              </View>

              {/* Quick Select Team Chips */}
              <View className="mt-3 pt-3 border-t border-zinc-100">
                <Text className="text-[10px] text-zinc-400 mb-2 font-medium">
                  Quick Select Preset:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {POPULAR_TEAMS.map((team) => (
                    <TouchableOpacity
                      key={team}
                      onPress={() => {
                        if (!currentTeam1) {
                          setValue("team1", team, { shouldValidate: true });
                        } else if (!currentTeam2 && team !== currentTeam1) {
                          setValue("team2", team, { shouldValidate: true });
                        }
                      }}
                      className="bg-zinc-100 px-3 py-1.5 rounded-xl mr-2 border border-zinc-200/60"
                    >
                      <Text className="text-xs font-semibold text-zinc-700">+ {team}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* SECTION 3: Venue & Schedule Card */}
            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">
              Schedule & Location
            </Text>

            <View className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden mb-8">
              {/* Venue Controller */}
              <Controller
                control={control}
                name="venue"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View className="border-b border-zinc-100 p-4 bg-zinc-50/5">
                    {/* Stadium Input / Selected Display */}
                    <View className="flex-row items-center space-x-3 mb-3">
                      <View className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center">
                        <MapPin size={16} color="#ea580c" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                          Stadium
                        </Text>
                        <TextInput
                          placeholder={
                            selectedScorerId
                              ? "Select a venue below or type"
                              : "Assign a scorer first to see venues"
                          }
                          placeholderTextColor="#a1a1aa"
                          value={value}
                          onChangeText={onChange}
                          className="text-zinc-900 text-sm font-medium p-0 h-6"
                        />
                      </View>
                    </View>

                    {/* HTML-Style Select Dropdown */}
                    {availableVenues.length > 0 && (
                      <View className="mt-2 pt-2 border-t border-zinc-100">
                        <Text className="text-[10px] font-semibold text-zinc-400 mb-1.5">
                          Scorer Assigned Venues:
                        </Text>

                        <View className="bg-zinc-100/80 border border-zinc-200 rounded-xl overflow-hidden justify-center h-11 px-1">
                          <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => {
                              if (itemValue) {
                                setValue("venue", itemValue, { shouldValidate: true });
                              }
                            }}
                            dropdownIconColor="#71717a"
                            style={{ color: value ? '#18181b' : '#a1a1aa' }}
                          >
                            {/* Default placeholder option */}
                            <Picker.Item label="-- Choose a venue --" value="" />

                            {/* Dynamic options from scorer's assigned venues */}
                            {availableVenues.map((v, index) => (
                              <Picker.Item key={index} label={v} value={v} />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              />
              {/* Date & Time Grid */}
              <View className="flex-row">
                <Controller
                  control={control}
                  name="date"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 border-r border-zinc-100 p-4 bg-zinc-50/5 flex-row items-center space-x-3">
                      <View className="w-8 h-8 rounded-xl bg-zinc-100 items-center justify-center">
                        <Calendar size={16} color="#18181b" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                          Match Date
                        </Text>
                        <TextInput
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor="#a1a1aa"
                          value={value}
                          onChangeText={onChange}
                          className="text-zinc-900 text-sm font-medium p-0 h-6"
                        />
                      </View>
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="time"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-1 p-4 bg-zinc-50/5 flex-row items-center space-x-3">
                      <View className="w-8 h-8 rounded-xl bg-zinc-100 items-center justify-center">
                        <Clock size={16} color="#18181b" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                          Start Time
                        </Text>
                        <TextInput
                          placeholder="HH:MM"
                          placeholderTextColor="#a1a1aa"
                          value={value}
                          onChangeText={onChange}
                          className="text-zinc-900 text-sm font-medium p-0 h-6"
                        />
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Primary Action Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              className={`h-14 rounded-2xl items-center justify-center ${isValid && !isSubmitting
                ? "bg-zinc-900 active:opacity-90"
                : "bg-zinc-300"
                }`}
              android_ripple={{ color: "#3f3f46" }}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold text-sm tracking-wide">
                  Publish Match Fixture
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default CreateMatch;