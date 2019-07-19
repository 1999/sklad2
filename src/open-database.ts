import { DatabaseBlockedError, UnknownVersionUpgradeError } from './errors';
import { SkladLite } from './sklad';

export type Migration = (database: IDBDatabase) => void;

export type OpenOptions = {
  migrations: Migration[];
};

export const open = (databaseName: string, { migrations }: OpenOptions) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, migrations.length);

    request.onblocked = () => reject(new DatabaseBlockedError());
    request.onerror = () => reject(request.error);

    request.onupgradeneeded = function (evt) {
      if (!evt.newVersion) {
        reject(new UnknownVersionUpgradeError());
        return;
      }

      for (let i = evt.oldVersion + 1; i <= evt.newVersion; i++) {
        migrations[i](request.result);
      }
    };

    request.onsuccess = () => {
      resolve(new SkladLite(request.result));
    };

    request.onblocked = () => reject(new DatabaseBlockedError());
  });
};
