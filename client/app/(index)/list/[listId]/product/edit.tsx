import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useShoppingListValue } from "@/stores/persistence/ShoppingListStore";
import Button from "@/component/Button";
import { BodyScrollView } from "@/component/BodyScrollview";
import TextInput from "@/component/TextInput";
import { useCreateList } from "@/context/createListContext";
import { useTheme } from "@/component/ThemeProvider";

const edit = () => {
  const router = useRouter();
  const { listId } = useLocalSearchParams() as { listId: string };
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // List values
  const [name, setName] = useShoppingListValue(listId, "name");
  const [description, setDescription] = useShoppingListValue(
    listId,
    "description",
  );
  const [emoji, setEmoji] = useShoppingListValue(listId, "emoji");
  const [color, setColor] = useShoppingListValue(listId, "color");

  // List creation context
  const { selectedEmoji, selectedColor, setSelectedColor, setSelectedEmoji } =
    useCreateList();

  // Initialize context with current values
  useEffect(() => {
    setSelectedEmoji(emoji);
    setSelectedColor(color);
    return () => {
      setSelectedEmoji("");
      setSelectedColor("");
    };
  }, [listId]);

  // Update list when context changes
  useEffect(() => {
    if (selectedEmoji && selectedEmoji !== emoji) setEmoji(selectedEmoji);
    if (selectedColor && selectedColor !== color) setColor(selectedColor);
  }, [selectedEmoji, selectedColor]);

  const handleEmojiPress = () => {
    router.push("/emojiPicker");
  };

  const handleColorPress = () => {
    router.push("/colorPicker");
  };

  return (
    <>
      <View
        className="flex-1 px-4 pt-4"
        style={{ backgroundColor: isDark ? "#0f172a" : "#e4e4e7" }}
      >
        <View className="items-center pt-2 pb-2">
          {/* Drag handle */}
          <View
            className="w-10 h-1.5 rounded-full"
            style={{ backgroundColor: isDark ? "#374151" : "#9ca3af" }}
          />

          {/* Header with buttons */}
          <View className="flex-row items-center justify-between w-full px-4">
            <Button variant="ghost" onPress={router.back}>
              Cancel
            </Button>

            <Text
              className="text-base font-semibold"
              style={{ color: isDark ? "#e2e8f0" : "#1f2937" }}
            >
              Edit
            </Text>

            {/* Empty view for balance */}
            <View className="w-16" />
          </View>
        </View>

        <BodyScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Name"
              placeholder="Potatoes"
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              containerStyle={styles.titleInputContainer}
            />
            <Pressable
              onPress={handleEmojiPress}
              style={[styles.emojiButton, { borderColor: color }]}
            >
              <View style={styles.emojiContainer}>
                <Text>{emoji}</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={handleColorPress}
              style={[styles.colorButton, { borderColor: color }]}
            >
              <View style={styles.colorContainer}>
                <View
                  style={[styles.colorPreview, { backgroundColor: color }]}
                />
              </View>
            </Pressable>
          </View>
          <TextInput
            label="Description"
            placeholder="Potatoes are good"
            textAlignVertical="top"
            value={description}
            multiline
            numberOfLines={4}
            onChangeText={setDescription}
          />
        </BodyScrollView>
      </View>
    </>
  );
};
export default edit;

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleInputContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  emojiButton: {
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
    marginTop: 16,
  },
  emojiContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  colorButton: {
    marginTop: 16,
    padding: 1,
    borderWidth: 3,
    borderRadius: 100,
  },
  colorContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
});
