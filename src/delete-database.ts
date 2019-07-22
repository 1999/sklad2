import { DatabaseBlockedError } from './errors';

export const deleteDatabase = (databaseName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName);

    request.onblocked = () => reject(new DatabaseBlockedError());
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
