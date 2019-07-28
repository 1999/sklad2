import { deleteDatabase } from '../dist/esm';
import { testcase as connectAndRunMigrations } from './cases/migrations';
import { testcase as getRecordsMultipleStores } from './cases/get-multiple';
import { testcase as getRecordsOneStore } from './cases/get-one';
import { testcase as deleteOneStore } from './cases/delete-one';
import { testcase as deleteMultipleStores } from './cases/delete-multiple';

export default async function upsertAndClear(suite) {
  await suite('Get and delete records', async (assertionCheck) => {
    const databaseName = `e2e-${Date.now()}`;
    let sklad = await connectAndRunMigrations(assertionCheck, databaseName, 3);

    await assertionCheck('should get records from a keyPath object store', async () => {
      await getRecordsOneStore(sklad);
    });

    await assertionCheck('should delete records from one store', async () => {
      await deleteOneStore(sklad);
    });

    await assertionCheck('should get records from multiple object stores', async () => {
      await getRecordsMultipleStores(sklad);
    });

    await assertionCheck('should delete records from multiple stores', async () => {
      await deleteMultipleStores(sklad);
    });

    await assertionCheck('should close connection and delete the database', async () => {
      sklad.close();
      await deleteDatabase(databaseName);
    });
  });
}
