const students = [
  { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
  { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
  { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
  { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
  { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
];

export const testcase = async (sklad) => {
  await sklad.insertIntoOneStore('students', students.map((student) => ({
    value: student,
  })));

  const allStudents = await sklad.getOneStore('students');
  expect(allStudents).toEqual([
    // note that by default IndexedDB sorts records by primary key which is "email" field here
    { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
    { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
    { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
    { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
  ]);

  const allStudentsPrevSorted = await sklad.getOneStore('students', { direction: 'prev' });
  expect(allStudentsPrevSorted).toEqual([
    { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
    { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
    { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
    { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
  ]);

  const threeStudentsSorted = await sklad.getOneStore('students', { direction: 'prev', limit: 3, offset: 1 });
  expect(threeStudentsSorted).toEqual([
    { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
    { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
  ]);

  const loginSortedStudents = await sklad.getOneStore('students', {
    indexName: 'by_login',
    direction: 'prev',
    offset: 1,
    limit: 4,
  });
  expect(loginSortedStudents).toEqual([
    { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
    { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
    { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
  ]);

  const loginBirthYearSortedStudents = await sklad.getOneStore('students', {
    indexName: 'by_login_birthyear',
    direction: 'prev',
  });
  expect(loginBirthYearSortedStudents).toEqual([
    { email: 'susy@gmail.com', login: 'susy_data_scientist', birthyear: 2002 },
    { email: 'susanna@hotmail.com', login: 'susy_data_scientist', birthyear: 2001 },
    { email: 'stephen@gmail.com', login: 'stephen_smart', birthyear: 2001 },
    { email: 'paul@gmail.com', login: 'paul_gmail', birthyear: 2000 },
    { email: 'lucas@gmail.com', login: 'bvb', birthyear: 1999 },
  ]);
};
