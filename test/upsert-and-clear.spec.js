import { deleteDatabase } from '../dist/esm';
import { testcase as connectAndRunMigrations } from './cases/migrations';
import { testcase as upsertRecordsMultipleStores } from './cases/upsert-multiple';
import { testcase as upsertRecordsOneStore } from './cases/upsert-one';
import { testcase as clearRecordsOneStore } from './cases/clear-one';
import { testcase as clearRecordsMultipleStores } from './cases/clear-multiple';

export default async function upsertAndClear(suite) {
  await suite('Upsert and clear records', async (assertionCheck) => {
    const databaseName = `e2e-${Date.now()}`;
    let sklad = await connectAndRunMigrations(assertionCheck, databaseName, 3);

    await assertionCheck('should upsert records into a keyPath object store', async () => {
      await upsertRecordsOneStore(sklad);
    });

    await assertionCheck('should clear records in a keyPath object store', async () => {
      await clearRecordsOneStore(sklad);
    });

    await assertionCheck('should upsert records into multiple object stores', async () => {
      await upsertRecordsMultipleStores(sklad);
    });

    await assertionCheck('should clear records in a keyPath object store', async () => {
      await clearRecordsMultipleStores(sklad);
    });

    await assertionCheck('should close connection and delete the database', async () => {
      sklad.close();
      await deleteDatabase(databaseName);
    });
  });
}
