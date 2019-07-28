const students = [
  { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
  { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
  { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
  { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
  { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
];

export const testcase = async (sklad) => {
  const ids = await sklad.insertIntoOneStore('students', students.map((student) => ({
    value: student,
  })));

  expect(ids).toEqual([
    'paul@gmail.com',
    'stephen@gmail.com',
    'susanna@hotmail.com',
    'susy@gmail.com',
    'lucas@gmail.com',
  ]);

  const total = await sklad.countOneStore('students');
  expect(total).toBe(5);
};
