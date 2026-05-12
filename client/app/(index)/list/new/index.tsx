import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import { BodyScrollView } from "@/component/BodyScrollview";
import ThemedText from "@/component/ThemedText";
import { useTheme } from "@/component/ThemeProvider";
import Button from "@/component/Button";
import IconCircle from "@/component/IconCircle";
import { backgroundColors, emojies } from "@/utils/Colors";
import TextInput from "@/component/TextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, useRouter } from "expo-router";

const isValidUUID = (id: string | null) => {
  if (!id) return false;
  const uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(id);
};

const NewListScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [listId, setListId] = useState("");

  const isValidListId = useMemo(() => isValidUUID(listId), [listId]);

  const randomEmoji = useMemo(
    () => emojies[Math.floor(Math.random() * emojies.length)],
    [],
  );

  const randomColor = useMemo(
    () => backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    [],
  );

  const joinShoppingListCallback = (listId: string) => {};

  const handleJoinList = () => {};
  const handleDismissTo = (screen: Href) => {
    if (router.canDismiss()) {
      router.dismiss();
      setTimeout(() => {
        router.push(screen);
      }, 100);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      <BodyScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 24,
          gap: 8,
        }}
      >
        <View className="items-center gap-4">
          <IconCircle
            emoji={randomEmoji}
            backgroundColor={randomColor}
            size={60}
            style={{ marginBottom: 16 }}
          />

          <ThemedText type="title">Better Together</ThemedText>

          <Text
            className={`text-center ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Create shared shopping list & collaborate in real-time with family &
            friends
          </Text>
        </View>

        <View className="gap-4">
          <Button
            variant="filled"
            style={{ backgroundColor: "#4f46e5", marginTop: 16 }}
            onPress={() => handleDismissTo("/list/new/create")}
          >
            <Text className={isDark ? "text-gray-200" : "text-white"}>
              Create New List
            </Text>
          </Button>

          <View className="flex-row items-center justify-center gap-2 my-4">
            <View
              className={`flex-1 h-[1px] ${
                isDark ? "bg-zinc-600" : "bg-zinc-300"
              }`}
            />

            <ThemedText className={isDark ? "text-white" : "text-black"}>
              or Join existing list
            </ThemedText>

            <View
              className={`flex-1 h-[1px] ${
                isDark ? "bg-zinc-600" : "bg-zinc-300"
              }`}
            />
          </View>
        </View>

        <View className="gap-2">
          <TextInput
            placeholder="Enter a list code"
            value={listId}
            onChangeText={setListId}
            onSubmitEditing={(e) => {
              joinShoppingListCallback(e.nativeEvent.text);
            }}
          />
          <Button onPress={handleJoinList} disabled={!isValidListId}>
            Join List
          </Button>

          <Button
            variant="ghost"
            onPress={() => handleDismissTo("/list/new/scan")}
          >
            Scan QR
          </Button>
        </View>
      </BodyScrollView>
    </SafeAreaView>
  );
};

export default NewListScreen;
