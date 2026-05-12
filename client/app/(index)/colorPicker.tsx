import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import { useCreateList } from "@/context/createListContext";
import { useRouter } from "expo-router";
import { useTheme } from "@/component/ThemeProvider";
import { backgroundColors } from "@/utils/Colors";

const colorPicker = () => {
  const { setSelectedColor, selectedColor } = useCreateList();
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    router.back();
  };

  return (
    <>
      <View
        className="flex-1 px-4 pt-4"
        style={{ backgroundColor: isDark ? "#0f172a" : "#e4e4e7" }}
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
            Choose Background Color
          </Text>
        </View>

        <FlatList
          data={backgroundColors}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          automaticallyAdjustContentInsets
          contentInsetAdjustmentBehavior="automatic"
          contentInset={{ bottom: 0 }}
          scrollIndicatorInsets={{ bottom: 0 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          renderItem={({ item }) => {
            const isSelected = selectedColor === item;

            return (
              <Pressable
                onPress={() => handleColorSelect(item)}
                className="w-16 h-16 items-center justify-center"
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                })}
              >
                {/* Actual color circle */}
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 999,
                    backgroundColor: item,
                  }}
                />

                {/* Selection ring */}
                {isSelected && (
                  <View className="absolute w-16 h-16 rounded-full border-[3px] border-blue-500" />
                )}
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
};

export default colorPicker;
