export const step = {
  name: 'Close connection',
  async execute(sklad) {
    sklad.close();
  },
};
