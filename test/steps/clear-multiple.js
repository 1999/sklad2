export const step = {
  name: 'Clear students and cards',
  async execute(sklad) {
    await sklad.clearStores(['students', 'cards']);
    return sklad;
  },
};
