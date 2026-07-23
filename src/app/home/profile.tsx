import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/services/api/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {user} = useSelector((state: any) => state.auth);

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout()(dispatch);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutConfirmation = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: performLogout
        }
      ]
    );
  };

  // Extract initial for avatar fallback
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'left', 'right']}>
      {/* Top Bar Navigation */}
      <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200/60">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center border border-slate-200/80 active:opacity-70"
          activeOpacity={0.7}
        >
          <Text className="text-slate-800 font-bold text-base">←</Text>
        </TouchableOpacity>

        <Text className="text-slate-900 font-bold text-lg tracking-tight">Profile</Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <View className="items-center pt-7 pb-8 bg-white border-b border-slate-200/80 px-4 shadow-sm">
          <View className="relative">
            {user?.avatar || user?.profilePic ? (
              <Image
                source={{ uri: user?.avatar || user?.profilePic }}
                className="w-28 h-28 rounded-full border-4 border-indigo-50"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-indigo-600 items-center justify-center border-4 border-indigo-50 shadow-inner">
                <Text className="text-white text-3xl font-extrabold">{userInitial}</Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 bg-indigo-600 w-9 h-9 rounded-full items-center justify-center border-2 border-white shadow-md active:bg-indigo-700"
            >
              <Text className="text-white text-xs font-bold">✎</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-slate-900 mt-4 tracking-tight">
            {user?.username || user?.fullName || 'User Profile'}
          </Text>
          <Text className="text-sm font-medium text-slate-500 mt-0.5">
            {user?.email || 'no-email@domain.com'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-5 bg-indigo-600 px-6 py-2.5 rounded-full shadow-sm active:bg-indigo-700"
          >
            <Text className="text-white font-semibold text-sm tracking-wide">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <View className="mt-7 px-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
            Account Settings
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-4 border-b border-slate-100"
            >
              <View className="flex-row items-center gap-x-3">
                <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
                  <Text className="text-indigo-600 text-base">👤</Text>
                </View>
                <Text className="text-slate-800 font-semibold text-base">Personal Information</Text>
              </View>
              <Text className="text-slate-300 font-bold text-xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-4 border-b border-slate-100"
            >
              <View className="flex-row items-center gap-x-3">
                <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center">
                  <Text className="text-emerald-600 text-base">🔒</Text>
                </View>
                <Text className="text-slate-800 font-semibold text-base">Security & Password</Text>
              </View>
              <Text className="text-slate-300 font-bold text-xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-x-3">
                <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center">
                  <Text className="text-amber-600 text-base">🔔</Text>
                </View>
                <Text className="text-slate-800 font-semibold text-base">Notifications</Text>
              </View>
              <Text className="text-slate-300 font-bold text-xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="mt-6 px-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
            Preferences
          </Text>

          <View className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-4 border-b border-slate-100"
            >
              <View className="flex-row items-center gap-x-3">
                <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center">
                  <Text className="text-blue-600 text-base">💬</Text>
                </View>
                <Text className="text-slate-800 font-semibold text-base">Help & Support</Text>
              </View>
              <Text className="text-slate-300 font-bold text-xl">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-x-3">
                <View className="w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center">
                  <Text className="text-purple-600 text-base">🛡️</Text>
                </View>
                <Text className="text-slate-800 font-semibold text-base">Privacy Policy</Text>
              </View>
              <Text className="text-slate-300 font-bold text-xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Action */}
        <View className="mt-8 px-5">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isLoggingOut}
            onPress={handleLogoutConfirmation}
            className="bg-red-500 py-4 rounded-2xl items-center shadow-md shadow-red-200 active:bg-red-600"
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white font-bold text-base tracking-wide">Log Out</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}