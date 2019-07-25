export const databaseMigrations = ([
  {
    label: 'should create an object store with a key path and an index for a field',
    migration: (database) => {
      const objectStore = database.createObjectStore('students', { keyPath: 'email' });
      objectStore.createIndex('by_login', 'login');
    },
  },
  {
    label: 'should create an object store with autoIncrement and a multiEntry index',
    migration: (database) => {
      const objectStore = database.createObjectStore('cards', { autoIncrement: true });
      objectStore.createIndex('by_tag', 'tags', { multiEntry: true });
    },
  },
  {
    label: 'should add a multi-field index to existing store',
    migration: (database, transaction) => {
      const objectStore = transaction.objectStore('students');
      objectStore.createIndex('by_login_birthyear', ['login', 'birthyear']);
    },
  },
]);
