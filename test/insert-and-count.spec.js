const { test } = require('@playwright/test');

test('Insert and count records', async ({ page }) => {
  await page.goto('/test/fixture.html');
  const dbName = `e2e-${Date.now()}`;

  await test.step('connect and run migrations (v1)', async () => {
    await page.evaluate(async (dbName) => {
      const { testcase: migrate } = await import('/test/cases/migrations.js');
      window.__sklad = await migrate((_label, fn) => fn(), dbName, 1);
    }, dbName);
  });

  await test.step('insert records into one store', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/insert-one.js');
      await testcase(window.__sklad);
    });
  });

  await test.step('close connection', async () => {
    await page.evaluate(() => window.__sklad.close());
  });

  await test.step('connect and run migrations (v2)', async () => {
    await page.evaluate(async (dbName) => {
      const { testcase: migrate } = await import('/test/cases/migrations.js');
      window.__sklad = await migrate((_label, fn) => fn(), dbName, 2);
    }, dbName);
  });

  await test.step('insert records into multiple stores', async () => {
    await page.evaluate(async () => {
      const { testcase } = await import('/test/cases/insert-multiple.js');
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
