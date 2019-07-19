import { checkStoresExist } from './util';
import { StoreMissingError, TransactionAbortedError } from './errors';

export type DeleteKeyRange = string | IDBKeyRange;

export class SkladDeleteLite {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async deleteFromStore(storeName: string, key: DeleteKeyRange): Promise<void> {
    return await this.deleteObjects({
      [storeName]: key,
    });
  }

  public async deleteFromStores(arg: { [storeName: string]: DeleteKeyRange }): Promise<void> {
    return await this.deleteObjects(arg);
  }

  private deleteObjects(arg: { [storeName: string]: DeleteKeyRange }): Promise<void> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);

      if (!checkStoresExist(this.database, objectStoresNames)) {
        reject(new StoreMissingError());
        return;
      }

      const transaction = this.database.transaction(objectStoresNames, 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(new TransactionAbortedError());
      transaction.onerror = () => reject(transaction.error);

      for (const [storeName, key] of Object.entries(arg)) {
        const objStore = transaction.objectStore(storeName);
        objStore.delete(key);
      }
    });
  }
}
