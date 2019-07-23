const students = [
  { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
  { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
  { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
  { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
  { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
];

export const step = {
  name: 'Insert students',
  async execute(sklad, log) {
    const ids = await sklad.insertIntoOneStore('students', students.map((student) => ({
      value: student,
    })));

    log(`IDs inserted into one store: ${JSON.stringify(ids)}`);
    return sklad;
  },
};
