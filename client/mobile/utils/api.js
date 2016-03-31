var env = require('./environment');
var server = env.server + ':' + env.port;

module.exports = {
  login: (username, password) => {
    return fetch(server + '/login', {
        method: 'POST',
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

  addLesson: (classId) => {
    var lessonName = 'New Lesson ' + new Date().toLocaleDateString();
    return fetch(server + '/teachers/lessons', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: classId,
        lessonName: lessonName,
      })
    }); 
  },
  
  getCurrentLesson: (lessonId) => {
    return fetch(server +'/teachers/lesson/' + lessonId);
  },

  getStudentClasses: (studentId) => {
    return fetch(server + '/students/classes/' + studentId);
  },

  getClasses: (teacherId) => {
    return fetch(server + '/teachers/classes/' + teacherId)
  },

  getLessons: (classId) => {
    return fetch(server + '/teachers/lessons/' + classId)
  },

  getLessonData: (lessonId) => {
    return fetch(server + '/teachers/polls/' + lessonId);
  },

  getLessonPolls: (lessonId) => {
    return fetch(server + '/teachers/polls/' + lessonId);
  },
  
  startPoll: (pollObject, lessonId, classId) => {    
    var type = pollObject.type;
    return fetch(server + '/teachers/polls', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollObject: pollObject,
        name: 'Default ' + type + ' ' + new Date().toTimeString(),
        lessonId: lessonId,
        classId: classId
      })
    });
  }
}

