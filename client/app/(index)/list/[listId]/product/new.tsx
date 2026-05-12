import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, Text, View } from "react-native";
import { useAddShoppingListProductCallback } from "@/stores/persistence/ShoppingListStore";
import ThemedText from "@/component/ThemedText";
import Button from "@/component/Button";
import { IconSymbol } from "@/component/IconSymbol";
import TextInput from "@/component/TextInput";
import { BodyScrollView } from "@/component/BodyScrollview";
import { useTheme } from "@/component/ThemeProvider";

const NewItemScreen = () => {
  const { listId } = useLocalSearchParams() as { listId: string };
  const [name, setName] = useState("");
  const [units, setUnits] = useState("kg");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const router = useRouter();
  const addShoppingListProduct = useAddShoppingListProductCallback(listId);

  const handleCreateProduct = () => {
    if (!name.trim()) {
      Alert.alert(
        "📝 Product title required",
        "🛒 Please provide a product title to add it to your shopping list.",
        [{ text: "OK" }],
      );
      return;
    }

    addShoppingListProduct(name.trim(), quantity, units, notes);

    router.back();
  };

  return (
    <>
      <View
        className={`flex-1 px-4 pt-4 ${isDark ? "bg-slate-950" : "bg-zinc-200"}`}
      >
        <View className="items-center pt-2 pb-2">
          {/* Drag handle */}
          <View
            className={`w-10 h-1.5 rounded-full ${
              isDark ? "bg-slate-700" : "bg-gray-400"
            }`}
          />

          {/* Header with buttons */}
          <View className="flex-row items-center justify-between w-full px-4">
            <Button variant="ghost" onPress={router.back}>
              Cancel
            </Button>

            <Text
              className={`text-base font-semibold ${
                isDark ? "text-slate-200" : "text-gray-800"
              }`}
            >
              Add Product
            </Text>

            <Button
              variant="ghost"
              onPress={handleCreateProduct}
              disabled={!name.trim()}
            >
              Save
            </Button>
          </View>
        </View>
        <BodyScrollView
          contentContainerStyle={{
            padding: 16,
          }}
        >
          <TextInput
            label="Name"
            placeholder="Potatoes"
            value={name}
            onChangeText={setName}
            autoFocus={true}
            onSubmitEditing={handleCreateProduct}
            returnKeyType="done"
          />
          <TextInput
            label="Units"
            placeholder="kg"
            value={units}
            onChangeText={setUnits}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ThemedText>
              x{quantity} {units}
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                onPress={() => setQuantity(Math.max(0, quantity - 1))}
                variant="ghost"
              >
                <IconSymbol name="minus" color={"gray"} />
              </Button>
              <Button onPress={() => setQuantity(quantity + 1)} variant="ghost">
                <IconSymbol name="plus" color={"gray"} />
              </Button>
            </View>
          </View>
          <TextInput
            label="Notes"
            placeholder="Potatoes are good"
            textAlignVertical="top"
            value={notes}
            multiline={true}
            numberOfLines={4}
            inputStyle={{
              height: 100,
            }}
            onChangeText={setNotes}
          />
          {Platform.OS !== "ios" && (
            <Button onPress={handleCreateProduct} disabled={!name.trim()}>
              Add product
            </Button>
          )}
        </BodyScrollView>
      </View>
    </>
  );
};

export default NewItemScreen;
