export const step = {
  name: 'Clear students',
  async execute(sklad) {
    await sklad.clearStore('students');
    return sklad;
  },
};
