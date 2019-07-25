export const step = {
  name: 'Count students and cards',
  async execute(assertionCheck, sklad) {
    await assertionCheck('should have expected number of records in multiple object stores', async () => {
      const total = await sklad.countMultipleStores({
        students: {},
        cards: { indexName: 'by_tag' },
      });

      expect(total).toEqual({ students: 7, cards: 6 });
    });

    return sklad;
  },
};
