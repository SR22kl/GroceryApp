import React from "react";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "trash.fill": "delete",
  "pencil.and.list.clipboard": "edit",
  person: "person",
  "person.fill": "person",
  plus: "add",
  star: "star",
  minus: "remove",
  square: "square",
  circle: "circle",
  "checkmark.square.fill": "check-box",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "check-circle",
  "square.and.arrow.up": "share",
  "qrcode.viewfinder": "qr-code",
  gear: "settings",
  pencil: "edit",
  "arrow.down.circle": "arrow-downward",
  "sun.max.fill": "light-mode",
  "moon.fill": "dark-mode",
} as const;

export type IconSymbolName = keyof typeof MAPPING;
export type MaterialIconName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] as MaterialIconName}
      style={style as StyleProp<TextStyle>}
    />
  );
}
