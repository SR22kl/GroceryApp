import { createMergeableStore } from 'tinybase';
import { createDurableObjectSqlStoragePersister } from 'tinybase/persisters/persister-durable-object-sql-storage';
import { getWsServerDurableObjectFetch, WsServerDurableObject } from 'tinybase/synchronizers/synchronizer-ws-server-durable-object';

export class GroceryDurableObjects extends WsServerDurableObject {
	createPersister() {
		return createDurableObjectSqlStoragePersister(createMergeableStore(), this.ctx.storage.sql);
	}
}

export default {
	fetch: getWsServerDurableObjectFetch('GroceryDurableObjects'),
};
