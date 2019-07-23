import { TransactionAbortedError, DOMExceptionError } from './errors';

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
      const transaction = this.database.transaction(objectStoresNames, 'readwrite');

      transaction.oncomplete = () => resolve();
      transaction.onabort = () => {
        if (transaction.error) {
          reject(new DOMExceptionError(transaction.error));
        } else {
          reject(new TransactionAbortedError());
        }
      };

      for (const [storeName, key] of Object.entries(arg)) {
        const objStore = transaction.objectStore(storeName);
        objStore.delete(key);
      }
    });
  }
}
