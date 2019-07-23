import { databaseMigrations } from './database-schema-migrations';
import { runSteps } from './run-steps';
import { step as stepConnectToDatabaseFactory } from './steps/connect-database';
import { step as stepCloseConnection } from './steps/close-connection';
import { step as stepDeleteDatabaseFactory } from './steps/delete-database';
import { step as stepInsertRecords } from './steps/insert';
import { step as stepInsertMultipleRecords } from './steps/insert-multiple';

const databaseName = `e2e-${Date.now()}`;

async function main() {
  await runSteps([
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 1),
    stepInsertRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 2),
    stepInsertMultipleRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 3),
    stepCloseConnection,
    stepDeleteDatabaseFactory(databaseName),
  ]);
}

main();
