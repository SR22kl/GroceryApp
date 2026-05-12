import React, { useEffect } from "react";
import { BodyScrollView } from "@/component/BodyScrollview";
import ThemedText from "@/component/ThemedText";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@/component/ThemeProvider";
import { appleBlue, appleGreen, appleRed } from "@/utils/Colors";
import { IconSymbol } from "@/component/IconSymbol";
import Button from "@/component/Button";

const profileScreen = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (!Device.isDevice || Constants.executionEnvironment !== "standalone")
      return;

    Updates.checkForUpdateAsync();
  }, []);

  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
    } catch (error) {
      Alert.alert(
        "Update Failed",
        "Failed to download the update. Please try again.",
      );
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out GrocyGo App: Sync & Share on the App Store!",
        url: "https://apps.apple.com/us/app/grocygo/id6739513017",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRate = async () => {
    try {
      await Linking.openURL(
        "https://apps.apple.com/us/app/grocygo/id6739513017?action=write-review",
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)");
  };

  const handleDeleteAccount = async () => {
    try {
      Alert.alert(
        "Delete account",
        "Are you sure you want to delete your account? This action is irreversible.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await user?.delete();
              router.replace("/(auth)");
            },
            style: "destructive",
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete account");
      console.error(error);
    }
  };

  const cardStyle = {
    backgroundColor: isDark ? "#111827" : "#ffffff",
    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
  };

  return (
    <>
      <BodyScrollView
        style={{
          backgroundColor: isDark ? "#0b1120" : "#f3f6fb",
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Profile Card */}
        <View style={[styles.card, cardStyle]}>
          <View style={styles.header}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  {
                    backgroundColor: isDark ? "#1f2937" : "#e5e7eb",
                  },
                ]}
              >
                <IconSymbol
                  name="person.fill"
                  size={40}
                  color={isDark ? "#fff" : "#111"}
                />
              </View>
            )}

            <View style={styles.userInfo}>
              <ThemedText
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: isDark ? "#ffffff" : "#111827",
                  marginBottom: 6,
                }}
              >
                {user?.emailAddresses[0].emailAddress}
              </ThemedText>

              <ThemedText
                style={{
                  color: isDark ? "#94a3b8" : "#6b7280",
                  fontSize: 14,
                }}
              >
                Joined {user?.createdAt?.toDateString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleShare}
              style={[
                styles.actionButton,
                styles.actionButtonLeft,
                {
                  backgroundColor: isDark ? "#172554" : "#eef4ff",
                  borderWidth: 1,
                  borderColor: isDark ? "#1e3a8a" : "#dbeafe",
                },
              ]}
            >
              <IconSymbol
                name="square.and.arrow.up"
                color={appleBlue}
                size={20}
              />

              <ThemedText type="defaultSemiBold" style={{ color: appleBlue }}>
                Share app
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleRate}
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark ? "#172554" : "#eef4ff",
                  borderWidth: 1,
                  borderColor: isDark ? "#1e3a8a" : "#dbeafe",
                },
              ]}
            >
              <IconSymbol name="star" color={appleBlue} size={20} />

              <ThemedText type="defaultSemiBold" style={{ color: appleBlue }}>
                Rate app
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.themeSection}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                color: isDark ? "#e2e8f0" : "#334155",
                marginBottom: 14,
                fontSize: 15,
              }}
            >
              Display mode
            </ThemedText>

            <Pressable
              onPress={toggleTheme}
              style={[
                styles.themeTabsContainer,
                {
                  backgroundColor: isDark ? "#0f172a" : "#e2e8f0",
                  borderColor: isDark ? "#1e293b" : "#cbd5e1",
                },
              ]}
            >
              {/* Light Tab */}
              <View
                style={[
                  styles.themeTab,
                  {
                    backgroundColor: !isDark ? "#ffffff" : "transparent",
                  },
                ]}
              >
                <IconSymbol
                  name="sun.max.fill"
                  size={18}
                  color={!isDark ? "#f59e0b" : "#94a3b8"}
                />

                <ThemedText
                  style={{
                    color: !isDark ? "#111827" : "#94a3b8",
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  Light
                </ThemedText>
              </View>

              {/* Dark Tab */}
              <View
                style={[
                  styles.themeTab,
                  {
                    backgroundColor: isDark ? "#1e293b" : "transparent",
                  },
                ]}
              >
                <IconSymbol
                  name="moon.fill"
                  size={18}
                  color={isDark ? "#60a5fa" : "#94a3b8"}
                />

                <ThemedText
                  style={{
                    color: isDark ? "#ffffff" : "#94a3b8",
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  Dark
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>

        {/* App Card */}
        <View style={[styles.card, cardStyle]}>
          <ThemedText
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 6,
              color: isDark ? "#fff" : "#111827",
            }}
          >
            Shopping List: Sync & Share
          </ThemedText>

          <ThemedText
            style={{
              textAlign: "center",
              opacity: 0.7,
              fontSize: 14,
              color: isDark ? "#cbd5e1" : "#64748b",
            }}
          >
            v{Application.nativeApplicationVersion}
          </ThemedText>
        </View>

        {/* Updates Card */}
        <View style={[styles.card, cardStyle]}>
          <View style={styles.infoRow}>
            <ThemedText
              type="defaultSemiBold"
              style={{
                color: isDark ? "#fff" : "#111827",
              }}
            >
              Last update
            </ThemedText>

            <ThemedText
              style={{
                color: isDark ? "#cbd5e1" : "#475569",
              }}
            >
              {new Date(Updates.createdAt).toDateString()}
            </ThemedText>
          </View>

          <View
            style={[
              styles.separator,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    color: isDark ? "#fff" : "#111827",
                  }}
                >
                  Update ID
                </ThemedText>

                <ThemedText
                  style={{
                    fontSize: 12,
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  {Updates.isEmbeddedLaunch ? "Embedded" : "Downloaded"}
                </ThemedText>
              </View>

              <ThemedText
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  marginTop: 6,
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                {Updates.updateId}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Update Status */}
        {isUpdateAvailable ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#052e16" : "#f0fdf4",
                borderColor: isDark ? "#166534" : "#bbf7d0",
              },
            ]}
          >
            <IconSymbol name="arrow.down.circle" color={appleGreen} size={26} />

            <ThemedText
              style={[
                styles.updateText,
                {
                  color: appleGreen,
                },
              ]}
            >
              A new update is available!
            </ThemedText>

            <Button
              variant="filled"
              onPress={handleUpdate}
              style={{
                backgroundColor: appleGreen,
              }}
            >
              Download and install update
            </Button>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#071a12" : "#f7fef9",
                borderColor: isDark ? "#14532d" : "#dcfce7",

                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              },
            ]}
          >
            <IconSymbol
              name="checkmark.circle.fill"
              color={appleGreen}
              size={24}
            />

            <Button
              variant="ghost"
              onPress={() =>
                Alert.alert(
                  "✅ All clear!",
                  "Even the bugs are taking a day off!",
                )
              }
              textStyle={{
                color: appleGreen,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              No bug fixes available
            </Button>
          </View>
        )}

        {/* ACCOUNT ACTIONS */}
        <View style={styles.accountActions}>
          <Button
            onPress={handleSignOut}
            variant="outline"
            style={{
              borderColor: appleRed,
              backgroundColor: isDark ? "#1f1113" : "#fff5f5",
            }}
            textStyle={{
              color: appleRed,
            }}
          >
            Sign out
          </Button>

          <Button
            onPress={handleDeleteAccount}
            variant="ghost"
            textStyle={{
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            Delete account
          </Button>
        </View>
      </BodyScrollView>
    </>
  );
};

export default profileScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 18,
    paddingTop: 36,
    paddingBottom: 40,
  },

  card: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,

    borderWidth: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.08,
    shadowRadius: 24,

    elevation: 8,

    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginRight: 18,

    borderWidth: 3,
    borderColor: appleBlue,

    shadowColor: appleBlue,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.35,
    shadowRadius: 12,
  },

  placeholderImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginRight: 18,

    alignItems: "center",
    justifyContent: "center",
  },

  userInfo: {
    flex: 1,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  actionButton: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 18,
    paddingVertical: 15,

    borderRadius: 20,
    gap: 8,
  },

  actionButtonLeft: {
    marginRight: 12,
  },

  themeToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },

  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 10,
  },

  separator: {
    height: 1,
    marginVertical: 10,
    opacity: 0.5,
  },

  updateText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 14,
    fontWeight: "600",
  },

  accountActions: {
    marginTop: 22,
    gap: 12,
  },
  themeSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },

  themeTabsContainer: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  themeTab: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    paddingVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
});
