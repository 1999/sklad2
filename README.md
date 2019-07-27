## sklad2

This is a simplest-possible async-await/promises wrapper on top of IndexedDB. It's a successor to [sklad](https://github.com/1999/sklad) library.

## API

```javascript
import { open, deleteDatabase } from 'sklad2';

// open connection to the database
const sklad = await open('databaseName', [...migrations]);

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
  storeName2: IDBKeyRange.lower('key'),
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
  storeName2, {
    indexName: 'index',
    range: IDBKeyRange.upper('key'),
    direction: 'nextunique',
    offset: 10,
    limit: 10,
  }, // all options are optional
});

// clear records in the object store(s)
await sklad.clearStore('storeName');
await sklad.clearStores(['storeName1', 'storeName2']);

// delete the database
await deleteDatabase('databaseName');
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

`sklad2` NPM package has "module" support which is ES6 modules code and "main" which is CommonJS. It doesn't contain any polyfills for IndexedDB or Promises.
