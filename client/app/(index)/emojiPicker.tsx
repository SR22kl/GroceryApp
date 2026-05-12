import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import { emojies } from "@/utils/Colors";
import { useCreateList } from "@/context/createListContext";
import { useTheme } from "@/component/ThemeProvider";
import { useRouter } from "expo-router";

const EmojiPickerScreen = () => {
  const { setSelectedEmoji, selectedEmoji } = useCreateList();
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    router.back();
  };

  return (
    <View
      className="flex-1 px-4 pt-4"
      style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
    >
      <View className="items-center pt-3 pb-2">
        {/* Drag handle */}
        <View
          className="w-10 h-1.5 rounded-full mb-3"
          style={{ backgroundColor: isDark ? "#374151" : "#9ca3af" }}
        />

        {/* Header Title */}
        <Text
          className="text-base font-semibold"
          style={{ color: isDark ? "#e2e8f0" : "#1f2937" }}
        >
          Choose Emoji
        </Text>
      </View>
      <FlatList
        data={emojies}
        keyExtractor={(item) => item.toString()}
        numColumns={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        contentInsetAdjustmentBehavior="automatic"
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => {
          const isSelected = selectedEmoji === item;

          return (
            <Pressable
              onPress={() => handleEmojiSelect(item)}
              className={`w-16 h-16 rounded-full items-center justify-center
                ${
                  isSelected
                    ? "bg-blue-500"
                    : isDark
                      ? "bg-slate-900"
                      : "bg-gray-200"
                }`}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.9 : 1 }],
              })}
            >
              <Text className="text-4xl">{item}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default EmojiPickerScreen;
