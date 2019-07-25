export const step = {
  name: 'Count students',
  async execute(assertionCheck, sklad) {
    await assertionCheck('should have expected number of records in a keyPath object store', async () => {
      const total = await sklad.countOneStore('students');
      expect(total).toBe(5);
    });

    return sklad;
  },
};
