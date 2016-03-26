var env = require('./environment');
var server = env.server + ':' + env.port;

module.exports = {
  login: (username, password) => {
    return fetch(server + '/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
  },

  signup: (firstName, lastName, username, email, password, teacherOrStudent) => {
    return fetch(server + '/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // add firstName and lastName
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          accountType: teacherOrStudent
        })
      });
  },

  checkForSession: () => {
    return fetch(server + '/checkAuth', {
      credentials: 'include'
    });
  },

  logout: () => {
    return fetch(server + '/logout');
  },

  addLesson: (classId, lessonName, lessonDate) => {
    return fetch(server + '/teachers/lessons', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: classId,
        lessonName: lessonName,
        lessonDate: lessonDate
      })
    }); 
  },


  getLessons: (classId) => {
    return fetch(server + '/teachers/lessons/' + classId);
  },

  getLessonData: (lessonId) => {
    return fetch(server + '/teachers/polls/' + lessonId);
  },
  
  startPoll: (pollObject, lessonId, classId) => {    
    return fetch(server + '/teachers/polls', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollObject: pollObject,
        lessonId: lessonId,
        classId: classId
      })
    });
  },

  getClasses: (teacherId) => {
    return fetch(server + '/teachers/classes/' + teacherId);
  },

  getClassData: (classId) => {
    return fetch(server + '/classes/lessons/' + classId);
  },

  getAllStudents: () => {
    
  },

  addStudentToClass: (classId, studentEmail) => {
    return fetch(server + '/teachers/class/student', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: classId,
        studentEmail: studentEmail
      })
    });
  }



}

