import insertAndCountSpec from './insert-and-count.spec.js';
import upsertAndClearSpec from './upsert-and-clear.spec.js';
import getAndDeleteSpec from './get-and-delete.spec.js';

async function suite(label, assertions) {
  const container = document.createElement('div');
  container.classList.add('container', 'progress');
  container.innerHTML = `<h1>${label}</h1>`;
  document.body.appendChild(container);

  const assertionCheck = async (testCase, fn) => {
    const checkResult = document.createElement('p');
    checkResult.innerHTML = `${testCase}.. `;
    container.appendChild(checkResult);

    try {
      const result = await fn();
      checkResult.insertAdjacentText('beforeend', 'OK')

      return result;
    } catch (err) {
      checkResult.insertAdjacentText('beforeend', 'Failed')
      throw err;
    }
  };

  try {
    await assertions(assertionCheck);
    container.classList.add('success');
  } catch (err) {
    container.classList.add('fail');

    const errorDescription = document.createElement('pre');
    errorDescription.innerHTML = err.message;
    container.appendChild(errorDescription);
  }
}

async function main() {
  await insertAndCountSpec(suite);
  await upsertAndClearSpec(suite);
  await getAndDeleteSpec(suite);
}

main();
