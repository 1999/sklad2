import { TransactionAbortedError, DOMExceptionError } from './errors';

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
        const source = options.indexName ? objectStore.index(options.indexName) : objectStore;

        if (options.direction) {
          this.getCursorValues(source, options, result[storeName]);
        } else {
          this.getAllValues(source, options, result[storeName]);
        }
      }
    });
  }

  private getCursorValues(source: IDBObjectStore | IDBIndex, options: GetOptions, results: ObjectStoreRecord[]) {
    const request = source.openCursor(options.range, options.direction);
    let advanced = false;

    request.onsuccess = () => {
      const cursor = request.result;

      if (cursor) {
        if (options.offset && !advanced) {
          cursor.advance(options.offset);
          advanced = true;

          return;
        }

        results.push(cursor.value);

        if (!options.limit || results.length < options.limit) {
          cursor.continue();
        }
      }
    };
  }

  private getAllValues(source: IDBObjectStore | IDBIndex, options: GetOptions, results: ObjectStoreRecord[]) {
    const request = source.getAll(options.range);
    request.onsuccess = () => {
      const records = request.result;

      if (options.offset) {
        records.splice(0, options.offset);
      }

      if (options.limit) {
        records.splice(options.limit);
      }

      results.push(...records);
    }
  }

  private buildEmptyResult(objectStoresNames: string[]): { [storeName: string]: ObjectStoreRecord[] } {
    return objectStoresNames.reduce((memo, storeName) => {
      memo[storeName] = [];
      return memo;
    }, {});
  }
}
