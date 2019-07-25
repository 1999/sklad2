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
import { step as stepGetRecords } from './steps/get';
import { step as stepGetMultipleRecords } from './steps/get-multiple';
import { step as stepDeleteRecords } from './steps/delete';

const databaseName = `e2e-${Date.now()}`;

async function main() {
  await runSteps([
    stepConnectToDatabaseFactory(databaseName, 1),
    stepInsertRecords,
    stepCountRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, 2),
    stepInsertMultipleRecords,

    stepCountMultipleRecords,
    stepClearRecords,
    stepCountMultipleRecords,
    stepClearMultipleRecords,
    stepCloseConnection,
    stepConnectToDatabaseFactory(databaseName, 3),
    stepInsertRecords,
    stepInsertMultipleRecords,
    stepCountMultipleRecords,
    stepGetRecords,
    stepGetMultipleRecords,
    stepCountMultipleRecords,
    stepDeleteRecords,
    stepCountMultipleRecords,
    stepClearMultipleRecords,
    stepCountMultipleRecords,
    stepCloseConnection,
    stepDeleteDatabaseFactory(databaseName),
  ]);
}

main();
