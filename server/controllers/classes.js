var models = require("./../models");
var sequelize = require('./../models/index').sequelize;

module.exports = {
  getLessons: function(req, res, next) {
    var classId = req.params.classId;
    models.lessons.findAll({ where: {
        class_id: classId
      }
    })
    .then(function(lessons){
      models.classes.findOne({ where: {
          id: classId
        } 
      }).then(function(oneClass){
        models.students_classes.findAll({ 
          where: { class_id: classId},
          include: [models.students]
      }).then(function(students){
        var response = {
          className: oneClass.dataValues.name,
          lessons: lessons,
          students: students
        };
        res.status(200).send(response);
      });
      });
    })
    .catch(function(err){
      console.error('Error getting lessons from DB', err);
      res.status(500).send(err);
    })
  },

  getCurrentLesson: function(req, res, next){
    var lessonId = req.params.lessonId;
    models.lessons.findOne({
      where: {
        id: lessonId,
      }
    })
    .then(function(data){
      res.status(200).send(data);
    })
    .catch(function(error){
      res.status(500).send(error);
    })
  },
  
  getClassName: function(req, res, next) {
    var classId = req.params.classId;
    models.classes.findOne({ where: {
        id: classId
      }
    }).then(function(data) {
      res.status(200).send(data);
    }).catch(function(error) {
      console.error(error);
      res.status(500).send(error);
    })
  },

  getClassLessonsData: function(req, res, next) {
    var classId = req.params.classId;
    sequelize.query(
      'SELECT w.lesson_id, w.lesson_name, w.date, w.poll_count, u.potential_correct_responses_count, ' 
      + 'x.response_count, y.correct_response_count, z.average_thumb, v.student_count FROM '
        + '(SELECT a.id AS lesson_id, a.name AS lesson_name, a.date, '
        + 'COUNT(b.*) AS poll_count ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'GROUP BY a.id, a.name) w '
      + 'LEFT JOIN '
        + '(SELECT a.id AS lesson_id, '
        + 'COUNT(c.*) AS response_count ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'LEFT JOIN poll_responses c ON c.poll_id = b.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'GROUP BY a.id) x '
      + 'ON w.lesson_id = x.lesson_id LEFT JOIN '
        + '(SELECT a.id AS lesson_id, '
        + 'COUNT(c.*) AS correct_response_count ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'LEFT JOIN poll_responses c ON c.poll_id = b.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'AND b.answer IS NOT NULL '
        + 'AND c.response_val = b.answer '
        + 'GROUP BY a.id) y '
      + 'ON w.lesson_id = y.lesson_id LEFT JOIN '
        + '(SELECT a.id AS lesson_id, '
        + 'AVG(CAST(c.response_val AS decimal)) AS average_thumb ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'LEFT JOIN poll_responses c ON c.poll_id = b.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + "AND b.type = 'thumbs' " 
        + 'GROUP BY a.id) z '
      + 'ON w.lesson_id = z.lesson_id LEFT JOIN '
        + '(SELECT a.id AS lesson_id, '
        + 'COUNT(distinct c.student_id) AS student_count ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'JOIN poll_responses c ON c.poll_id = b.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'GROUP BY a.id) v '
      + 'ON w.lesson_id = v.lesson_id LEFT JOIN'
        + '(SELECT a.id AS lesson_id, '
        + 'COUNT(c.*) AS potential_correct_responses_count ' 
        + 'FROM lessons a '
        + 'LEFT JOIN polls b ON b.lesson_id = a.id '
        + 'LEFT JOIN poll_responses c ON c.poll_id = b.id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'AND b.answer IS NOT NULL '
        + 'GROUP BY a.id) u '
      + 'ON w.lesson_id = u.lesson_id '
      + 'ORDER BY w.date'
    ).then(function(data) {
      var results = data[0];
      res.status(200).send(results);
    }).catch(function(err) {
      console.error('Error with query', err)
      res.status(500).send(err);
    });

  },

  getLessonPollsData: function(req, res, next) {
    var lessonId = req.params.lessonId;
    sequelize.query(
      'SELECT w.poll_id, w.poll_name, w.type, w.sent, w.answer, w.response_count, ' 
      + 'x.student_count, y.correct_response_count, z.average_thumb FROM '
        + '(SELECT a.id AS poll_id, a.name AS poll_name, a.answer, a.type, a.sent, '
        + 'COUNT(b.*) AS response_count ' 
        + 'FROM polls a '
        + 'LEFT JOIN poll_responses b ON b.poll_id = a.id '
        + 'WHERE a.lesson_id = ' + lessonId + ' '
        + 'GROUP BY a.id) w '
      + 'LEFT JOIN '
        + '(SELECT a.id AS poll_id, '
        + 'COUNT(distinct c.id) AS student_count ' 
        + 'FROM polls a '
        + 'LEFT JOIN poll_responses b ON b.poll_id = a.id '
        + 'JOIN students c ON c.id = b.student_id '
        + 'WHERE a.lesson_id = ' + lessonId + ' '
        + 'GROUP BY a.id) x '
      + 'ON w.poll_id = x.poll_id LEFT JOIN '
        + '(SELECT a.id AS poll_id, '
        + 'COUNT(b.*) AS correct_response_count ' 
        + 'FROM polls a '
        + 'LEFT JOIN poll_responses b ON b.poll_id = a.id '
        + 'WHERE a.lesson_id = ' + lessonId + ' '
        + 'AND a.answer IS NOT NULL '
        + 'AND b.response_val = a.answer '
        + 'GROUP BY a.id) y '
      + 'ON w.poll_id = y.poll_id LEFT JOIN '
        + '(SELECT a.id AS poll_id, '
        + 'AVG(CAST(b.response_val AS decimal)) AS average_thumb ' 
        + 'FROM polls a '
        + 'LEFT JOIN poll_responses b ON b.poll_id = a.id '
        + 'WHERE a.lesson_id = ' + lessonId + ' '
        + "AND a.type = 'thumbs' " 
        + 'GROUP BY a.id) z '
      + 'ON w.poll_id = z.poll_id '
    ).then(function(data) {
      var results = data[0];
      res.status(200).send(results);
    }).catch(function(err) {
      console.error('Error with query', err)
      res.status(500).send(err);
    });
  },

  getClassStudentsData: function(req, res, next) {
    var classId = req.params.classId;
    sequelize.query(
      // May want to start queries with classes for less selecting
      'SELECT w.student_id, w.first_name, w.last_name, w.lesson_count, u.potential_response_count, ' 
      + 'x.response_count, y.correct_response_count, v.potential_correct_response_count, z.average_thumb FROM '
        + '(SELECT a.id AS student_id, a.firstname AS first_name, a.lastname AS last_name, '
        + 'COUNT(distinct d.lesson_id) AS lesson_count ' 
        + 'FROM students a '
        + 'JOIN students_classes b ON a.id = b.student_id '
        + 'LEFT JOIN poll_responses c ON a.id = c.student_id '
        + 'LEFT JOIN polls d ON d.id = c.poll_id '
        + 'WHERE b.class_id = ' + classId + ' '
        + 'GROUP BY a.id, a.firstname, a.lastname) w '
      + 'LEFT JOIN '
        + '(SELECT a.id AS student_id, '
        + 'COUNT(c.*) AS response_count ' 
        + 'FROM students a '
        + 'JOIN students_classes b ON a.id = b.student_id '
        + 'LEFT JOIN poll_responses c ON a.id = c.student_id '
        + 'WHERE b.class_id = ' + classId + ' '
        + 'GROUP BY a.id) x '
      + 'ON w.student_id = x.student_id LEFT JOIN '
        + '(SELECT a.id AS student_id, '
        + 'COUNT(c.*) AS correct_response_count ' 
        + 'FROM students a '
        + 'JOIN students_classes b ON a.id = b.student_id '
        + 'LEFT JOIN poll_responses c ON a.id = c.student_id '
        + 'LEFT JOIN polls d ON d.id = c.poll_id '
        + 'WHERE b.class_id = ' + classId + ' '
        + 'AND d.answer IS NOT NULL '
        + 'AND c.response_val = d.answer '
        + 'GROUP BY a.id) y '
      + 'ON w.student_id = y.student_id LEFT JOIN '
        + '(SELECT a.id AS student_id, '
        + 'AVG(CAST(c.response_val AS decimal)) AS average_thumb ' 
        + 'FROM students a '
        + 'JOIN students_classes b ON a.id = b.student_id '
        + 'LEFT JOIN poll_responses c ON a.id = c.student_id '
        + 'LEFT JOIN polls d ON d.id = c.poll_id '
        + 'WHERE b.class_id = ' + classId + ' '
        + "AND d.type = 'thumbs' " 
        + 'GROUP BY a.id) z '
      + 'ON w.student_id = z.student_id LEFT JOIN '
        + '(SELECT a.id AS student_id, '
        + 'COUNT(c.*) AS potential_correct_response_count ' 
        + 'FROM students a '
        + 'JOIN students_classes b ON a.id = b.student_id '
        + 'LEFT JOIN poll_responses c ON a.id = c.student_id '
        + 'LEFT JOIN polls d ON d.id = c.poll_id '
        + 'WHERE b.class_id = ' + classId + ' '
        + 'AND d.answer IS NOT NULL '
        + 'GROUP BY a.id) v '
      + 'ON w.student_id = v.student_id LEFT JOIN '
        + '(SELECT a.class_id, COUNT(b.*) AS potential_response_count ' 
        + 'FROM lessons a '
        + 'JOIN polls b ON a.id = b.lesson_id '
        + 'WHERE a.class_id = ' + classId + ' '
        + 'AND b.sent = TRUE '
        + 'GROUP BY a.class_id) u '
      + 'ON u.class_id = ' + classId
    ).then(function(data) {
      var results = data[0];
      res.status(200).send(results);
    }).catch(function(err) {
      console.error('Error with query', err)
      res.status(500).send(err);
    });
  },

  getStudentPollsData: function(req, res, next) {
    var classId = req.params.classId;
    var studentId = req.params.studentId;

    sequelize.query(
      'SELECT b.id AS lesson_id, b.name AS lesson_name, b.date, c.response_val AS student_answer, '
      + 'a.id AS poll_id, a.name AS poll_name, a.type, a.answer AS correct_answer, a.sent '
      + 'FROM polls a '
      + 'JOIN lessons b ON a.lesson_id = b.id '
      + 'LEFT JOIN poll_responses c ON a.id = c.poll_id AND c.student_id = ' + studentId + ' '
      + 'WHERE a.sent = TRUE '
      + 'AND b.class_id = ' + classId + ' '
      + 'ORDER BY b.date, b.id, a.id '
    ).then(function(data) {
      var results = data[0];
      res.status(200).send(results);
    }).catch(function(err) {
      console.error('Error with query', err)
      res.status(500).send(err);
    });
  }
}

