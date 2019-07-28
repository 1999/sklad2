export const testcase = async (sklad) => {
  await sklad.deleteFromStore('students', 'susy@gmail.com');
  expect(await sklad.countOneStore('students')).toBe(4);

  // delete all students whose email starts with "s"
  await sklad.deleteFromStore('students', IDBKeyRange.lowerBound('s'));
  expect(await sklad.countOneStore('students')).toBe(2);
};
