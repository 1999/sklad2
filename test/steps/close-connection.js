export const step = {
  name: 'Close connection',
  async execute(assertionCheck, sklad) {
    await assertionCheck('should close connection', () => {
      sklad.close();
    });
  },
};
