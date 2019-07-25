export const step = {
  name: 'Clear students',
  async execute(assertionCheck, sklad) {
    await assertionCheck('should clear keyPath object store', async () => {
      await sklad.clearStore('students');
      expect(await sklad.countOneStore('students')).toBe(0);
    });

    return sklad;
  },
};
