export const databaseMigrations = (log) => ([
  (database) => {
    const objectStore = database.createObjectStore('store_with_keypath', { keyPath: 'email' });
    log('store_with_keypath created');

    objectStore.createIndex('by_login', 'login');
    log('index by_login created');
  },
  (database) => {
    const objectStore = database.createObjectStore('store_with_autoincrement', { autoIncrement: true });
    log('store_with_autoincrement created');

    objectStore.createIndex('by_tag', 'tags', { multiEntry: true });
    log('index by_tag created');
  },
  (database, transaction) => {
    const objectStore = transaction.objectStore('store_with_keypath');
    log('store_with_keypath access gained');

    objectStore.createIndex('by_login_birthyear', ['login', 'birth_year']);
    log('index by_login_birthyear created');

    objectStore.createIndex('by_login_unique', 'login', { unique: true });
    log('index by_login_unique created');
  },
]);
