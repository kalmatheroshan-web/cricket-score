import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // Get the first day of the month (0 = Sunday)
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Number of days in the current month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // Today's date for highlighting
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === currentMonth.getFullYear() &&
    today.getMonth() === currentMonth.getMonth() &&
    today.getDate() === day;

  // Check if a day is selected
  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getFullYear() === currentMonth.getFullYear() &&
    selectedDate.getMonth() === currentMonth.getMonth() &&
    selectedDate.getDate() === day;

  // Handle day press
  const handleDayPress = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onSelectDate(newDate);
  };

  // Month navigation
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

  // Generate day cells (including empty placeholders)
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

  // Weekday headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm">
      {/* Header: Month + Navigation */}
      <View className="flex-row justify-between items-center mb-4">
        <Pressable
          onPress={goToPreviousMonth}
          className="p-2 rounded-full active:bg-zinc-100"
        >
          <Text className="text-xl text-zinc-600">←</Text>
        </Pressable>
        <Text className="text-base font-bold text-zinc-900">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          className="p-2 rounded-full active:bg-zinc-100"
        >
          <Text className="text-xl text-zinc-600">→</Text>
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View className="flex-row mb-2">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs font-semibold text-zinc-400 uppercase">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="flex-row flex-wrap">
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
    </View>
  );
}