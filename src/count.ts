import { checkStoresExist } from './util';
import { StoreMissingError, TransactionAbortedError, IndexMissingError, DOMExceptionError } from './errors';

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

      if (!checkStoresExist(this.database, objectStoresNames)) {
        reject(new StoreMissingError());
        return;
      }

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
        let request: IDBRequest<number> | undefined;

        if (options.indexName) {
          if (!objectStore.indexNames.contains(options.indexName)) {
            reject(new IndexMissingError());
            return;
          }

          const index = objectStore.index(options.indexName);
          request = index.count(options.range);
        } else {
          request = objectStore.count(options.range);
        }

        request.onsuccess = function () {
          result[storeName] = this.result;
        };
      }
    });
  }
}
