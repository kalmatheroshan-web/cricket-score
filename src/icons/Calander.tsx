// components/Calendar.tsx
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    selectedDate ? selectedDate.getDate() : null
  );
  const [hours, setHours] = useState(selectedDate?.getHours() || 12);
  const [minutes, setMinutes] = useState(selectedDate?.getMinutes() || 0);
  const [isPm, setIsPm] = useState((selectedDate?.getHours() || 12) >= 12);

  // Get first day and days in month
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === currentMonth.getFullYear() &&
    today.getMonth() === currentMonth.getMonth() &&
    today.getDate() === day;

  const isSelected = (day: number) => day === selectedDay;

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    // Build a Date object with current time and update parent
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
      isPm ? (hours % 12) + 12 : hours % 12,
      minutes
    );
    onSelectDate(newDate);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Time handlers
  const changeHours = (delta: number) => {
    let newHours = hours + delta;
    if (newHours > 12) newHours = 1;
    if (newHours < 1) newHours = 12;
    setHours(newHours);
    updateDateTime(newHours, minutes);
  };

  const changeMinutes = (delta: number) => {
    let newMinutes = minutes + delta;
    if (newMinutes > 59) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 59;
    setMinutes(newMinutes);
    updateDateTime(hours, newMinutes);
  };

  const toggleAmPm = () => {
    const newIsPm = !isPm;
    setIsPm(newIsPm);
    updateDateTime(hours, minutes, newIsPm);
  };

  const updateDateTime = (h: number, m: number, pm?: boolean) => {
    const pmVal = pm !== undefined ? pm : isPm;
    if (selectedDay !== null) {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        selectedDay,
        pmVal ? (h % 12) + 12 : h % 12,
        m
      );
      onSelectDate(newDate);
    }
  };

  // Build day grid
  const days = [];
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstDayOfMonth + 1;
    if (i < firstDayOfMonth || dayNumber > daysInMonth) {
      days.push(null);
    } else {
      days.push(dayNumber);
    }
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Format date for display
  const formattedDate = selectedDay
    ? new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        selectedDay
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No date selected";

  return (
    <View className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Month Navigation */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2 border-b border-zinc-100">
        <Pressable
          onPress={goToPreviousMonth}
          className="p-2 -ml-2 rounded-full active:bg-zinc-100"
        >
          <Text className="text-lg text-zinc-600">←</Text>
        </Pressable>
        <Text className="text-base font-bold text-zinc-900">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          className="p-2 -mr-2 rounded-full active:bg-zinc-100"
        >
          <Text className="text-lg text-zinc-600">→</Text>
        </Pressable>
      </View>

      {/* Weekday Headers */}
      <View className="flex-row px-2 pt-3 pb-1">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Day Grid */}
      <View className="flex-row flex-wrap px-2 pb-2">
        {days.map((day, index) => (
          <View key={index} className="w-[14.28%] aspect-square p-0.5">
            {day !== null ? (
              <Pressable
                onPress={() => handleDayPress(day)}
                className={`flex-1 items-center justify-center rounded-full ${
                  isSelected(day)
                    ? "bg-orange-600"
                    : isToday(day)
                    ? "border border-orange-300"
                    : "active:bg-zinc-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected(day)
                      ? "text-white"
                      : isToday(day)
                      ? "text-orange-600"
                      : "text-zinc-800"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            ) : (
              <View className="flex-1" />
            )}
          </View>
        ))}
      </View>

      {/* Time Picker Section */}
      <View className="border-t border-zinc-100 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Selected Date
          </Text>
          <Text className="text-sm font-semibold text-zinc-900 mt-0.5">
            {formattedDate}
          </Text>
        </View>

        <View className="flex-row items-center space-x-3">
          {/* Hours */}
          <View className="items-center">
            <Pressable
              onPress={() => changeHours(1)}
              className="p-1 active:bg-zinc-100 rounded-full"
            >
              <Text className="text-sm text-zinc-600">▲</Text>
            </Pressable>
            <Text className="text-lg font-bold text-zinc-900 w-7 text-center">
              {hours.toString().padStart(2, "0")}
            </Text>
            <Pressable
              onPress={() => changeHours(-1)}
              className="p-1 active:bg-zinc-100 rounded-full"
            >
              <Text className="text-sm text-zinc-600">▼</Text>
            </Pressable>
          </View>

          <Text className="text-lg font-bold text-zinc-400">:</Text>

          {/* Minutes */}
          <View className="items-center">
            <Pressable
              onPress={() => changeMinutes(1)}
              className="p-1 active:bg-zinc-100 rounded-full"
            >
              <Text className="text-sm text-zinc-600">▲</Text>
            </Pressable>
            <Text className="text-lg font-bold text-zinc-900 w-7 text-center">
              {minutes.toString().padStart(2, "0")}
            </Text>
            <Pressable
              onPress={() => changeMinutes(-1)}
              className="p-1 active:bg-zinc-100 rounded-full"
            >
              <Text className="text-sm text-zinc-600">▼</Text>
            </Pressable>
          </View>

          {/* AM/PM Toggle */}
          <Pressable
            onPress={toggleAmPm}
            className={`px-2 py-1 rounded-md border ${
              isPm ? "border-orange-300 bg-orange-50" : "border-zinc-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isPm ? "text-orange-600" : "text-zinc-400"
              }`}
            >
              {isPm ? "PM" : "AM"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}