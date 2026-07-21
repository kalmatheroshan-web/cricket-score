import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Clock,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react-native";

type QuickSelectType = "today" | "tomorrow" | "nextWeek";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function Calendar() {
  const minYear = 2026;
  const maxYear = 2036;

  const initialDate = new Date();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const [selectedDayDate, setSelectedDayDate] = useState<Date>(new Date(initialDate));

  const [hours, setHours] = useState<number>(() => {
    const h = initialDate.getHours() % 12;
    return h === 0 ? 12 : h;
  });

  const [minutes, setMinutes] = useState<number>(initialDate.getMinutes());
  const [isPm, setIsPm] = useState<boolean>(initialDate.getHours() >= 12);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Corrected daysGrid logic
  const daysGrid: (number | null)[] = [];

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDay + 1;
    if (i < firstDay || dayNum > daysInMonth) {
      daysGrid.push(null);           // Empty cells
    } else {
      daysGrid.push(dayNum);
    }
  }

  const isToday = (day: number | null): boolean => {
    if (day === null) return false;
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number | null): boolean => {
    if (day === null) return false;
    return (
      selectedDayDate.getFullYear() === year &&
      selectedDayDate.getMonth() === month &&
      selectedDayDate.getDate() === day
    );
  };

  const updateInternalDate = (baseDate: Date, h: number, m: number, pm: boolean) => {
    const computedHours = pm ? (h % 12) + 12 : h % 12;
    const finalDate = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      computedHours,
      m
    );
    setSelectedDayDate(finalDate);
  };

  const handleSelectDay = (day: number) => {
    const chosenDate = new Date(year, month, day);
    updateInternalDate(chosenDate, hours, minutes, isPm);
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(year, month + delta, 1));
  };

  const handleQuickSelect = (type: QuickSelectType) => {
    const target = new Date();
    if (type === "tomorrow") target.setDate(target.getDate() + 1);
    if (type === "nextWeek") target.setDate(target.getDate() + 7);

    setCurrentMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    updateInternalDate(target, hours, minutes, isPm);
  };

  const handleHoursChange = (delta: number) => {
    let nextH = hours + delta;
    if (nextH > 12) nextH = 1;
    if (nextH < 1) nextH = 12;
    setHours(nextH);
    updateInternalDate(selectedDayDate, nextH, minutes, isPm);
  };

  const handleMinutesChange = (delta: number) => {
    let nextM = minutes + delta;
    if (nextM > 59) nextM = 0;
    if (nextM < 0) nextM = 59;
    setMinutes(nextM);
    updateInternalDate(selectedDayDate, hours, nextM, isPm);
  };

  const toggleAmPm = () => {
    const nextPm = !isPm;
    setIsPm(nextPm);
    updateInternalDate(selectedDayDate, hours, minutes, nextPm);
  };

  const formattedSelectedDate = selectedDayDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const yearsList = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  return (
    <View className="bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-sm">
      {/* 1. SHORTCUT BAR */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-zinc-100">
        <View className="flex-row items-center space-x-1.5">
          <TouchableOpacity
            onPress={() => handleQuickSelect("today")}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 active:bg-zinc-200"
          >
            <Text className="text-xs font-bold text-zinc-700">Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleQuickSelect("tomorrow")}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 active:bg-zinc-200"
          >
            <Text className="text-xs font-bold text-zinc-700">Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleQuickSelect("nextWeek")}
            className="px-3 py-1.5 rounded-xl bg-zinc-100 active:bg-zinc-200"
          >
            <Text className="text-xs font-bold text-zinc-700">Next Week</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            const now = new Date();
            setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            updateInternalDate(now, hours, minutes, isPm);
          }}
          className="p-2 rounded-xl bg-zinc-50 active:bg-zinc-100"
        >
          <RotateCcw size={14} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* 2. MONTH HEADER */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => setShowYearPicker(true)}
          activeOpacity={0.7}
          className="flex-row items-center space-x-2 bg-zinc-50 px-3 py-1.5 rounded-2xl border border-zinc-200/60"
        >
          <CalendarIcon size={16} color="#ea580c" />
          <Text className="text-base font-extrabold text-zinc-900 tracking-tight ml-1">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <ChevronDown size={14} color="#71717a" />
        </TouchableOpacity>

        <View className="flex-row items-center space-x-1">
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-2xl bg-zinc-100/80 items-center justify-center active:bg-zinc-200"
          >
            <ChevronLeft size={18} color="#3f3f46" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-2xl bg-zinc-100/80 items-center justify-center active:bg-zinc-200"
          >
            <ChevronRight size={18} color="#3f3f46" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. WEEKDAYS */}
      <View className="flex-row px-3 pt-1 pb-2">
        {WEEK_DAYS.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 4. DAYS GRID - Fixed */}
      <View className="flex-row flex-wrap px-3 pb-3">
        {daysGrid.map((day, idx) => (
          <View key={idx} className="w-[14.28%] aspect-square p-1">
            <Pressable
              onPress={() => day !== null && handleSelectDay(day)}
              className={`flex-1 aspect-square items-center justify-center rounded-2xl transition-all ${
                isSelected(day)
                  ? "bg-orange-600 shadow-md shadow-orange-500/20"
                  : isToday(day)
                  ? "bg-orange-50 border border-orange-300"
                  : "active:bg-zinc-100"
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  isSelected(day)
                    ? "text-white"
                    : isToday(day)
                    ? "text-orange-600"
                    : "text-zinc-800"
                }`}
              >
                {day ?? ""}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* 5. TIME PICKER FOOTER */}
      <View className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-3.5 flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Selected
          </Text>
          <Text className="text-xs font-bold text-zinc-900 mt-0.5" numberOfLines={1}>
            {formattedSelectedDate}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2 bg-white px-3 py-1.5 rounded-2xl border border-zinc-200/80 shadow-sm">
          <Clock size={14} color="#71717a" style={{ marginRight: 2 }} />

          {/* Hours */}
          <View className="items-center">
            <TouchableOpacity onPress={() => handleHoursChange(1)} hitSlop={{ top: 8, bottom: 8 }}>
              <ChevronUp size={10} color="#a1a1aa" />
            </TouchableOpacity>
            <Text className="text-sm font-black text-zinc-900 my-0.5 min-w-[24px] text-center">
              {hours.toString().padStart(2, "0")}
            </Text>
            <TouchableOpacity onPress={() => handleHoursChange(-1)} hitSlop={{ top: 8, bottom: 8 }}>
              <ChevronDown size={10} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs font-black text-zinc-400 -mt-0.5">:</Text>

          {/* Minutes */}
          <View className="items-center">
            <TouchableOpacity onPress={() => handleMinutesChange(1)} hitSlop={{ top: 8, bottom: 8 }}>
              <ChevronUp size={10} color="#a1a1aa" />
            </TouchableOpacity>
            <Text className="text-sm font-black text-zinc-900 my-0.5 min-w-[24px] text-center">
              {minutes.toString().padStart(2, "0")}
            </Text>
            <TouchableOpacity onPress={() => handleMinutesChange(-1)} hitSlop={{ top: 8, bottom: 8 }}>
              <ChevronDown size={10} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          {/* AM / PM Toggle */}
          <TouchableOpacity
            onPress={toggleAmPm}
            activeOpacity={0.8}
            className={`px-2.5 py-1 rounded-xl ml-1 ${isPm ? "bg-orange-600" : "bg-zinc-900"}`}
          >
            <Text className="text-[10px] font-black text-white tracking-wider">
              {isPm ? "PM" : "AM"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 6. YEAR & MONTH PICKER MODAL */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <Pressable
          onPress={() => setShowYearPicker(false)}
          className="flex-1 bg-black/40 justify-center items-center px-6"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 w-full max-w-sm border border-zinc-100 shadow-xl"
          >
            <View className="flex-row items-center justify-between pb-3 border-b border-zinc-100 mb-3">
              <Text className="text-base font-black text-zinc-900">
                Select Month & Year
              </Text>
              <TouchableOpacity
                onPress={() => setShowYearPicker(false)}
                className="p-1 rounded-full bg-zinc-100"
              >
                <Text className="text-xs font-bold text-zinc-500 px-2">Close</Text>
              </TouchableOpacity>
            </View>

            {/* Years */}
            <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Year
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mb-4"
            >
              {yearsList.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setCurrentMonth(new Date(y, currentMonth.getMonth(), 1))}
                  className={`px-4 py-2 rounded-2xl mr-2 border ${
                    y === currentMonth.getFullYear()
                      ? "bg-orange-600 border-orange-600"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      y === currentMonth.getFullYear() ? "text-white" : "text-zinc-700"
                    }`}
                  >
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Months */}
            <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Month
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {MONTH_NAMES.map((mName, mIdx) => {
                const isCurrent = mIdx === currentMonth.getMonth();
                return (
                  <View key={mName} className="w-1/3 p-1">
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentMonth(new Date(currentMonth.getFullYear(), mIdx, 1));
                        setShowYearPicker(false);
                      }}
                      className={`py-3 rounded-2xl items-center border ${
                        isCurrent
                          ? "bg-zinc-900 border-zinc-900"
                          : "bg-zinc-50 border-zinc-200/80"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isCurrent ? "text-white" : "text-zinc-700"
                        }`}
                      >
                        {mName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}