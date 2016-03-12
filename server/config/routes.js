var classesController = require('../controllers/classes');
var classLessonController = require('../controllers/class_lessons');
var lessonsController = require('../controllers/lessons');
var receivedResponsesController = require('../controllers/received_responses');
var requestedResponsesController = require('../controllers/requested_responses');
var studentsController = require('../controllers/students');
var studentsClassesController = require('../controllers/students_classes');
var teacherClassesController = require('../controllers/teacher_classes');
var teachersController = require('../controllers/teachers');

module.exports = function(app) {

  app.get('/login', );

  app.get('/signup', );

  app.get('/teachers', );

  app.get('/students', );

  app.get('/teachers/poll', );

  app.get('/teachers/thumbs', );

}