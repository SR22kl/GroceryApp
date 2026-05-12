import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import React from "react";

const AuthRoutesLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(index)" />;
  return (
    <>
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
        <Stack.Screen
          name="index"
          options={{ headerShown: false, headerTitle: "Sign In" }}
        />
        <Stack.Screen
          name="signUp"
          options={{ headerShown: false, headerTitle: "Sign Up" }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{ headerShown: false, headerTitle: "Reset Password" }}
        />
      </Stack>
    </>
  );
};

export default AuthRoutesLayout;
