export const testcase = async (sklad) => {
  await sklad.deleteFromStores({
    students: 'some_missing_key',
    cards: IDBKeyRange.only(3),
  });
  const total1 = await sklad.countMultipleStores({ students: {}, cards: {} });
  expect(total1).toEqual({ students: 5, cards: 2 });

  // delete all students whose email starts with "s"
  await sklad.deleteFromStores({
    students: IDBKeyRange.lowerBound('s'),
    cards: IDBKeyRange.lowerBound(2),
  });
  const total2 = await sklad.countMultipleStores({ students: {}, cards: {} });
  expect(total2).toEqual({ students: 2, cards: 1 });
};
