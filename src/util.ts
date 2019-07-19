export const checkStoresExist = (database: IDBDatabase, storesNames: string[]): boolean => {
  return storesNames.every(database.objectStoreNames.contains);
};
