import * as SQLite from "expo-sqlite";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas";
import type { MergeableStore as TBMergeableStore } from "tinybase";

export const createClientPersister = async <Schemas extends OptionalSchemas>(
  storeId: string,
  store: MergeableStore<Schemas>,
) => {
  const db = await SQLite.openDatabaseAsync(storeId + ".db");

  return createExpoSqlitePersister(
    store as unknown as TBMergeableStore,
    db,
  );
};
