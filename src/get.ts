import { TransactionAbortedError, DOMExceptionError } from './errors';

export type GetOptions = {
  indexName?: string;
  range?: IDBValidKey | IDBKeyRange;
  direction?: IDBCursorDirection;
  offset?: number;
  limit?: number;
};

export class SkladGet {
  private database: IDBDatabase;

  public constructor(database: IDBDatabase) {
    this.database = database;
  }

  public async getOneStore<TReturnType extends object>(storeName: string, options: GetOptions): Promise<TReturnType[]> {
    const result = await this.getObjects<TReturnType>({
      [storeName]: options || {},
    });

    return result[storeName];
  }

  public async getMultipleStores<TStoreRecords extends Record<string, object>>(arg: {
    [StoreName in keyof TStoreRecords]: GetOptions;
  }): Promise<{ [StoreName in keyof TStoreRecords]: TStoreRecords[StoreName][] }> {
    return (await this.getObjects(arg)) as {
      [StoreName in keyof TStoreRecords]: TStoreRecords[StoreName][];
    };
  }

  private getObjects<TReturnType extends object>(arg: { [storeName: string]: GetOptions }): Promise<{ [storeName: string]: TReturnType[] }> {
    return new Promise((resolve, reject) => {
      const objectStoresNames = Object.keys(arg);
      const result = this.buildEmptyResult<TReturnType>(objectStoresNames);
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

  private getCursorValues<TReturnType extends object>(source: IDBObjectStore | IDBIndex, options: GetOptions, results: TReturnType[]) {
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

  private getAllValues<TReturnType extends object>(source: IDBObjectStore | IDBIndex, options: GetOptions, results: TReturnType[]) {
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
    };
  }

  private buildEmptyResult<TReturnType extends object>(objectStoresNames: string[]): { [storeName: string]: TReturnType[] } {
    const result: { [storeName: string]: TReturnType[] } = {};
    for (const storeName of objectStoresNames) {
      result[storeName] = [];
    }
    return result;
  }
}
