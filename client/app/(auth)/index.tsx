import { BodyScrollView } from "@/component/BodyScrollview";
import TextInput from "@/component/TextInput";
import { useAuth, useSessionList, useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import Button from "../../component/Button";
import { ThemedText } from "../../component/ThemedText";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/component/ThemeProvider";

const SignInScreen = () => {
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();
  const { setActive } = useSessionList();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const route = useRouter();

  const onSignInPress = async () => {
    if (!isLoaded || !setActive) return;

    setIsSigningIn(true);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.error) {
        throw result.error;
      }

      // get session from Clerk
      const sessionId = signIn.createdSessionId;

      if (!sessionId) {
        throw new Error("No session created");
      }

      await setActive({ session: sessionId });

      Toast.show({
        type: "success",
        text1: "Welcome back 👋",
        text2: "Signed in successfully",
      });

      route.replace("/");
    } catch (error: any) {
      console.error("Error signing in:", error);
      Toast.show({
        type: "error",
        text1: "Sign-in failed",
        text2: error?.errors?.[0]?.longMessage || "Invalid email or password",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? "#000000" : "#ffffff"}
        style={isDark ? "light" : "dark"}
      />

      <BodyScrollView
        className="bg-background"
        contentContainerStyle={{
          padding: 16,
          marginTop: 34,
        }}
      >
        <TextInput
          label="Email"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmailAddress}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          autoCapitalize="none"
          secureTextEntry
          onChangeText={setPassword}
        />
        <Button
          onPress={onSignInPress}
          loading={isSigningIn}
          disabled={!emailAddress || !password || isSigningIn}
          variant="filled"
        >
          Sign In
        </Button>

        <View className="mt-4 items-center">
          <ThemedText>Don't have an account?</ThemedText>
          <Button variant="ghost" onPress={() => route.push("/signUp")}>
            SignUp
          </Button>
        </View>

        <View className="mt-4 items-center">
          <ThemedText>Don't remember password?</ThemedText>
          <Button variant="ghost" onPress={() => route.push("/resetPassword")}>
            Reset Password
          </Button>
        </View>
      </BodyScrollView>
    </>
  );
};

export default SignInScreen;
