import { SkladClearLite } from './clear';
import { SkladDeleteLite, DeleteKeyRange } from './delete';
import { SkladInsertLite, Record } from './insert';

export class SkladLite {
  private database: IDBDatabase;
  private clear: SkladClearLite;
  private delete: SkladDeleteLite;
  private insert: SkladInsertLite;

  public constructor(database: IDBDatabase) {
    this.database = database;
    this.clear = new SkladClearLite(database);
    this.delete = new SkladDeleteLite(database);
    this.insert = new SkladInsertLite(database);
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

  public async insertIntoOneStore(storeName: string, records: Record[]): Promise<IDBValidKey[]> {
    return await this.insert.insertIntoOne(storeName, records);
  }

  public async insertIntoMultiple(arg: { [storeName: string]: Record[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return await this.insert.insertIntoMultiple(arg);
  }

  public close(): void {
    this.database.close();
  }
}
