import { TransactionAbortedError, DOMExceptionError } from './errors';

export type CountOptions = {
  indexName?: string;
  range?: IDBValidKey | IDBKeyRange;
};

export class SkladCountLite {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async countOneStore(storeName: string, options: CountOptions): Promise<number> {
    const result = await this.countObjects({
      [storeName]: options || {},
    });

    return result[storeName];
  }

  public async countMultipleStores(arg: { [storeName: string]: CountOptions }): Promise<{ [storeName: string]: number }> {
    return await this.countObjects(arg);
  }

  private countObjects(arg: { [storeName: string]: CountOptions }): Promise<{ [storeName: string]: number }> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);
      const result: { [storeName: string]: number } = {};
      const transaction = this.database.transaction(objectStoresNames, 'readonly');

      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => {
        if (transaction.error) {
          reject(new DOMExceptionError(transaction.error));
        } else {
          reject(new TransactionAbortedError());
        }
      };

      for (const [storeName, options] of Object.entries(arg)) {
        const objectStore = transaction.objectStore(storeName);
        const source = options.indexName ? objectStore.index(options.indexName) : objectStore;

        const request = source.count(options.range);
        request.onsuccess = function () {
          result[storeName] = this.result;
        };
      }
    });
  }
}
