export const step = {
  name: 'Get all students',
  async execute(assertionCheck, sklad) {
    const allStudents = await sklad.getOneStore('students');
    console.log('All students, default sort', allStudents);

    const allStudentsPrevSorted = await sklad.getOneStore('students', { direction: 'prev' });
    console.log('All students, direction=prev', allStudentsPrevSorted);

    const threeStudentsSorted = await sklad.getOneStore('students', { direction: 'prev', limit: 3, offset: 1 });
    console.log('Students sort=prev,limit=3,offset=1', threeStudentsSorted);

    const loginSortedStudents = await sklad.getOneStore('students', {
      indexName: 'by_login',
      direction: 'prev',
      offset: 1,
      limit: 4,
    });
    console.log('Students sort=prev,limit=4,offset=1,index=by_login', loginSortedStudents);

    const loginBirthYearSortedStudents = await sklad.getOneStore('students', {
      indexName: 'by_login_birthyear',
      direction: 'prev',
    });
    console.log('Students sort=next,direction=next,index=by_login_birthyear', loginBirthYearSortedStudents);

    return sklad;
  },
};
