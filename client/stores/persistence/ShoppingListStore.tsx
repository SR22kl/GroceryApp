import * as UiReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore } from "tinybase/with-schemas";
import type { Value } from "tinybase/store/with-schemas";
import { useCreateServerSynchronizerAndStart } from "../sycn/useServerSync&Start";
import { useCreateClientPersisterAndStart } from "./useCreateCP&Start";
import { useUserIdAndNickname } from "@/context/hooks/useNicknames";
import { Cell } from "tinybase/with-schemas";
import { useCallback } from "react";
import { randomUUID } from "expo-crypto";

const STORE_ID_PREFIX = "shoppingListStore-";

const VALUES_SCHEMA = {
  listId: { type: "string" },
  name: { type: "string" },
  description: { type: "string" },
  emoji: { type: "string" },
  color: { type: "string" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
} as const;

const TABLES_SCHEMA = {
  products: {
    id: { type: "string" },
    name: { type: "string" },
    quantity: { type: "number" },
    units: { type: "string" },
    isPurchased: { type: "boolean", default: false },
    category: { type: "string", default: "" },
    notes: { type: "string" },
    createdBy: { type: "string" }, // userId
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  collaborators: {
    nickname: { type: "string" },
  },
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];
type ShoppingListValueId = keyof typeof VALUES_SCHEMA;
type ShoppingListProductCellId = keyof (typeof TABLES_SCHEMA)["products"];

const {
  useCell,
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideRelationships,
  useProvideStore,
  useRowCount,
  useSetCellCallback,
  useSetValueCallback,
  useSortedRowIds,
  useStore,
  useCreateRelationships,
  useTable,
  useValue,
  useRemoteRowId,
  useValuesListener,
} = UiReact as UiReact.WithSchemas<Schemas>;

const useStoreId = (listId: string) => STORE_ID_PREFIX + listId;

// Returns a callback that adds a new product to the shopping list.
export const useAddShoppingListProductCallback = (listId: string) => {
  const store = useStore(useStoreId(listId));
  const [userId] = useUserIdAndNickname();
  return useCallback(
    (name: string, quantity: number, units: string, notes: string) => {
      const id = randomUUID();
      store.setRow("products", id, {
        id,
        name,
        quantity,
        units,
        notes,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return id;
    },
    [store, listId],
  );
};

//Returns the number of products in the shopping list
export const useShoppingListProductCount = (listId: string) =>
  useRowCount("products", useStoreId(listId));

//Returns the nickname of people invloved in this shopping list
export const useShoppingListUserNicknames = (listId: string) =>
  Object.entries(useTable("collaborators", useStoreId(listId))).map(
    ([, { nickname }]) => nickname,
  );

//Returnshe product ID's in the shopping list, sorted by the specific cell
export const useShoppingListProductIds = (
  listId: string,
  cellId: ShoppingListProductCellId = "createdAt",
  descending?: boolean,
  offset?: number,
  limit?: number,
) =>
  useSortedRowIds(
    "products",
    cellId,
    descending,
    offset,
    limit,
    useStoreId(listId),
  );

// Returns a pair of 1) a property of the product, 2) a callback that updates it, similar to the React useState pattern.
export const useShoppingListProductCell = <
  CellId extends ShoppingListProductCellId,
>(
  listId: string,
  productId: string,
  cellId: CellId,
): [
  Cell<Schemas[0], "products", CellId>,
  (cell: Cell<Schemas[0], "products", CellId>) => void,
] => [
  useCell("products", productId, cellId, useStoreId(listId)),
  useSetCellCallback(
    "products",
    productId,
    cellId,
    (cell: Cell<Schemas[0], "products", CellId>) => cell,
    [],
    useStoreId(listId),
  ),
];

// Returns the nickname of the person who created the product.
export const useShoppingListProductCreatedByNickname = (
  listId: string,
  productId: string,
) => {
  const userId = useRemoteRowId(
    "createdByNickname",
    productId,
    useStoreId(listId),
  );
  return useCell("collaborators", userId, "nickname", useStoreId(listId));
};

// Returns a callback that deletes a product from the shopping list.
export const useDelShoppingListProductCallback = (
  listId: string,
  productId: string,
) => useDelRowCallback("products", productId, useStoreId(listId));

// Returns a pair of 1) a property of the shopping list, 2) a callback that updates it, similar to the React useState pattern.
export const useShoppingListValue = <ValueId extends ShoppingListValueId>(
  listId: string,
  valueId: ValueId,
): [
  Value<Schemas[1], ValueId>,
  (value: Value<Schemas[1], ValueId>) => void,
] => [
  useValue(valueId, useStoreId(listId)),
  useSetValueCallback(
    valueId,
    (value: Value<Schemas[1], ValueId>) => value,
    [],
    useStoreId(listId),
  ),
];

// Create, persist & sync a store containing the shopping list & products
export default function ShoppingListStore({
  listId,
  initialValues,
}: {
  listId: string;
  initialValues?: string;
}) {
  const storeId = useStoreId(listId);
  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA),
  );

  const [userId, nickname] = useUserIdAndNickname();

  // Persist store (with initial content if it hasn't been saved before), then
  // ensure the current user is added as a collaborator.

  useCreateClientPersisterAndStart(storeId, store, initialValues, () =>
    store.setRow("collaborators", userId, { nickname }),
  );

  useCreateServerSynchronizerAndStart(storeId, store);
  useProvideStore(storeId, store);

  return null;
}
