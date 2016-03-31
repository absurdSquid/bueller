  //var Teachers = require('../models/teachers');
//var TeacherClasses = require('../models/Teacher_classes');
//var Classes = require('../models/classes');
//var ClassLessons = require('../models/class_lessons');
// var Lessons = require('../models/lessons');
//var RequestedResponses = require('../models/requested_responses');
var models = require("./../models");

module.exports = {
  getClasses: function(req, res, next) {
    var studentId = req.params.studentId;
    models.students_classes.findAll({ 
      where: {
        student_id: studentId,
      },
      include: [models.classes]
    })
    .then(function(classes){
      res.status(200).send(classes);
    })
    .catch(function(err){
      console.error('Error getting class from DB', err);
      res.status(500).send(err);
    })
  },

  readyStage : function(io, req, res, next) {

    io.on('connection', function(student){
      student.emit('studentStandby', studentInformation);
    });

    res.status(201).send('Welcome, student.');
  }
};