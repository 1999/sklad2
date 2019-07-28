import { deleteDatabase } from '../dist/esm';
import { testcase as connectAndRunMigrations } from './cases/migrations';
import { testcase as insertRecordsMultipleStores } from './cases/insert-multiple';
import { testcase as insertRecordsOneStore } from './cases/insert-one';

export default async function insertAndCount(suite) {
  await suite('Insert and count records', async (assertionCheck) => {
    const databaseName = `e2e-${Date.now()}`;
    let sklad = await connectAndRunMigrations(assertionCheck, databaseName, 1);

    await assertionCheck('should insert records into a keyPath object store', async () => {
      await insertRecordsOneStore(sklad);
    });

    await assertionCheck('should close connection', () => {
      sklad.close();
    });

    sklad = await connectAndRunMigrations(assertionCheck, databaseName, 2);

    await assertionCheck('should insert records into multiple object stores', async () => {
      await insertRecordsMultipleStores(sklad);
    });

    await assertionCheck('should close connection and delete the database', async () => {
      sklad.close();
      await deleteDatabase(databaseName);
    });
  });
}
