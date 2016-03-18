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

  signup: (username, password, firstName, lastName, teacherOrStudent) => {
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
          password: password,
          accountType: teacherOrStudent
        })
      });
  },

  addLesson: (classId) => {
    return fetch(server + '/teachers/lessons', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classId: classId
      })
    }); 
  },


  getLessons: (classId) => {
    return fetch(server + '/teachers/lessons/' + classId);
  },

  getLessonData: (lessonId) => {
    return fetch(server + '/teachers/polls/' + lessonId);
  },
  
  startPoll: (pollObject, lessonId) => {    
    return fetch(server + '/teachers/polls', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollObject: pollObject,
        lessonId: lessonId
      })
    });
  }
}

