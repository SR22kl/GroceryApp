import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  Content,
  MergeableStore,
  OptionalSchemas,
} from "tinybase/with-schemas";
import { createClientPersister } from "./createClientPersister";

export const useCreateClientPersisterAndStart = <
  Schemas extends OptionalSchemas,
>(
  storeId: string,
  store: MergeableStore<Schemas>,
  initialValues?: string,
  then?: () => void,
) => {
  // break the type chain here (important)
  const createPersister: any = async (s: any) => {
    return await createClientPersister(storeId, s);
  };

  return (UiReact as any).useCreatePersister(
    store,
    createPersister,
    [storeId],

    async (persister: any) => {
      let initialContent: Content<Schemas> | undefined;

      if (initialValues) {
        try {
          initialContent = JSON.parse(initialValues);
        } catch {}
      }

      if (initialContent) {
        await persister?.load(initialContent);
      } else {
        await persister?.load();
      }
      await persister?.startAutoSave();

      then?.();
    },

    [initialValues],
  );
};
