import { View, Text, StyleSheet, Share } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { BodyScrollView } from "@/component/BodyScrollview";
import ThemedText from "@/component/ThemedText";
import QRCode from "react-native-qrcode-svg";
import Button from "@/component/Button";
import { useTheme } from "@/component/ThemeProvider";

const share = () => {
  const { listId } = useLocalSearchParams() as { listId: string };
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleShareListCode = async () => {
    const shareMessage = `🛒 Join my shopping list!\n\nPaste this code in the app to start collaborating:\n\n${listId}\n\nDon't have the app yet? Download it here:\nhttps://apps.apple.com/us/app/shopping-list-sync-share/id6739513017`;

    try {
      await Share.share({ message: shareMessage });
    } catch (error) {
      console.error("Error sharing list code:", error);
    }
  };

  return (
    <View
      className="flex-1"
    >
      <BodyScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? "#0f172a" : "#fff" },
        ]}
      >
        <View style={styles.heroSection}>
          <ThemedText type="subtitle" style={styles.title}>
            Invite Collaborators
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.subtitle, { color: isDark ? "#94a3b8" : "#6b7280" }]}
          >
            Share your list with family and friends to collaborate in real-time
          </ThemedText>
        </View>

        <View style={styles.qrSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Scan QR Code
          </ThemedText>
          <View
            style={[
              styles.qrContainer,
              { backgroundColor: isDark ? "#1e293b" : "#ffffff" },
            ]}
          >
            <QRCode size={220} value={`grocygo://list/new?listId=${listId}`} />
          </View>
        </View>

        <View style={styles.divider}>
          <View
            style={[
              styles.line,
              {
                backgroundColor: isDark
                  ? "rgba(203, 213, 225, 0.2)"
                  : "rgba(150, 150, 150, 0.2)",
              },
            ]}
          />
          <ThemedText
            type="default"
            style={[styles.orText, { color: isDark ? "#94a3b8" : "#6b7280" }]}
          >
            or
          </ThemedText>
          <View
            style={[
              styles.line,
              {
                backgroundColor: isDark
                  ? "rgba(203, 213, 225, 0.2)"
                  : "rgba(150, 150, 150, 0.2)",
              },
            ]}
          />
        </View>

        <Button
          onPress={handleShareListCode}
          variant="ghost"
          style={styles.shareButton}
        >
          Share List Code
        </Button>

        <ThemedText
          style={[styles.disclaimer, { color: isDark ? "#94a3b8" : "#6b7280" }]}
        >
          ⚠️ Only share your list with people you trust. Anyone with the code
          can join and edit your list.
        </ThemedText>
      </BodyScrollView>
    </View>
  );
};

export default share;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    paddingHorizontal: 16,
  },
  qrSection: {
    alignItems: "center",
    gap: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
  },
  orText: {
    color: "gray",
  },
  shareButton: {
    minWidth: 200,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginTop: 24,
    maxWidth: "90%",
  },
});
