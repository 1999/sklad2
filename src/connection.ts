import type { DeleteKeyRange } from './delete';
import type { ObjectStoreKeyValueRecord } from './save';
import type { CountOptions } from './count';
import type { GetOptions } from './get';

export interface Connection {
  getDatabaseVersion(): number;

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

  getOneStore<TReturnType extends object>(storeName: string, options?: GetOptions): Promise<TReturnType[]>;
  getMultipleStores<TStoreRecords extends Record<string, object>>(arg: {
    [StoreName in keyof TStoreRecords]: GetOptions;
  }): Promise<{ [StoreName in keyof TStoreRecords]: TStoreRecords[StoreName][] }>;

  close(): void;
}
