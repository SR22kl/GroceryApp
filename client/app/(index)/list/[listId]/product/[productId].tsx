import { View, TouchableOpacity, Text } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import {
  useShoppingListProductCell,
  useShoppingListProductCreatedByNickname,
  useShoppingListUserNicknames,
} from "@/stores/persistence/ShoppingListStore";
import { BodyScrollView } from "@/component/BodyScrollview";
import ThemedText from "@/component/ThemedText";
import { zincColors } from "@/utils/Colors";
import TextInput from "@/component/TextInput";
import { IconSymbol } from "@/component/IconSymbol";
import { formatFriendlyDate } from "@/utils/dateUtils";
import { Avatar } from "@/component/Avatar";
import { useTheme } from "@/component/ThemeProvider";

const ProductScreen = () => {
  const { listId, productId } = useLocalSearchParams() as {
    listId: string;
    productId: string;
  };

  // Check if the product exists by trying to get any of its properties
  const [name] = useShoppingListProductCell(listId, productId, "name");

  useEffect(() => {
    if (name === undefined) {
      router.replace(`/list/${listId}`);
    }
  }, [listId, name]);

  // If the product is deleted, show nothing while redirecting
  if (name === undefined) {
    return null;
  }

  return <ProductContent listId={listId} productId={productId} />;
};

function ProductContent({
  listId,
  productId,
}: {
  listId: string;
  productId: string;
}) {
  const [name, setName] = useShoppingListProductCell(listId, productId, "name");
  const [quantity, setQuantity] = useShoppingListProductCell(
    listId,
    productId,
    "quantity",
  );
  const [units, setUnits] = useShoppingListProductCell(
    listId,
    productId,
    "units",
  );
  const [notes, setNotes] = useShoppingListProductCell(
    listId,
    productId,
    "notes",
  );
  const createdBy = useShoppingListProductCreatedByNickname(listId, productId);

  const [createdAt] = useShoppingListProductCell(
    listId,
    productId,
    "createdAt",
  );

  const userNicknames = useShoppingListUserNicknames(listId);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleInviteCollaborators = () => {
    // Navigate to share screen
    router.push(`/list/${listId}/share`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#e4e4e7" }}>
      <BodyScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 32,
        }}
      >
        <SectionHeader title="GENERAL" />

        <View style={{ gap: 10, marginBottom: 32 }}>
          <FieldItem label="Product name" value={name} onChangeText={setName} />
          <FieldItem
            label="Quantity"
            value={quantity.toString()}
            onChangeText={(value) => setQuantity(Number(value))}
          />
          <FieldItem label="Units" value={units} onChangeText={setUnits} />

          <View style={{ gap: 10 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
                Notes
              </ThemedText>
            </View>
            <TextInput
              value={notes || ""}
              editable={true}
              onChangeText={setNotes}
              variant="default"
              placeholder="Add a note..."
              multiline
              numberOfLines={4}
              inputStyle={{
                minHeight: 120,
                textAlignVertical: "top",
                paddingTop: 12,
                backgroundColor: isDark ? zincColors[800] : zincColors[50],
                borderRadius: 8,
              }}
              containerStyle={{
                backgroundColor: isDark ? zincColors[800] : zincColors[50],
                borderRadius: 8,
                borderColor: isDark ? zincColors[800] : zincColors[200],
              }}
            />
          </View>
        </View>

        {/* Meta Section */}
        <Text
          style={{
            fontSize: 16,
            color: isDark ? zincColors[400] : zincColors[500],
            letterSpacing: 0.5,
            marginBottom: 10,
            marginTop: 40,
          }}
        >
          META
        </Text>
        <View style={{ marginBottom: 10 }}>
          <FieldItem label="Created by" value={createdBy ?? "unknown"} />
          <FieldItem
            label="Created at"
            value={createdAt ? formatFriendlyDate(createdAt) : "unknown"}
          />
        </View>

        {/* SHARING Section */}

        <SectionHeader title="SHARING" />

        <View style={{ gap: 8 }}>
          {/* User avatars */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {userNicknames.map((nickname) => (
              <Avatar key={nickname} name={nickname} size={36} />
            ))}

            {/* Add collaborator button */}
            <TouchableOpacity
              onPress={handleInviteCollaborators}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? zincColors[700] : zincColors[200],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: isDark ? zincColors[600] : zincColors[300],
                borderStyle: "dashed",
              }}
            >
              <IconSymbol
                name="plus"
                size={16}
                color={isDark ? zincColors[400] : zincColors[500]}
              />
            </TouchableOpacity>
          </View>

          {/* User names */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {userNicknames.map((nickname, index) => (
              <ThemedText
                key={nickname}
                type="default"
                style={{
                  color: isDark ? zincColors[400] : zincColors[600],
                  fontSize: 14,
                }}
              >
                {nickname}
                {index < userNicknames.length - 1 ? ", " : ""}
              </ThemedText>
            ))}
          </View>
        </View>
      </BodyScrollView>
    </View>
  );
}

export default ProductScreen;

function SectionHeader({ title }: { title: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ThemedText
      type="defaultSemiBold"
      style={{
        fontSize: 16,
        color: isDark ? zincColors[400] : zincColors[500],
        letterSpacing: 0.5,
        marginBottom: 16,
        marginTop: 20,
      }}
    >
      {title}
    </ThemedText>
  );
}

function FieldItem({
  label,
  value,
  onChangeText,
  showEditIcon = false,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  showEditIcon?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        minHeight: 44,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}
      >
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
          {label}
        </ThemedText>
        {showEditIcon && onChangeText && (
          <IconSymbol
            name="pencil"
            size={16}
            color={isDark ? zincColors[400] : zincColors[500]}
          />
        )}
      </View>

      <TextInput
        value={value}
        editable={onChangeText !== undefined}
        onChangeText={onChangeText}
        variant="ghost"
        placeholder="..."
        size="sm"
        containerStyle={{ maxWidth: "60%", minWidth: 100 }}
        inputStyle={{
          padding: 0,
          margin: 0,
          textAlign: "right",
          fontSize: 16,
          color: isDark ? zincColors[300] : zincColors[600],
        }}
      />
    </View>
  );
}
