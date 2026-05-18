import { SkladClear } from './clear';
import { SkladDelete, type DeleteKeyRange } from './delete';
import { SkladSave, type ObjectStoreKeyValueRecord } from './save';
import { SkladCount, type CountOptions } from './count';
import { SkladGet, type GetOptions } from './get';
import { type Connection } from './connection';

export class Sklad implements Connection {
  private readonly database: IDBDatabase;
  private readonly clear: SkladClear;
  private readonly delete: SkladDelete;
  private readonly insert: SkladSave;
  private readonly upsert: SkladSave;
  private readonly count: SkladCount;
  private readonly get: SkladGet;

  public constructor(database: IDBDatabase) {
    this.database = database;
    this.clear = new SkladClear(database);
    this.delete = new SkladDelete(database);
    this.insert = new SkladSave(database, 'insert');
    this.upsert = new SkladSave(database, 'upsert');
    this.count = new SkladCount(database);
    this.get = new SkladGet(database);
  }

  public getDatabaseVersion(): number {
    return this.database.version;
  }

  public async deleteFromStore(storeName: string, key: DeleteKeyRange): Promise<void> {
    return await this.delete.deleteFromStore(storeName, key);
  }

  public async deleteFromStores(arg: { [storeName: string]: DeleteKeyRange }): Promise<void> {
    return await this.delete.deleteFromStores(arg);
  }

  public async clearStore(storeName: string): Promise<void> {
    return await this.clear.clearOne(storeName);
  }

  public async clearStores(storeNames: string[]): Promise<void> {
    return await this.clear.clearMultiple(storeNames);
  }

  public async insertIntoOneStore(storeName: string, records: ObjectStoreKeyValueRecord[]): Promise<IDBValidKey[]> {
    return await this.insert.saveIntoOneStore(storeName, records);
  }

  public async insertIntoMultiple(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return await this.insert.saveIntoMultipleStores(arg);
  }

  public async upsertIntoOneStore(storeName: string, records: ObjectStoreKeyValueRecord[]): Promise<IDBValidKey[]> {
    return await this.upsert.saveIntoOneStore(storeName, records);
  }

  public async upsertIntoMultiple(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return await this.upsert.saveIntoMultipleStores(arg);
  }

  public async countOneStore(storeName: string, options?: CountOptions): Promise<number> {
    return await this.count.countOneStore(storeName, options || {});
  }

  public async countMultipleStores(arg: { [storeName: string]: CountOptions }): Promise<{ [storeName: string]: number }> {
    return await this.count.countMultipleStores(arg);
  }

  public async getOneStore<TReturnType extends object>(storeName: string, options?: GetOptions): Promise<TReturnType[]> {
    return await this.get.getOneStore<TReturnType>(storeName, options || {});
  }

  public async getMultipleStores<TStoreRecords extends Record<string, object>>(arg: {
    [StoreName in keyof TStoreRecords]: GetOptions;
  }): Promise<{ [StoreName in keyof TStoreRecords]: TStoreRecords[StoreName][] }> {
    return await this.get.getMultipleStores<TStoreRecords>(arg);
  }

  public close(): void {
    this.database.close();
  }
}
