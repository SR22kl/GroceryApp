import { View, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/component/ThemeProvider";
import { ClerkAPIError } from "@clerk/types";
import { BodyScrollView } from "@/component/BodyScrollview";
import TextInput from "@/component/TextInput";
import Button from "@/component/Button";
import ThemedText from "@/component/ThemedText";
import { useAuth, useSignUp } from "@clerk/expo";
import { useSessionList } from "@clerk/expo";
import Toast from "react-native-toast-message";

const SignUp = () => {
  const route = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();
  const { setActive } = useSessionList();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<ClerkAPIError[] | null>([]);

  const [pendingVerification, setPendingVerification] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setErrors([]);

    try {
      // Create user
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification code
      await signUp.verifications.sendEmailCode();

      Toast.show({
        type: "success",
        text1: "Check your email for the verification code.",
      });

      // Move to OTP screen
      setPendingVerification(true);
    } catch (error: any) {
      setErrors(error.errors || []);

      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error?.errors?.[0]?.longMessage || "Failed to sign up",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const onVerifyPress = async () => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setErrors([]);

    try {
      await signUp.verifications.verifyEmailCode({ code });

      const session = signUp.createdSessionId;

      if (setActive && session) {
        await setActive({ session });
        Toast.show({
          type: "success",
          text1: "Welcome aboard 👋",
          text2: "Your GrocyGo account has been created",
        });
        route.replace("/");
      } else {
        console.log("VERIFY DEBUG:", {
          setActive,
          session,
          status: signUp?.status,
          createdSessionId: signUp?.createdSessionId,
        });
      }
    } catch (error: any) {
      setErrors(error.errors || []);
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: error?.errors?.[0]?.longMessage || "Failed to verify email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <BodyScrollView className="flex-1 px-6 pt-16">
        <View className="gap-6">
          <ThemedText type="title" className="text-center">
            Verify Account
          </ThemedText>

          <TextInput
            value={code}
            label={`Code sent to ${emailAddress}`}
            placeholder="Enter verification code"
            onChangeText={setCode}
          />

          <Button
            onPress={onVerifyPress}
            disabled={!code || isLoading}
            loading={isLoading}
            size="lg"
          >
            Verify
          </Button>

          {errors?.map((err) => (
            <ThemedText key={err.longMessage} style={{ color: "red" }}>
              {err.longMessage}
            </ThemedText>
          ))}
        </View>
      </BodyScrollView>
    );
  }

  return (
    <BodyScrollView className="flex-1 bg-background px-6 pt-12 pb-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-between"
      >
        {/* Header */}
        <View
          className={`${
            isDark
              ? "mb-7 overflow-hidden rounded-[24px] bg-purple-950/25 p-6"
              : "mb-7 overflow-hidden rounded-[24px] bg-purple-100 p-6"
          }`}
        >
          <View
            className={`${
              isDark
                ? "absolute -right-6 -top-5 h-28 w-28 rounded-full bg-purple-800/30"
                : "absolute -right-6 -top-5 h-28 w-28 rounded-full bg-purple-200"
            }`}
          />
          <ThemedText type="title">Create Account</ThemedText>

          <ThemedText type="subtitle" className="opacity-70">
            Enter your email and password to get started.
          </ThemedText>
        </View>

        {/*Form */}
        <View
          className={
            isDark
              ? `rounded-[24px] bg-slate-950 p-5 shadow-lg shadow-black/20`
              : `rounded-[24px] bg-violet-100 p-5 shadow-lg shadow-black/5`
          }
        >
          <TextInput
            label="Email address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            onPress={onSignUpPress}
            disabled={!emailAddress || !password || isLoading}
            loading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          >
            Continue
          </Button>

          {errors?.map((err) => (
            <ThemedText key={err.longMessage} style={{ color: "red" }}>
              {err.longMessage}
            </ThemedText>
          ))}

          {/*Footer */}
          <View className="mt-10 items-center gap-2">
            <ThemedText className="opacity-70">
              Already have an account?
            </ThemedText>

            <Button
              variant="ghost"
              onPress={() => route.push("/")}
              textStyle={{ fontSize: 16 }}
            >
              Sign In
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BodyScrollView>
  );
};

export default SignUp;
