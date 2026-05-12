import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import Button from "@/component/Button";
import { Link, Stack, useRouter } from "expo-router";
import { useTheme } from "@/component/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "@/component/NavBar";
import { useShoppingListIds } from "@/stores/persistence/ShoppingListsStore";
import IconCircle from "@/component/IconCircle";
import { backgroundColors } from "@/utils/Colors";
import ShoppingListItem from "@/component/ShoppingListItem";
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const shoppingListIds = useShoppingListIds();
  const router = useRouter();

  const renderEmptyList = () => {
    return (
      <View
        className="items-center gap-2 pt-24 flex-1"
        style={{ backgroundColor: isDark ? "#0f172a" : "#e4e4e7" }}
      >
        <IconCircle
          emoji="🛒"
          backgroundColor={
            backgroundColors[
              Math.floor(Math.random() * backgroundColors.length)
            ]
          }
        />

        <Button
          className=""
          onPress={() => router.push("/(index)/list/new")}
          variant="ghost"
        >
          Create Your First List
        </Button>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? "#111827" : "#ffffff"}
        style={isDark ? "light" : "dark"}
      />
      <SafeAreaView
        edges={["top", "bottom"]}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? "#020617" : "#e4e4e7",
          }}
        >
          <NavBar title="Shopping List" showAdd showSettings />

          <FlatList
            data={shoppingListIds}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ListEmptyComponent={renderEmptyList}
            renderItem={({ item: listId }) => (
              <ShoppingListItem listId={listId} />
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
