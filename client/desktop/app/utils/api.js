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
          password: password,
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

  addClass: (teacherId, className) => {
    return fetch(server + '/teachers/classes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        className: className,
        teacherId: teacherId,
      })
    }); 
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
  },

  getTodaysLessons: (teacherId) => {
    return fetch(server + '/teachers/' + teacherId + '/lessons/today');
  },

  // Get teacher desktop data:
  getClassLessonsData: (classId) => {
    return fetch(server + '/classes/' + classId + '/lessons');
  },

  addThumbPoll: (lessonId, title, question) => {
    return fetch(server + '/classes/lessons/thumbs', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId: lessonId,
        title: title,
        type: "thumbs",
        question: question
      })
    });
  },

  addMultiChoicePoll: (lessonId, title, question, answer, A, B, C, D) => {
    return fetch(server + '/classes/lessons/multiChoice', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId: lessonId,
        title: title,
        type: "multiChoice",
        question: question,
        answer: answer,
        A: A,
        B: B,
        C: C,
        D: D
      })
    });
  },


  getLessonPollsData: (lessonId) => {
    return fetch(server + '/lessons/' + lessonId + '/polls');
  },

  getClassStudentsData: (classId) => {
    return fetch(server + '/classes/' + classId + '/students');
  },

  getStudentPollsData: (classId, studentId) => {
    return fetch(server + '/classes/' + classId + '/students/' + studentId);
  },

  getClassName: (classId) => {
    return fetch(server + '/classes/className/' + classId);
  },

  getTeacherInfo: (teacherId) => {
    return fetch(server + '/teachers/info/' + teacherId);
  }
}

