export const step = {
  name: 'Get all students and cards',
  async execute(sklad, log) {
    const everything = await sklad.getMultipleStores({
      students: {},
      cards: {
        indexName: 'by_tag',
        direction: 'next',
        range: IDBKeyRange.only('my.gov.au'),
      },
    });

    log(everything);
    return sklad;
  },
};
