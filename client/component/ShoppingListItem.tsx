import { Animated, Pressable, View, StyleSheet } from "react-native";
import React from "react";
import {
  useShoppingListProductCount,
  useShoppingListUserNicknames,
  useShoppingListValue,
} from "@/stores/persistence/ShoppingListStore";
import ThemedText from "./ThemedText";
import { useDelshoppingListCallback } from "@/stores/persistence/ShoppingListsStore";
import { Link } from "expo-router";
import { borderColor } from "@/utils/Colors";
import IconCircle from "./IconCircle";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";
import { useTheme } from "./ThemeProvider";

const ShoppingListItem = ({ listId }: { listId: string }) => {
  const [name] = useShoppingListValue(listId, "name");
  const [emoji] = useShoppingListValue(listId, "emoji");
  const [color] = useShoppingListValue(listId, "color");

  const productCount = useShoppingListProductCount(listId);
  const userNicknames = useShoppingListUserNicknames(listId);
  const deleteCallback = useDelshoppingListCallback(listId);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const RightAction = () => (
    <View style={{ width: 80, justifyContent: "center" }}>
      <Pressable
        onPress={deleteCallback}
        style={{
          width: "100%",
          minHeight: 70,
          backgroundColor: "#dc2626",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconSymbol name="trash.fill" size={24} color="white" />
      </Pressable>
    </View>
  );

  return (
    <>
      <Animated.View>
        <ReanimatedSwipeable
          key={listId}
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          overshootRight={false}
          enableContextMenu
          renderRightActions={RightAction}
        >
          <Link
            href={{ pathname: "/(index)/list/[listId]", params: { listId } }}
          >
            <View
              className="flex flex-row w-full items-center justify-between"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#374151" : "#d1d5db", // gray-700 : gray-300
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <View
                className="flex-row items-center flex-1"
                style={{ gap: 10 }}
              >
                <IconCircle emoji={emoji} backgroundColor={color} />

                <View className="flex-1">
                  <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    className="text-[15px]"
                  >
                    {name}
                  </ThemedText>

                  <ThemedText
                    className="text-xs mt-0.5"
                    style={{ color: isDark ? "#94a3b8" : "#6b7280" }} // slate-400 : gray-500
                  >
                    {productCount} product{productCount === 1 ? "" : "s"}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.rightContent}>
                {userNicknames.length > 1 && (
                  <View style={styles.nicknameContainer}>
                    {userNicknames.length === 4
                      ? // Show all 4 letters when length is exactly 4
                        userNicknames.map((nickname, index) => (
                          <NicknameCircle
                            key={nickname}
                            nickname={nickname}
                            color={color}
                            index={index}
                          />
                        ))
                      : userNicknames.length > 4
                        ? // Show first 3 letters and ellipsis when length > 4
                          userNicknames
                            .slice(0, 4)
                            .map((nickname, index) => (
                              <NicknameCircle
                                key={nickname}
                                nickname={nickname}
                                color={color}
                                index={index}
                                isEllipsis={index === 3}
                              />
                            ))
                        : // Show all letters when length is 2 or 3
                          userNicknames.map((nickname, index) => (
                            <NicknameCircle
                              key={nickname}
                              nickname={nickname}
                              color={color}
                              index={index}
                            />
                          ))}
                  </View>
                )}
                <IconSymbol name="chevron.right" size={14} color="#A1A1AA" />
              </View>
            </View>
          </Link>
        </ReanimatedSwipeable>
      </Animated.View>
    </>
  );
};

export const NicknameCircle = ({
  nickname,
  color,
  index = 0,
  isEllipsis = false,
}: {
  nickname: string;
  color: string;
  index?: number;
  isEllipsis?: boolean;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ThemedText
      type="defaultSemiBold"
      style={[
        styles.nicknameCircle,
        isEllipsis && styles.ellipsisCircle,
        {
          backgroundColor: color,
          borderColor: isDark ? "#000000" : "#ffffff",
          marginLeft: index > 0 ? -6 : 0,
        },
      ]}
    >
      {isEllipsis ? "..." : nickname[0].toUpperCase()}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nicknameContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  nicknameCircle: {
    fontSize: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 16,
    padding: 1,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  ellipsisCircle: {
    lineHeight: 0,
    marginLeft: -6,
  },
});

export default ShoppingListItem;
