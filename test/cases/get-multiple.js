const cards = [
  { login: 'dmitrii', password: 'password', tags: ['my', 'my.gov.au'] },
  { email: 'peter@gmail.com', tags: ['peter', 'github'] },
  { login: 'nicole@gmail.com', tags: ['nicole', 'my.gov.au'] },
];

const students = [
  { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
  { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
  { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
]

export const testcase = async (sklad) => {
  await sklad.insertIntoMultiple({
    cards: cards.map((card) => ({ value: card })),
    students: students.map((student) => ({ value: student })),
  });

  const everything = await sklad.getMultipleStores({
    students: {},
    cards: {},
  });
  expect(everything).toEqual({
    students: [
      { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
      { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
      { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
      { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
      { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
    ],
    cards: [
      { login: 'dmitrii', password: 'password', tags: ['my', 'my.gov.au'] },
      { email: 'peter@gmail.com', tags: ['peter', 'github'] },
      { login: 'nicole@gmail.com', tags: ['nicole', 'my.gov.au'] },
    ],
  });

  const range = await sklad.getMultipleStores({
    students: {
      offset: 3,
      limit: 1,
    },
    cards: {
      indexName: 'by_tag',
      direction: 'next',
      range: IDBKeyRange.only('my.gov.au'),
    },
  });
  expect(range).toEqual({
    students: [
      { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    ],
    cards: [
      { login: 'dmitrii', password: 'password', tags: ['my', 'my.gov.au'] },
      { login: 'nicole@gmail.com', tags: ['nicole', 'my.gov.au'] },
    ],
  })
};
