## sklad2

This is a simplest-possible async-await/promises wrapper on top of IndexedDB. It's a successor to [sklad](https://github.com/1999/sklad) library.

## Installation

```
npm install sklad2
```

## API

```javascript
import { open, deleteDatabase } from 'sklad2';

// open connection to the database
// migrations is an array of functions, one per schema version
const sklad = await open('databaseName', [
  (transaction) => {
    // migration to version 1: create stores, indexes, etc.
    const store = transaction.db.createObjectStore('storeName', { autoIncrement: true });
    store.createIndex('indexName', 'fieldName', { unique: false });
  },
  (transaction) => {
    // migration to version 2: modify schema
    transaction.objectStore('storeName').createIndex('anotherIndex', 'anotherField');
  },
]);

// get the current database version
const version = sklad.getDatabaseVersion();

// insert records into the object store(s)
const insertIds = await sklad.insertIntoOneStore('storeName', [...records]);
const insertIdsMultiple = await sklad.insertIntoMultiple({
  storeName1: [...records1],
  storeName2: [...records2],
});

// upsert records in the object store(s)
const upsertIds = await sklad.upsertIntoOneStore('storeName', [...records]);
const upsertIdsMultiple = await sklad.upsertIntoMultiple({
  storeName1: [...records1],
  storeName2: [...records2],
});

// delete records in the object store(s)
await sklad.deleteFromStore('storeName', 'key');
await sklad.deleteFromStores({
  storeName1: 'key',
  storeName2: IDBKeyRange.lowerBound('key'),
});

// count records in the object store(s)
const total = await sklad.countOneStore('storeName');
const totalMultiple = await sklad.countMultipleStores({
  storeName1: {}, // count all records in the object store
  storeName2: {
    indexName: 'index',
    range: IDBKeyRange.only('something'),
  }, // all options are optional
});

// get records from the object store(s)
const records = await sklad.getOneStore('storeName');
const recordsMultiple = await sklad.getMultipleStores({
  storeName1: {}, // get all records from the object store
  storeName2: {
    indexName: 'index',
    range: IDBKeyRange.upperBound('key'),
    direction: 'nextunique',
    offset: 10,
    limit: 10,
  }, // all options are optional
});

// clear records in the object store(s)
await sklad.clearStore('storeName');
await sklad.clearStores(['storeName1', 'storeName2']);

// close the database connection
sklad.close();

// delete the database
await deleteDatabase('databaseName');
```

## Error handling

All methods throw typed errors you can catch and inspect:

- `DatabaseBlockedError` — another connection is blocking the open/delete request
- `DatabaseConnectionError` — the connection could not be established
- `UnknownVersionUpgradeError` — upgrade triggered with no target version
- `UpgradeTransactionClosedError` — the upgrade transaction was unexpectedly closed
- `TransactionAbortedError` — a read/write transaction was aborted without a specific error
- `DOMExceptionError` — wraps a native `DOMException` thrown by IndexedDB

```javascript
import { open, DatabaseBlockedError } from 'sklad2';

try {
  const sklad = await open('databaseName', [...migrations]);
} catch (err) {
  if (err instanceof DatabaseBlockedError) {
    // handle blocked
  }
}
```

## Differences with `sklad`

### Browsers support

`sklad` was designed to work in almost all browsers which had some IndexedDB support. `sklad2` is designed to work in the browsers which don't have IndexedDB implementation bugs which are the latest desktop Chrome, Firefox, Safari, mobile Chrome and Safari.

### Testing

`sklad` was heavily tested in different real browsers which had different IndexedDB implementation support. `sklad2` has only a couple end-to-end tests that you can run in your browser and see if it works or not. If you want to test your mobile browser you can consider running [ngrok](https://ngrok.com/) to open the test page in the browser.

### Types

`sklad2` is written in Typescript which means it has built-in types support.

### API

`sklad2` takes inspiration from `sklad` but still has slightly different method names: `get` in `sklad` has `getOneStore` and `getMultipleStores` in `sklad2`. See API section above for examples.

### Bundle format

`sklad2` NPM package ships three formats: ES modules (`module`), CommonJS (`main`), and UMD (`unpkg`). It doesn't contain any polyfills for IndexedDB or Promises.
