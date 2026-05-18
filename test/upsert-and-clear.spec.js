const { test } = require('@playwright/test');

test('Upsert and clear records', async ({ page }) => {
  await page.goto('/test/fixture.html');
  const dbName = `e2e-${Date.now()}`;

  await test.step('connect and run migrations (v3)', async () => {
    await page.evaluate(async (dbName) => {
      const { testcase: migrate } = await import('/test/cases/migrations.js');
      window.__sklad = await migrate((_label, fn) => fn(), dbName, 3);
    }, dbName);
  });

  await test.step('upsert records into one store', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/upsert-one.js');
      await testcase(window.__sklad);
    });
  });

  await test.step('clear records in one store', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/clear-one.js');
      await testcase(window.__sklad);
    });
  });

  await test.step('upsert records into multiple stores', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/upsert-multiple.js');
      await testcase(window.__sklad);
    });
  });

  await test.step('clear records in multiple stores', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/clear-multiple.js');
      await testcase(window.__sklad);
    });
  });

  await test.step('close connection and delete database', async () => {
    await page.evaluate(async (dbName) => {
      const { deleteDatabase } = await import('/dist/esm/index.js');
      window.__sklad.close();
      await deleteDatabase(dbName);
    }, dbName);
  });
});
