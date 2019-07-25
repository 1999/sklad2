export const step = {
  name: 'Get all students',
  async execute(sklad, log) {
    const allStudents = await sklad.getOneStore('students');
    log('All students, default sort', allStudents);

    const allStudentsPrevSorted = await sklad.getOneStore('students', { direction: 'prev' });
    log('All students, direction=prev', allStudentsPrevSorted);

    const threeStudentsSorted = await sklad.getOneStore('students', { direction: 'prev', limit: 3, offset: 1 });
    log('Students sort=prev,limit=3,offset=1', threeStudentsSorted);

    const loginSortedStudents = await sklad.getOneStore('students', {
      indexName: 'by_login',
      direction: 'prev',
      offset: 1,
      limit: 4,
    });
    log('Students sort=prev,limit=4,offset=1,index=by_login', loginSortedStudents);

    const loginBirthYearSortedStudents = await sklad.getOneStore('students', {
      indexName: 'by_login_birthyear',
      direction: 'prev',
    });
    log('Students sort=next,direction=next,index=by_login_birthyear', loginBirthYearSortedStudents);

    // TBD
    // by_login_unique

    return sklad;
  },
};
