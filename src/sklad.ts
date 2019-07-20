import { SkladClearLite } from './clear';
import { SkladDeleteLite, DeleteKeyRange } from './delete';
import { SkladSaveLite, ObjectStoreKeyValueRecord } from './save';
import { SkladCountLite, CountOptions } from './count';
import { SkladGetLite, GetOptions, ObjectStoreRecord } from './get';

export class SkladLite {
  private database: IDBDatabase;
  private clear: SkladClearLite;
  private delete: SkladDeleteLite;
  private insert: SkladSaveLite;
  private upsert: SkladSaveLite;
  private count: SkladCountLite;
  private get: SkladGetLite;

  public constructor(database: IDBDatabase) {
    this.database = database;
    this.clear = new SkladClearLite(database);
    this.delete = new SkladDeleteLite(database);
    this.insert = new SkladSaveLite(database, 'insert');
    this.upsert = new SkladSaveLite(database, 'upsert');
    this.count = new SkladCountLite(database);
    this.get = new SkladGetLite(database);
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

  public async getOneStore(storeName: string, options?: GetOptions): Promise<ObjectStoreRecord[]> {
    return await this.get.getOneStore(storeName, options || {});
  }

  public async getMultipleStores(arg: { [storeName: string]: GetOptions }): Promise<{ [storeName: string]: ObjectStoreRecord[] }> {
    return await this.get.getMultipleStores(arg);
  }

  public close(): void {
    this.database.close();
  }
}
