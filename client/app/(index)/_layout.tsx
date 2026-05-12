import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack, useRouter } from "expo-router";
import Button from "@/component/Button";
import { useUser } from "@clerk/expo";
import { CreateListProvider } from "@/context/createListContext";
import { Provider as TinybaseProvider } from "tinybase/ui-react";
import ShoppingListsStore from "@/stores/persistence/ShoppingListsStore";

const HomeRoutesLayout = () => {
  const router = useRouter();

  const { user } = useUser();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
      <TinybaseProvider>
        <ShoppingListsStore />
        <CreateListProvider>
          <Stack
            screenOptions={{
              ...(process.env.EXPO_OS === "ios"
                ? {
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBlurEffect: "systemChromeMaterial",
                    headerLargeTitleShadowVisible: false,
                    headerShadowVisible: true,
                    headerLargeStyle: {
                      backgroundColor: "transparent",
                    },
                  }
                : {
                    headerTransparent: false,
                    headerStyle: {
                      backgroundColor: "#ffffff",
                    },
                    headerTitleStyle: {
                      fontWeight: "600",
                      fontSize: 18,
                    },
                    headerShadowVisible: false,
                    headerElevation: 0,
                  }),
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="list/new/index"
              options={{
                headerShown: false,
                presentation: "formSheet",
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="list/new/scan"
              options={{
                presentation: "fullScreenModal",
                headerTitle: "Scan QR Code",
                sheetAllowedDetents: [0.75, 1],
                headerShown: false,
                headerLeft: () => (
                  <Button variant="ghost" onPress={() => router.back()}>
                    Cancel
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="emojiPicker"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.5, 0.75, 1],
              }}
            />

            <Stack.Screen
              name="colorPicker"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.5, 0.75, 1],
              }}
            />

            <Stack.Screen
              name="list/[listId]/product/new"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.5, 0.75, 1],
                headerTitle: "Add Product",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="list/[listId]/product/edit"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.5, 0.75, 1],
                headerTitle: "Edit Product",
              }}
            />
            <Stack.Screen
              name="list/[listId]/product/share"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                headerTitle: "Share List",
              }}
            />
            <Stack.Screen
              name="list/[listId]/product/[productId]"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                headerTitle: "Product",
              }}
            />
          </Stack>
        </CreateListProvider>
      </TinybaseProvider>
    </>
  );
};

export default HomeRoutesLayout;
