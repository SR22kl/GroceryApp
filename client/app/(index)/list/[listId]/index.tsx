import * as React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import ThemedText from "@/component/ThemedText";
import {
  useShoppingListProductIds,
  useShoppingListValue,
} from "@/stores/persistence/ShoppingListStore";
import { IconSymbol } from "@/component/IconSymbol";
import Animated from "react-native-reanimated";
import { BodyScrollView } from "@/component/BodyScrollview";
import Button from "@/component/Button";
import ShoppingListProductItem from "@/component/ShoppingListProductItem";
import { useTheme } from "@/component/ThemeProvider";
import NavBar from "@/component/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";

const ListScreen = () => {
  const { listId } = useLocalSearchParams() as { listId: string };
  const [name] = useShoppingListValue(listId, "name");
  const [emoji] = useShoppingListValue(listId, "emoji");
  const [description] = useShoppingListValue(listId, "description");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const newProductHref = {
    pathname: "/(index)/list/[listId]/product/new",
    params: { listId: listId },
  } as const;
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDark ? "#020617" : "#e4e4e7" }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor: isDark ? "#111827" : "#ffffff",
        }}
      >
        <NavBar
          title={`${emoji} ${name}`}
          showBack
          rightComponent={
            <View className="flex flex-row items-center">
              <Pressable
                style={{ padding: 8 }}
                onPress={() => {
                  router.push({
                    pathname: "/(index)/list/[listId]/product/share",
                    params: { listId },
                  });
                }}
              >
                <IconSymbol name="square.and.arrow.up" color={"#007AFF"} />
              </Pressable>

              <Pressable
                style={{ padding: 8 }}
                onPress={() =>
                  router.push({
                    pathname: "/(index)/list/[listId]/product/edit",
                    params: { listId },
                  })
                }
              >
                <IconSymbol
                  name="pencil.and.list.clipboard"
                  color={"#007AFF"}
                />
              </Pressable>

              <Pressable
                style={{ padding: 8 }}
                onPress={() => router.push(newProductHref)}
              >
                <IconSymbol name="plus" color={"#007AFF"} />
              </Pressable>
            </View>
          }
        />
      </SafeAreaView>

      <Animated.FlatList
        data={useShoppingListProductIds(listId)}
        renderItem={({ item: productId }) => (
          <ShoppingListProductItem listId={listId} productId={productId} />
        )}
        style={{
          backgroundColor: isDark ? "#020617" : "#e4e4e7",
        }}
        contentContainerStyle={{
          paddingTop: 12,
          flexGrow: 1,
        }}
        ListHeaderComponent={() =>
          description ? (
            <ThemedText
              style={{
                paddingHorizontal: 16,
                fontSize: 14,
                color: isDark ? "#94a3b8" : "#6b7280",
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              {description}
            </ThemedText>
          ) : null
        }
        ListEmptyComponent={() => (
          <BodyScrollView
            contentContainerStyle={{
              alignItems: "center",
              gap: 8,
              paddingTop: 100,
              flexGrow: 1,
            }}
          >
            <Button
              onPress={() => {
                router.push(newProductHref);
              }}
              variant="ghost"
            >
              Add the first product to this list
            </Button>
          </BodyScrollView>
        )}
      />
    </View>
  );
};

export default ListScreen;
