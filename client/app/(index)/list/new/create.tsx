import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { BodyScrollView } from "@/component/BodyScrollview";
import ThemedText from "@/component/ThemedText";
import { Link, Stack, useRouter } from "expo-router";
import TextInput from "@/component/TextInput";
import { useTheme } from "@/component/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/component/Button";
import { useCreateList } from "@/context/createListContext";
import { backgroundColors, emojies } from "@/utils/Colors";
import { useAddShoppingListCallback } from "@/stores/persistence/ShoppingListsStore";
import NavBar from "@/component/NavBar";

const create = () => {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const { selectedColor, selectedEmoji, setSelectedColor, setSelectedEmoji } =
    useCreateList();

  const useAddShoppingList = useAddShoppingListCallback();

  const { theme, themeVars } = useTheme();
  const isDark = theme === "dark";

  const handleCreateList = () => {
    if (!listName) {
      return;
    }
    const listId = useAddShoppingList(
      listName,
      listDescription,
      selectedEmoji,
      selectedColor,
    );

    // todo navigate to list details & pass list id
    router.replace({
      pathname: "/(index)/list/[listId]",
      params: { listId },
    });
  };

  useEffect(() => {
    setSelectedEmoji(emojies[Math.floor(Math.random() * emojies.length)]);
    setSelectedColor(
      backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    );

    //cleanup function
    return () => {
      setSelectedColor("");
      setSelectedEmoji("");
    };
  }, []);

  return (
    <>
      <SafeAreaView edges={["top", "bottom"]} style={[{ flex: 1 }, themeVars]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <NavBar title="New List" showBack/>
        <BodyScrollView className={`p-4 ${isDark ? "bg-gray-950" : "#F3F4F6"}`}>
          <View className="flex flex-row items-center gap-4">
            <TextInput
              placeholder="Grocery Essentials"
              size="lg"
              value={listName}
              variant="ghost"
              onChangeText={setListName}
              returnKeyType="done"
              autoFocus
              className="font-semibold text-xl flex-grow flex-shrink w-auto"
              onSubmitEditing={() => {
                handleCreateList;
              }}
            />
            <Link
              href={{ pathname: "/(index)/emojiPicker" }}
              className="p-1 border-[3px] rounded-full -mt-5"
              style={selectedColor && { borderColor: selectedColor }}
            >
              <View className="w-7 h-7 items-center justify-center">
                <Text className="text-xl">{selectedEmoji}</Text>
              </View>
            </Link>
            <Link
              href={{ pathname: "/(index)/colorPicker" }}
              className="p-1 border-[3px] border-blue-500 rounded-full -mt-5"
              style={selectedColor && { borderColor: selectedColor }}
            >
              <View className="w-7 h-7 items-center justify-center">
                <View
                  className="w-7 h-7"
                  style={
                    selectedColor && {
                      backgroundColor: selectedColor,
                      borderRadius: 9999,
                    }
                  }
                ></View>
              </View>
            </Link>
          </View>
          <TextInput
            placeholder="Description (optional)"
            value={listDescription}
            onChangeText={setListDescription}
            onSubmitEditing={handleCreateList}
            returnKeyType="done"
            variant="ghost"
            className="p-0"
          />
          <Button
            onPress={handleCreateList}
            disabled={!listName}
            variant="ghost"
            className="text-[#007AFF] font-normal"
          >
            Create list
          </Button>
        </BodyScrollView>
      </SafeAreaView>
    </>
  );
};

export default create;
