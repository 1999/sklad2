export async function runSteps(steps) {
  let artifact;
  let failed = false;

  for (const step of steps) {
    console.group(step.name);

    if (!failed || step.final) {
      try {
        console.time('execution time');
        artifact = await step.execute(artifact, console.log);
        console.log('done!');
      } catch (err) {
        console.error(err);
        failed = true;
      } finally {
        console.timeEnd('execution time');
      }
    } else {
      console.log('skip execution step');
    }

    console.groupEnd(step.name);
  }
}
