import { TransactionAbortedError, DOMExceptionError } from './errors';

export type ObjectStoreKeyValueRecord = {
  key?: string;
  value: IDBValidKey;
};

export type SaveMode = 'insert' | 'upsert';

export class SkladSaveLite {
  private database: IDBDatabase;
  private mode: SaveMode;

  public constructor(database: IDBDatabase, mode: SaveMode) {
    this.database = database;
    this.mode = mode;
  }

  public async saveIntoOneStore(storeName: string, records: ObjectStoreKeyValueRecord[]): Promise<IDBValidKey[]> {
    const result = await this.saveRecords({
      [storeName]: records
    });

    return result[storeName];
  }

  public async saveIntoMultipleStores(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return await this.saveRecords(arg);
  }

  private async saveRecords(arg: { [storeName: string]: ObjectStoreKeyValueRecord[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);
      const transaction = this.database.transaction(objectStoresNames, 'readwrite');
      const result = this.buildEmptyResult(objectStoresNames);

      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => {
        if (transaction.error) {
          reject(new DOMExceptionError(transaction.error));
        } else {
          reject(new TransactionAbortedError());
        }
      };

      for (const [storeName, records] of Object.entries(arg)) {
        const objectStore = transaction.objectStore(storeName);

        records.forEach(({ key, value }, i) => {
          const method = this.mode === 'insert' ? 'add' : 'put';
          const request = objectStore[method](value, key);

          request.onsuccess = function () {
            result[storeName][i] = this.result;
          };
        });
      }
    });
  }

  private buildEmptyResult(objectStoresNames: string[]): { [storeName: string]: IDBValidKey[] } {
    return objectStoresNames.reduce((memo, storeName) => {
      memo[storeName] = [];
      return memo;
    }, {});
  }
}
