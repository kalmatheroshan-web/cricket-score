import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

function AdminUI() {
  return (
    <View className="flex-1 bg-zinc-50">
      <SafeAreaViewRN className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-zinc-100 px-6 py-5 flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            <Text className="text-3xl">🏏</Text>
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-black text-orange-600 tracking-tight">Cric</Text>
              <Text className="text-2xl font-black text-zinc-900 tracking-tight">Show</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-5">
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#3f3f46" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="person-circle" size={28} color="#3f3f46" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome */}
          <View className="mb-8">
            <Text className="text-3xl font-bold tracking-tight text-zinc-900">
              Good morning, Admin 👋
            </Text>
            <Text className="text-zinc-500 mt-1 text-base">
              Here's what's happening with your stadium today
            </Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row flex-wrap justify-between gap-3 mb-8">
            <View className="bg-white rounded-3xl border border-zinc-100 p-5 w-[48%]">
              <View className="w-11 h-11 bg-blue-50 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="people" size={26} color="#2563eb" />
              </View>
              <Text className="text-3xl font-bold text-zinc-900">2,847</Text>
              <Text className="text-sm text-zinc-500 mt-1">Total Users</Text>
              <Text className="text-emerald-600 text-xs font-medium mt-3">↑ 12% this month</Text>
            </View>

            <View className="bg-white rounded-3xl border border-zinc-100 p-5 w-[48%]">
              <View className="w-11 h-11 bg-emerald-50 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="cart" size={26} color="#10b981" />
              </View>
              <Text className="text-3xl font-bold text-zinc-900">1,392</Text>
              <Text className="text-sm text-zinc-500 mt-1">Orders Today</Text>
              <Text className="text-emerald-600 text-xs font-medium mt-3">↑ 8% from yesterday</Text>
            </View>

            <View className="bg-white rounded-3xl border border-zinc-100 p-5 w-[48%]">
              <View className="w-11 h-11 bg-amber-50 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="cash" size={26} color="#d97706" />
              </View>
              <Text className="text-3xl font-bold text-zinc-900">$48.2k</Text>
              <Text className="text-sm text-zinc-500 mt-1">Revenue</Text>
              <Text className="text-emerald-600 text-xs font-medium mt-3">↑ 23% this week</Text>
            </View>

            <View className="bg-white rounded-3xl border border-zinc-100 p-5 w-[48%]">
              <View className="w-11 h-11 bg-red-50 rounded-2xl items-center justify-center mb-4">
                <Ionicons name="alert-circle" size={26} color="#ef4444" />
              </View>
              <Text className="text-3xl font-bold text-zinc-900">14</Text>
              <Text className="text-sm text-zinc-500 mt-1">Pending Issues</Text>
              <Text className="text-red-600 text-xs font-medium mt-3">↓ 4 since yesterday</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-xl font-semibold text-zinc-900 mb-4">Quick Actions</Text>
            <View className="flex-row gap-3">
              <Pressable className="flex-1 bg-zinc-900 rounded-3xl py-6 items-center active:opacity-90">
                <Ionicons name="add-circle" size={28} color="white" />
                <Text className="text-white font-semibold mt-3">New User</Text>
              </Pressable>

              <Pressable className="flex-1 bg-white border border-zinc-200 rounded-3xl py-6 items-center active:bg-zinc-50">
                <Ionicons name="document-text" size={28} color="#27272a" />
                <Text className="text-zinc-900 font-semibold mt-3">Report</Text>
              </Pressable>

              <Pressable className="flex-1 bg-white border border-zinc-200 rounded-3xl py-6 items-center active:bg-zinc-50">
                <Ionicons name="settings" size={28} color="#27272a" />
                <Text className="text-zinc-900 font-semibold mt-3">Settings</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-zinc-900">Recent Activity</Text>
              <Text className="text-orange-600 font-medium">See all</Text>
            </View>

            <View className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
              {[
                { icon: "person-add" as const, title: "New user registered", subtitle: "Sarah Chen", time: "2m ago" },
                { icon: "cart" as const, title: "Large order placed", subtitle: "Michael Torres", time: "17m ago" },
                { icon: "warning" as const, title: "Payment failed", subtitle: "Emma Rodriguez", time: "41m ago" },
                { icon: "refresh" as const, title: "System backup completed", subtitle: "System", time: "1h ago" },
              ].map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center px-5 py-5 ${index !== 3 ? 'border-b border-zinc-100' : ''}`}
                >
                  <View className="w-10 h-10 bg-zinc-100 rounded-2xl items-center justify-center">
                    <Ionicons name={item.icon} size={22} color="#52525b" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="font-medium text-zinc-900">{item.title}</Text>
                    <Text className="text-sm text-zinc-500">{item.subtitle}</Text>
                  </View>
                  <Text className="text-xs text-zinc-400">{item.time}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="bg-white border-t border-zinc-100 flex-row py-3 px-6">
          <View className="flex-1 items-center">
            <Ionicons name="home" size={26} color="#18181b" />
            <Text className="text-[10px] font-medium text-zinc-900 mt-1">Home</Text>
          </View>
          <View className="flex-1 items-center">
            <Ionicons name="people" size={26} color="#a1a1aa" />
            <Text className="text-[10px] font-medium text-zinc-400 mt-1">Users</Text>
          </View>
          <View className="flex-1 items-center">
            <Ionicons name="bar-chart" size={26} color="#a1a1aa" />
            <Text className="text-[10px] font-medium text-zinc-400 mt-1">Analytics</Text>
          </View>
          <View className="flex-1 items-center">
            <Ionicons name="settings" size={26} color="#a1a1aa" />
            <Text className="text-[10px] font-medium text-zinc-400 mt-1">More</Text>
          </View>
        </View>
      </SafeAreaViewRN>
    </View>
  );
}

export default AdminUI;