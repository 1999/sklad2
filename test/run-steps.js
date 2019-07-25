export async function runSteps(steps) {
  let artifact;
  let failed = false;

  const assertionCheck = (container) => async (testCase, fn) => {
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

  for (const step of steps) {
    const container = document.createElement('div');
    container.classList.add('container');
    container.innerHTML = `<h1>${step.name}</h1>`;

    if (!failed || step.final) {
      try {
        artifact = await step.execute(assertionCheck(container), artifact);
        container.classList.add('success');
      } catch (err) {
        container.classList.add('fail');

        const errorDescription = document.createElement('pre');
        errorDescription.innerHTML = err.message;
        container.appendChild(errorDescription);

        failed = true;
      }
    } else {
      container.classList.add('skip');
      container.firstChild.insertAdjacentText('beforeend', ' [skip]');
    }

    document.body.appendChild(container);
  }
}
