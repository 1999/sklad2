# Changelog

## Unreleased

### Breaking Changes

- **`Migration` signature simplified** (`src/open-database.ts`): The `Migration` callback no longer receives `database: IDBDatabase` as its first argument. It now receives only `transaction: IDBTransaction`. The database is accessible via `transaction.db`. Update existing migrations from `(database, transaction) => { ... }` to `(transaction) => { transaction.db.createObjectStore(...) }`.

### New Features

- **`getDatabaseVersion()`** added to the `Connection` interface and `Sklad` class. Returns the current version number of the open database (`IDBDatabase.version`).

### Improvements

- **Generics for `get` operations**: `getOneStore` and `getMultipleStores` are now fully generic. Replace the old untyped `ObjectStoreRecord` (`any`) return type with a type parameter: `connection.getOneStore<Student>(storeName)`. The `ObjectStoreRecord` type export has been removed.
- **`readonly` fields**: Private fields in `Sklad` and `SkladDelete` are now marked `readonly`.
- **`import type`** used for type-only imports in `connection.ts` and `sklad.ts`.
