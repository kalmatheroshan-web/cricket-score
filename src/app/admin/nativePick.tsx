import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";

export default function NativeWindPicker() {
    const [selectedLanguage, setSelectedLanguage] = useState("java");

    return (
        <View className="relative bg-zinc-50 border border-zinc-300 rounded-2xl overflow-hidden h-14 justify-center">

            {/* 2. The Picker: Made completely transparent to let the wrapper show through */}
            <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                dropdownIconColor="#18181b" // Colors the built-in Android arrow
                mode="dropdown" // Forces Android to use a dropdown instead of a popup dialog
                style={{
                    color: "#18181b",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>

            {/* 3. Custom Chevron: ONLY for iOS. MUST be absolute so it floats over the right side */}
            {Platform.OS === "ios" && (
                <View
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    pointerEvents="none"
                >
                    <ChevronDown size={20} color="#71717a" />
                </View>
            )}
        </View>
    );
}