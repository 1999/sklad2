import { DatabaseBlockedError, UnknownVersionUpgradeError, UpgradeTransactionClosedError, DOMExceptionError, DatabaseConnectionError } from './errors';
import { SkladLite } from './sklad';

export type Migration = (database: IDBDatabase, transaction: IDBTransaction) => void;

export const open = (databaseName: string, migrations: Migration[]): Promise<SkladLite> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, migrations.length);

    request.onblocked = () => reject(new DatabaseBlockedError());
    request.onerror = () => {
      if (request.error) {
        reject(new DOMExceptionError(request.error));
      } else {
        reject(new DatabaseConnectionError());
      }
    };

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

    request.onsuccess = () => resolve(new SkladLite(request.result));
  });
};
