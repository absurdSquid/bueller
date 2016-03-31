var studentsController = require('../controllers/students');
var teachersController = require('../controllers/teachers');
var classesController = require('../controllers/classes');
var authenticationController = require('../controllers/authenticate');
var utils = require('../utils/utils');

module.exports = function(app, io) {

  app.post('/login', authenticationController.login);
  app.post('/signup', authenticationController.signup);
  app.get('/logout', authenticationController.logout);

  app.get('/checkAuth', authenticationController.checkAuth);
  
  // Add new polls (including quick polls)
  app.post('/teachers/polls/', utils.checkUser, teachersController.pollClass.bind(null, io));

  app.get('/teachers/polls/:lessonId', utils.checkUser, teachersController.getLessonPolls);  
  
  app.get('/teachers/classes/:classId/lessons', utils.checkUser, teachersController.getClassLessons);
  
  //get lessons mobile for teachers
  app.get('/teachers/lessons/:classId', teachersController.getClassLessons);
  app.get('/teachers/classes/:teacherId', teachersController.getClasses);
  app.get('/students/classes/:studentId', studentsController.getClasses);
  app.get('/classes/lessons/:classId', classesController.getLessons);
  app.get('/teachers/lesson/:lessonId', classesController.getCurrentLesson);
  //get teacher desktop frontend data
  app.get('/teachers/:teacherId/lessons/today', teachersController.getTodaysLessons);
  app.get('/classes/className/:classId', classesController.getClassName);
  app.get('/classes/:classId/lessons', classesController.getClassLessonsData);
  app.get('/lessons/:lessonId/polls', classesController.getLessonPollsData);
  app.get('/classes/:classId/students', classesController.getClassStudentsData);
  app.get('/classes/:classId/students/:studentId', classesController.getStudentPollsData);

  // Add new class
  app.post('/teachers/classes', teachersController.addClass);

  // Add new lesson to class
  app.post('/teachers/lessons', teachersController.addClassLesson);

  app.post('/students/ready', utils.checkUser, studentsController.readyStage.bind(null, io));
  
  // Add student to class
  app.post('/teachers/class/student', teachersController.addStudentToClass);

  // Add new thumb poll to lesson
  app.post('/classes/lessons/thumbs', teachersController.addThumbPoll);

  // Add new multiChoice poll to lesson
  app.post('/classes/lessons/multiChoice', teachersController.addMultiChoicePoll);

  // Get teacher info
  app.get('/teachers/info/:teacherId', teachersController.getTeacherInfo);

  //Wildcard
  app.get('*', authenticationController.wildcard);
};