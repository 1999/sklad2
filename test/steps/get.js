export const step = {
  name: 'Get all students',
  async execute(sklad, log) {
    const allStudents = await sklad.getOneStore('students');
    log('All students, default sort', allStudents);

    const allStudentsPrevSorted = await sklad.getOneStore('students', { direction: 'prev' });
    log('All students, direction=prev', allStudentsPrevSorted);

    const threeStudentsSorted = await sklad.getOneStore('students', { direction: 'prev', limit: 3, offset: 1 });
    log('Students sort=prev,limit=3,offset=1', threeStudentsSorted);

    // TBD
    // by_login
    // by_login_birthyear
    // by_login_unique

    return sklad;
  },
};
