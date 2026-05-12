import { useUser } from "@clerk/expo";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore, NoValuesSchema } from "tinybase/with-schemas";
import { useCreateClientPersisterAndStart } from "./useCreateCP&Start";
import { useCreateServerSynchronizerAndStart } from "../sycn/useServerSync&Start";
import ShoppingListStore from "./ShoppingListStore";
import { useCallback } from "react";
import { randomUUID } from "expo-crypto";

const STORE_ID_PREFIX = "shoppingListsStore-";

const TABLES_SCHEMA = {
  lists: {
    id: { type: "string" },
    initialValues: { type: "string" },
  },
} as const;

const {
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideStore,
  useRowIds,
  useStore,
  useTable,
} = UiReact as UiReact.WithSchemas<[typeof TABLES_SCHEMA, NoValuesSchema]>;

const useStoreId = () => STORE_ID_PREFIX + useUser().user?.id;

//Returns a cb that adds new shopping-list to the store.
export const useAddShoppingListCallback = () => {
  const store = useStore(useStoreId());

  return useCallback(
    (name: string, description: string, emoji: string, color: string) => {
      const id = randomUUID();
      store.setRow("lists", id, {
        initialValues: JSON.stringify([
          {},
          {
            id,
            name,
            description,
            emoji,
            color,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]),
      });
      return id;
    },
    [store],
  );
};

// Returns a callback that adds an existing shopping list to the store.
export const useJoinShoppingListCallback = () => {
  const store = useStore(useStoreId());
  return useCallback(
    (listId: string) => {
      store.setRow("lists", listId, {
        id: listId,
        initialValues: "{}",
      });
    },
    [store],
  );
};

export const useShoppingListIds = () => useRowIds("lists", useStoreId());

//Returns a cb that deletes a shopping list from the store
export const useDelshoppingListCallback = (id: string) =>
  useDelRowCallback("lists", id, useStoreId());

export default function ShoppingListsStore() {
  const storeId = useStoreId();
  const store = useCreateMergeableStore(
    () => createMergeableStore().setTablesSchema(TABLES_SCHEMA),
    [],
  );

  useCreateClientPersisterAndStart(storeId, store);
  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  const currentUserLists = useTable("lists", storeId);

  return Object.entries(currentUserLists).map(([listId, { initialValues }]) => (
    <ShoppingListStore
      key={listId}
      listId={listId}
      initialValues={initialValues}
    />
  ));
}
