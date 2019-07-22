import { DatabaseBlockedError, UnknownVersionUpgradeError, UpgradeTransactionClosedError } from './errors';
import { SkladLite } from './sklad';

export type Migration = (database: IDBDatabase, transaction: IDBTransaction) => void;

export type OpenOptions = {
  migrations: Migration[];
};

export const open = (databaseName: string, { migrations }: OpenOptions): Promise<SkladLite> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, migrations.length);

    request.onblocked = () => reject(new DatabaseBlockedError());
    request.onerror = () => reject(request.error);

    request.onupgradeneeded = function (evt) {
      if (!evt.newVersion) {
        reject(new UnknownVersionUpgradeError());
        return;
      }

      for (let i = evt.oldVersion; i < evt.newVersion; i++) {
        if (!request.transaction) {
          reject(new UpgradeTransactionClosedError());
          return;
        }

        migrations[i](request.result, request.transaction);
      }
    };

    request.onsuccess = () => {
      resolve(new SkladLite(request.result));
    };

    request.onblocked = () => reject(new DatabaseBlockedError());
  });
};
