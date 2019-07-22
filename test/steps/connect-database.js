import { open } from '../../dist/esm';

export const step = (databaseName, databaseMigrations, connectionIndex) => ({
  name: `Connect to the database and run migration ${connectionIndex - 1} -> ${connectionIndex}`,
  async execute(_, log) {
    return await open(databaseName, {
      migrations: databaseMigrations(log).slice(0, connectionIndex),
    });
  },
});
