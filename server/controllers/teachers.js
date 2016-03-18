var models = require("./../models");

module.exports = {
  getClasses: function(req, res, next) {
    var teacherId = req.body.teacherId;

    //TODO: get all classes through TeacherClasses
    //currently being handled by authentication controller, but probably should be here
  },

  getClassLessons: function(req, res, next) {
    var classId = req.params.classId;
    models.lessons.findAll({ where: {
      class_id: classId
      }
    })
    .then(function(lessons) {
      res.status(200).send(lessons);
    })
    .catch(function(err) {
      console.error('Error getting class lessons from DB:', err);
      res.status(500).send(err);
    });
  },

  addClassLesson: function(req, res, next) {
    var classId = req.body.classId;
    var date = new Date();
    models.lessons.create({
      name: 'New Lesson: ' + date.toLocaleDateString(),
      date: date,
      class_id: classId
    })
    .then(function(data) {
      var body = {lessonId: data.dataValues.id};
      res.status(200).send(body);
    })
    .catch(function(err) {
      console.error('Error saving lesson to DB:', err);
      res.status(500).send(err);
    });
  },

  getLessonPolls: function(req, res, next) {
    var lessonId = req.params.lessonId;
    models.polls.findAll({ where: {
      lesson_id: lessonId,
      //TODO?: preset: true
      }
    })
    .then(function(polls) {
      res.status(200).send(polls);
    })
    .catch(function(err) {
      console.error('Error getting class lessons from DB:', err);
      res.status(500).send(err);
    });
  },

  pollClass: function(io, req, res, next) {
    var lessonId = req.body.lessonId;
    var pollObject = req.body.pollObject;
    //TODO: query if preset. otherwise:
    var type = '';
    //TODO: should have backend/frontend consistency in how we identify different types
    if(pollObject.id == 1) {
      type = 'thumbs';
    } else if(pollObject.id == 2) {
      type = 'multiChoice';
    }

    models.polls.create({
      type: type,
      lesson_id: lessonId
    })
    .then(function(data) {
      var pollInformation = {
        lessonId: lessonId,
        pollObject: pollObject,
        pollId: data.dataValues.id
      }
      io.sockets.emit('newPoll', pollInformation);
      res.status(201).send('Poll sent... ' + pollInformation);
    })
    .catch(function(err) {
      console.error('Error saving poll to DB:', err);
      res.status(500).send(err);
    });
  },
};