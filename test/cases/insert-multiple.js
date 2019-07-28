const students = [
  { email: 'emilie@yandex.com', login: 'emilie', birthyear: 1980 },
  { email: 'keith@gmail.com', login: 'flint', birthyear: 1999 }
];

const cards = [
  { login: 'dmitrii', password: 'password', tags: ['my', 'my.gov.au'] },
  { email: 'peter@gmail.com', tags: ['peter', 'github'] },
  { login: 'nicole@gmail.com', tags: ['nicole', 'my.gov.au'] },
];

export const testcase = async (sklad) => {
  const ids = await sklad.insertIntoMultiple({
    students: students.map((student) => ({
      value: student,
    })),
    cards: cards.map((card) => ({
      value: card,
    }))
  });

  expect(ids).toEqual({
    cards: [1, 2, 3],
    students: ['emilie@yandex.com', 'keith@gmail.com'],
  });

  const total = await sklad.countMultipleStores({
    students: {},
    cards: { indexName: 'by_tag' },
  });

  expect(total).toEqual({
    students: 7,
    cards: 6,
  });
};
