//var Teachers = require('../models/teachers');
//var TeacherClasses = require('../models/Teacher_classes');
//var Classes = require('../models/classes');
//var ClassLessons = require('../models/class_lessons');
// var Lessons = require('../models/lessons');
//var RequestedResponses = require('../models/requested_responses');

module.exports = {

  readyStage : function(io, req, res, next) {

    io.on('connection', function(student){
      student.emit('studentStandby', studentInformation);
    });

    res.status(201).send('Welcome, student.');
  }
};