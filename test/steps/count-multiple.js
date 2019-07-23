export const step = {
  name: 'Count students and cards',
  async execute(sklad, log) {
    const total = await sklad.countMultipleStores({
      students: {},
      cards: { indexName: 'by_tag' },
    });

    log(`Total students and cards: ${JSON.stringify(total)}`);
    return sklad;
  },
};
