import { open } from '../../dist/esm';
import { databaseMigrations } from '../database-schema-migrations';

export const step = (databaseName, connectionIndex) => ({
  name: `Connect to the database and run migration ${connectionIndex} -> ${connectionIndex + 1}`,
  async execute(assertionCheck) {
    const action = databaseMigrations[connectionIndex - 1];
    const migrations = databaseMigrations.map(({ migration }) => migration);

    return await assertionCheck(action.label, async () => {
      return await open(databaseName, migrations.slice(0, connectionIndex));
    });
  },
});
