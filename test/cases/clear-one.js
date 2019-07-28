export const testcase = async (sklad) => {
  await sklad.clearStore('students');

  const total = await sklad.countOneStore('students');
  expect(total).toBe(0);
};
