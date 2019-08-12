import { DeleteKeyRange } from './delete';
import { ObjectStoreKeyValueRecord } from './save';
import { CountOptions } from './count';
import { ObjectStoreRecord, GetOptions } from './get';

export interface Connection {
  deleteFromStore(storeName: string, key: DeleteKeyRange): Promise<void>;
  deleteFromStores(arg: { [storeName: string]: DeleteKeyRange }): Promise<void>;

  clearStore(storeName: string): Promise<void>;
  clearStores(storeNames: string[]): Promise<void>;

  insertIntoOneStore(storeName: string, records: ObjectStoreKeyValueRecord[]): Promise<IDBValidKey[]>;
  insertIntoMultiple(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }>;

  upsertIntoOneStore(storeName: string, records: ObjectStoreKeyValueRecord[]): Promise<IDBValidKey[]>;
  upsertIntoMultiple(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }>;

  countOneStore(storeName: string, options?: CountOptions): Promise<number>;
  countMultipleStores(arg: { [storeName: string]: CountOptions }): Promise<{ [storeName: string]: number }>;

  getOneStore(storeName: string, options?: GetOptions): Promise<ObjectStoreRecord[]>;
  getMultipleStores(arg: { [storeName: string]: GetOptions }): Promise<{ [storeName: string]: ObjectStoreRecord[] }>;

  close(): void;
}
