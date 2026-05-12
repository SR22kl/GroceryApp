import { appleBlue, zincColors } from "@/utils/Colors";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "./ThemeProvider";

type ButtonVariant = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
  children?: React.ReactNode;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "filled",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  children,
  className,
  textClassName,
}) => {
  // color mode
  const colorScheme = useTheme().theme;

  const isDark = colorScheme === "dark";

  // Size styles
  const sizeStyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };

  // const textSizeStyles = {
  //   sm: "text-sm",
  //   md: "text-base",
  //   lg: "text-lg",
  // };

  // Variants
  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[50] : "#4f46e5",
        };
      case "outline":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? zincColors[700] : zincColors[300],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? zincColors[100] : zincColors[900];
    }
    switch (variant) {
      case "filled":
        return isDark ? zincColors[600] : zincColors[50];
      case "outline":
      case "ghost":
        return appleBlue;
      default:
        return isDark ? "#fff" : "#4f46e5";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      className={className}
      style={[
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size={size === "sm" ? "small" : "large"}
          color={getTextColor()}
        />
      ) : (
        <ThemedText
          className={textClassName}
          style={StyleSheet.flatten([
            {
              fontSize: sizeStyles[size].fontSize,
              textAlign: "center",
              marginBottom: 0,
              fontWeight: "700",
              color: getTextColor(),
            },
            textStyle,
          ])}
        >
          {children}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
