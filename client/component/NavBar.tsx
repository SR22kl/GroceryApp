import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/component/ThemedText";
import { useTheme } from "@/component/ThemeProvider";

type NavBarProps = {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showAdd?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
};

const NavBar = ({
  title = "",
  showBack = false,
  showSettings = false,
  showAdd = false,
  onBackPress,
  rightComponent,
}: NavBarProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const iconColor = isDark ? "#fff" : "#000";
  const backgroundColor = isDark ? "#111827" : "#fff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress || (() => router.back())}
            style={styles.button}
          >
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <ThemedText
          numberOfLines={1}
          ellipsizeMode="tail"
          className="truncate"
          style={styles.title}
        >
          {title}
        </ThemedText>
      </View>

      <View style={styles.right}>
        {rightComponent ? (
          rightComponent
        ) : (
          <>
            {showAdd && (
              <TouchableOpacity
                onPress={() => router.push("/(index)/list/new")}
                style={styles.button}
              >
                <Ionicons name="add" size={26} color={iconColor} />
              </TouchableOpacity>
            )}

            {showSettings && (
              <TouchableOpacity
                onPress={() => router.push("/(index)/profile")}
                style={styles.button}
              >
                <Ionicons name="settings-outline" size={22} color={iconColor} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: {
    width: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  right: {
    width: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export default NavBar;
