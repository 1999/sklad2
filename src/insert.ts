import { checkStoresExist } from './util';
import { StoreMissingError, TransactionAbortedError } from './errors';

export type Record = {
  key?: string;
  value: IDBValidKey;
};

export class SkladInsertLite {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async insertIntoOne(storeName: string, records: Record[]): Promise<IDBValidKey[]> {
    const result = await this.insertRecords({
      [storeName]: records
    });

    return result[storeName];
  }

  public async insertIntoMultiple(arg: { [storeName: string]: Record[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return await this.insertRecords(arg);
  }

  public async insertRecords(arg: { [storeName: string]: Record[] }): Promise<{ [storeName: string]: IDBValidKey[] }> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);

      if (!checkStoresExist(this.database, objectStoresNames)) {
        reject(new StoreMissingError());
        return;
      }

      const transaction = this.database.transaction(objectStoresNames, 'readwrite');
      const result = this.buildEmptyResult(objectStoresNames);

      transaction.onabort = () => reject(new TransactionAbortedError());
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve(result);

      for (const [storeName, records] of Object.entries(arg)) {
        const objectStore = transaction.objectStore(storeName);

        records.forEach(({ key, value }, i) => {
          const request = objectStore.add(value, key);

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
