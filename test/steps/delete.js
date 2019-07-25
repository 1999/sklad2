export const step = {
  name: 'Delete some students and cards',
  async execute(assertionCheck, sklad) {
    await sklad.deleteFromStore('students', 'emilie@yandex.com');
    await sklad.deleteFromStores({
      students: 'does_not_exist',
      cards: IDBKeyRange.upperBound(5, true),
    });

    return sklad;
  },
};
