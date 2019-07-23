export const checkStoresExist = (database: IDBDatabase, storesNames: string[]): boolean => {
  return storesNames.every((storeName) => database.objectStoreNames.contains(storeName));
};
