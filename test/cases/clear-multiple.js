export const testcase = async (sklad) => {
  await sklad.clearStores(['students', 'cards']);

  const total = await sklad.countMultipleStores({
    students: {},
    cards: {},
  });

  expect(total).toEqual({
    students: 0,
    cards: 0,
  });
};
