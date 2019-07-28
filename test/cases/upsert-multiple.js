const students = [
  { email: 'emilie@yandex.com', login: 'emilie', birthyear: 1980 },
  { email: 'keith@gmail.com', login: 'flint', birthyear: 1999 },
  { email: 'paul@gmail.com', login: 'paul_gmail_updated', birthyear: 2001 },
  { email: 'stephen@gmail.com', login: 'stephen_smart_updated', birthyear: 2002 },
];

const cards = [
  { login: 'dmitrii', password: 'password', tags: ['my', 'my.gov.au'] },
  { email: 'peter@gmail.com', tags: ['peter', 'github'] },
  { login: 'nicole@gmail.com', tags: ['nicole', 'my.gov.au'] },
];

export const testcase = async (sklad) => {
  await sklad.insertIntoOneStore('students', [
    {
      value: { email: 'paul@gmail.com' },
    },
    {
      value: { email: 'stephen@gmail.com' },
    },
  ]);

  const ids = await sklad.upsertIntoMultiple({
    students: students.map((student) => ({
      value: student,
    })),
    cards: cards.map((card) => ({
      value: card,
    }))
  });

  expect(ids).toEqual({
    cards: [1, 2, 3],
    students: ['emilie@yandex.com', 'keith@gmail.com', 'paul@gmail.com', 'stephen@gmail.com'],
  });

  const total = await sklad.countMultipleStores({
    students: {},
    cards: {},
  });

  expect(total).toEqual({
    students: 4,
    cards: 3,
  });
};
