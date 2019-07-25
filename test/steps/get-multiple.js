export const step = {
  name: 'Get all students and cards',
  async execute(assertionCheck, sklad) {
    const everything = await sklad.getMultipleStores({
      students: {},
      cards: {
        indexName: 'by_tag',
        direction: 'next',
        range: IDBKeyRange.only('my.gov.au'),
      },
    });

    console.log(everything);
    return sklad;
  },
};
