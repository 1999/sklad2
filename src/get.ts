import { checkStoresExist } from './util';
import { StoreMissingError, TransactionAbortedError, IndexMissingError, DOMExceptionError } from './errors';

export type GetOptions = {
  indexName?: string;
  range?: IDBValidKey | IDBKeyRange;
  direction?: IDBCursorDirection;
  offset?: number;
  limit?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectStoreRecord = any;

export class SkladGetLite {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async getOneStore(storeName: string, options: GetOptions): Promise<ObjectStoreRecord[]> {
    const result = await this.getObjects({
      [storeName]: options || {},
    });

    return result[storeName];
  }

  public async getMultipleStores(arg: { [storeName: string]: GetOptions }): Promise<{ [storeName: string]: ObjectStoreRecord[] }> {
    return await this.getObjects(arg);
  }

  private getObjects(arg: { [storeName: string]: GetOptions }): Promise<{ [storeName: string]: ObjectStoreRecord[] }> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);

      if (!checkStoresExist(this.database, objectStoresNames)) {
        reject(new StoreMissingError());
        return;
      }

      const result = this.buildEmptyResult(objectStoresNames);
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

        if (options.indexName) {
          if (!objectStore.indexNames.contains(options.indexName)) {
            reject(new IndexMissingError());
            return;
          }

          const index = objectStore.index(options.indexName);
          if (options.direction) {
            const cursorRequest = objectStore.openCursor(options.range, options.direction);
            cursorRequest.onsuccess = this.onCursorSuccess(cursorRequest, result[storeName], options);
          } else {
            const getAllRequest = index.getAll(options.range);
            getAllRequest.onsuccess = this.onGetAllRequestSuccess(getAllRequest, result[storeName], options);
          }
        } else {
          if (options.direction) {
            const cursorRequest = objectStore.openCursor(options.range, options.direction);
            cursorRequest.onsuccess = this.onCursorSuccess(cursorRequest, result[storeName], options);
          } else {
            const getAllRequest = objectStore.getAll(options.range);
            getAllRequest.onsuccess = this.onGetAllRequestSuccess(getAllRequest, result[storeName], options);
          }
        }
      }
    });
  }

  private onCursorSuccess = (
    request: IDBRequest<IDBCursorWithValue | null>,
    result: ObjectStoreRecord[],
    options: GetOptions,
  ) => () => {
    const cursor = request.result;

    if (cursor) {
      if (options.offset && !result.length) {
        cursor.advance(options.offset);
      }

      result.push(cursor.value);

      if (!options.limit || result.length < options.limit) {
        cursor.continue();
      }
    }
  }

  private onGetAllRequestSuccess = (
    request: IDBRequest<ObjectStoreRecord[]>,
    result: ObjectStoreRecord[],
    options: GetOptions,
  ) => () => {
    const records = request.result;

    if (options.offset) {
      records.splice(0, options.offset);
    }

    if (options.limit) {
      records.splice(options.limit);
    }

    result.push(...records);
  }

  private buildEmptyResult(objectStoresNames: string[]): { [storeName: string]: ObjectStoreRecord[] } {
    return objectStoresNames.reduce((memo, storeName) => {
      memo[storeName] = [];
      return memo;
    }, {});
  }
}
