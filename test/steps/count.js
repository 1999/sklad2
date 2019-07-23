export const step = {
  name: 'Count students',
  async execute(sklad, log) {
    const total = await sklad.countOneStore('students');
    log(`Students in store: ${total}`);

    return sklad;
  },
};
