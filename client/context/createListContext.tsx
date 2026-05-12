import React, { createContext, useContext, useState } from "react";

type createListContextType = {
  selectedEmoji: string;
  selectedColor: string;
  setSelectedEmoji: (emoji: string) => void;
  setSelectedColor: (color: string) => void;
};

const createListContext = createContext<createListContextType | undefined>(
  undefined,
);

export function CreateListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#9ccaff");
  return (
    <createListContext.Provider
      value={{
        selectedEmoji,
        setSelectedEmoji,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
    </createListContext.Provider>
  );
}

export function useCreateList() {
  const context = useContext(createListContext);

  if (context === undefined) {
    throw new Error("Component must be wrap with createListProvider");
  }

  return context;
}
