export const databaseMigrations = (log) => ([
  (database) => {
    const objectStore = database.createObjectStore('students', { keyPath: 'email' });
    log('students object store created');

    objectStore.createIndex('by_login', 'login');
    log('index by_login created');
  },
  (database) => {
    const objectStore = database.createObjectStore('cards', { autoIncrement: true });
    log('cards object store created');

    objectStore.createIndex('by_tag', 'tags', { multiEntry: true });
    log('index by_tag created');
  },
  (database, transaction) => {
    const objectStore = transaction.objectStore('students');
    log('students object store access gained');

    objectStore.createIndex('by_login_birthyear', ['login', 'birthyear']);
    log('index by_login_birthyear created');
  },
]);
