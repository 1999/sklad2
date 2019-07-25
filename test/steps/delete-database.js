import { deleteDatabase } from '../../dist/esm';

export const step = (databaseName) => ({
  name: 'Delete the database',
  final: true,
  async execute(assertionCheck) {
    await deleteDatabase(databaseName);
  },
});
