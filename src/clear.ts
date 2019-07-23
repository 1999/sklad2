import { TransactionAbortedError, DOMExceptionError } from './errors';

export class SkladClearLite {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async clearOne(storeName: string): Promise<void> {
    return await this.clearObjectStores([storeName]);
  }

  public async clearMultiple(storeNames: string[]): Promise<void> {
    return await this.clearObjectStores(storeNames);
  }

  private clearObjectStores(objectStoresNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.database.transaction(objectStoresNames, 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => {
        if (transaction.error) {
          reject(new DOMExceptionError(transaction.error));
        } else {
          reject(new TransactionAbortedError());
        }
      };

      for (const storeName of objectStoresNames) {
        const objectStore = transaction.objectStore(storeName);
        objectStore.clear();
      }
    });
  }
}
