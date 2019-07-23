import { databaseMigrations } from './database-schema-migrations';
import { runSteps } from './run-steps';
import { step as stepConnectToDatabaseFactory } from './steps/connect-database';
import { step as stepCloseConnection } from './steps/close-connection';
import { step as stepDeleteDatabaseFactory } from './steps/delete-database';
import { step as stepInsertRecords } from './steps/insert';
import { step as stepInsertMultipleRecords } from './steps/insert-multiple';
import { step as stepCountRecords } from './steps/count';
import { step as stepCountMultipleRecords } from './steps/count-multiple';
import { step as stepClearRecords } from './steps/clear';
import { step as stepClearMultipleRecords } from './steps/clear-multiple';
import { step as stepGetAllRecords } from './steps/get';

const databaseName = `e2e-${Date.now()}`;

async function main() {
  await runSteps([
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 1),
    stepInsertRecords,
    stepCountRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 2),
    stepInsertMultipleRecords,
    stepCountMultipleRecords,
    stepClearRecords,
    stepCountMultipleRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, databaseMigrations, 3),
    stepInsertRecords,
    stepInsertMultipleRecords,
    stepCountMultipleRecords,
    stepGetAllRecords,
    stepClearMultipleRecords,
    stepCountMultipleRecords,
    stepCloseConnection,
    stepDeleteDatabaseFactory(databaseName),
  ]);
}

main();
