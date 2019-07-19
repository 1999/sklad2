import { SkladClearLite } from './clear';
import { SkladDeleteLite, DeleteKeyRange } from './delete';

export class SkladLite {
  private clear: SkladClearLite;
  private delete: SkladDeleteLite;

  public constructor(database: IDBDatabase) {
    this.clear = new SkladClearLite(database);
    this.delete = new SkladDeleteLite(database);
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
}
