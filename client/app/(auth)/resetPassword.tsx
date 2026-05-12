import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { BodyScrollView } from "../../component/BodyScrollview";
import Button from "../../component/Button";
import TextInput from "../../component/TextInput";
import { ThemedText } from "../../component/ThemedText";
import { useTheme } from "../../component/ThemeProvider";
import { useAuth, useSignIn } from "@clerk/expo";
import Toast from "react-native-toast-message";

const ResetPassword = () => {
  const route = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!timer) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer !== 0]);

  const getErrorMessage = (error: any) =>
    error?.errors?.[0]?.longMessage || "Something went wrong";

  // Send code
  const onResetPasswordPress = async () => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAlertMessage(null);

    try {
      await signIn.create({
        identifier: emailAddress.trim(),
      });

      await signIn.resetPasswordEmailCode.sendCode();

      setPendingVerification(true);
      setTimer(120);

      Toast.show({
        type: "success",
        text1: "please check your email for password reset code.",
      });
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error));
      Toast.show({
        type: "error",
        text1: "Failed to send reset code",
        text2: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // verify code & reset password
  const onVerifyPress = async () => {
    if (!isLoaded || !signIn) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAlertMessage(null);

    try {
      await signIn.resetPasswordEmailCode.verifyCode({
        code: code.trim(),
      });

      await signIn.resetPasswordEmailCode.submitPassword({
        password: password.trim(),
      });

      setAlertMessage("Password reset successful!");
      route.replace("/");
    } catch (error: any) {
      console.log("Verify error:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Resend
  const onResendCode = async () => {
    if (!signIn || timer > 0) return;

    try {
      await signIn.resetPasswordEmailCode.sendCode();
      setTimer(60);
      setAlertMessage("Code resent successfully.");
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <BodyScrollView className="flex-1 bg-background px-6 pt-10 pb-12">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* HEADER */}
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

          <ThemedText
            className={`${
              isDark
                ? "mb-3 text-4xl font-extrabold text-slate-100"
                : "mb-3 text-4xl font-extrabold text-slate-950"
            }`}
          >
            Reset Password
          </ThemedText>

          <ThemedText
            className={`${
              isDark
                ? "text-base leading-7 text-slate-300"
                : "text-base leading-7 text-slate-600"
            }`}
          >
            {!pendingVerification
              ? "Enter your email and we’ll send you a verification code."
              : "Enter the code and your new password."}
          </ThemedText>
        </View>

        {/* FORM */}
        <View
          className={`${
            isDark
              ? "rounded-[24px] bg-indigo-900/25 p-5 shadow-lg shadow-black/20"
              : "rounded-[24px] bg-violet-100 p-5 shadow-lg shadow-black/5"
          }`}
        >
          {!pendingVerification ? (
            <>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                keyboardType="email-address"
                onChangeText={setEmailAddress}
              />

              <Button
                onPress={onResetPasswordPress}
                disabled={!emailAddress || isLoading}
                loading={isLoading}
                size="md"
              >
                Send Code
              </Button>
            </>
          ) : (
            <>
              <TextInput
                value={code}
                placeholder="Enter OTP code"
                keyboardType="number-pad"
                onChangeText={setCode}
              />

              <TextInput
                value={password}
                placeholder="New Password"
                secureTextEntry
                onChangeText={setPassword}
              />

              <Button
                onPress={onVerifyPress}
                disabled={!code || !password || isLoading}
                loading={isLoading}
                size="md"
              >
                Reset Password
              </Button>

              <Button
                variant="ghost"
                onPress={onResendCode}
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </Button>
            </>
          )}

          {/* SUCCESS */}
          {alertMessage && (
            <ThemedText className="text-green-500 mt-3">
              {alertMessage}
            </ThemedText>
          )}

          {/* ERROR */}
          {errorMessage && (
            <ThemedText className="text-red-500 mt-2">
              {errorMessage}
            </ThemedText>
          )}

          {/* FOOTER */}
          <View
            className={`${
              isDark
                ? "mt-4 border-t border-slate-700 pt-4 items-center"
                : "mt-4 border-t border-slate-200 pt-4 items-center"
            }`}
          >
            <ThemedText
              className={`${
                isDark ? "text-sm text-slate-400" : "text-sm text-slate-500"
              }`}
            >
              Remembered your password?
            </ThemedText>

            <Button
              variant="ghost"
              onPress={() => route.push("/")}
              textStyle={{ fontSize: 16 }}
            >
              Back to Sign In
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BodyScrollView>
  );
};

export default ResetPassword;
