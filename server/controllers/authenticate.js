var models = require('../models');
var sequelize = require('../db/sequelize-connection');
var bcrypt = require('bcrypt');
var session = require('express-session');
var utils = require('../utils/utils');

module.exports = {
  login: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    sequelize.sync().then(function() {
      // search for user in teachers table
      models.teachers.findOne({
        where: {'username': username} 
      })
      .then(function(matchedUser){
        // if there's no match in teachers
        if (!matchedUser) { 
          // search for user in students table
          models.students.findOne({
            where: {'username': username} 
          }).then(function(matchedUser) {
            if (!matchedUser) {
              // ERROR -> client redirects to '/signup'
              res.status(400).send('Invalid user');
            } else {
              // if user is a student, compare stored password with provided password
              bcrypt.compare(password, matchedUser.dataValues.password, function(err, match) {
                if (match) {
                  // generate a session on the response object
                  utils.createSession(req, res, 's_' + matchedUser.dataValues.id);

                  // Find all classes student is enrolled in (via student_classes table)
                  // Attach them to response object
                  models.students_classes.findAll({
                    where: {'student_id': matchedUser.dataValues.id},
                    include: [models.classes]
                  }).then(function(classes) {
                    var studentObj = {
                      student: {
                        uid: matchedUser.dataValues.id,
                        firstName: matchedUser.dataValues.firstname,
                        lastName: matchedUser.dataValues.lastname,
                        email: matchedUser.dataValues.email,
                        classes: classes
                      }
                    };
                    // SUCCESS -> client redirect to '/students'
                    res.status(200).send(studentObj);
                  });
                } else {
                  // ERROR: invalid password -> Client redirects to '/login'
                  res.status(400).send('Invalid password');
                }
              });
            }
          });
        } else {
          // if user is a teacher, compare stored password with provided password
          bcrypt.compare(password, matchedUser.dataValues.password, function(err, match) {
            if (match) {
              // generate a session on the response object
              utils.createSession(req, res, 't_' + matchedUser.dataValues.id);
              // pull teacher's classes from db and attach them to response object
              models.classes.findAll({
                where: {'teacher_id': matchedUser.dataValues.id}
              }).then(function(classes) {
                var teacherObj = {
                  teacher: {
                    uid: matchedUser.dataValues.id,
                    firstName: matchedUser.dataValues.firstname,
                    lastName: matchedUser.dataValues.lastname,
                    email: matchedUser.dataValues.email,
                    classes: classes
                  }
                };
              // SUCCESS -> client redirects to '/teachers'
              res.status(200).send(teacherObj);
            });
            } else {
              // ERROR: invalid password -> client redirects to '/login'
              res.status(400).send('Invalid password');
            }
          });
        }
      });
    });
  },

  signup: function(req, res, next) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var accountType = req.body.accountType;

    sequelize.sync().then(function() {
      // if user specifies 'teacher' account, check teachers table
      if (accountType === "teacher") {
        models.teachers.findOne({
          where: {'username': username}
        })
        .then(function(matchedUser) {
          // if teacher exists, send error
          if (matchedUser) { 
            // ERROR -> client reloads '/signup'
            res.status(500).send(username + " account already exists."); 
          } else {
            // if no matches are found, create new teacher account
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(password, salt, function(err, hash) {
                sequelize.sync().then(function() {
                  return models.teachers.create({
                    firstname: firstName,
                    lastname: lastName,
                    username: username,
                    email: email,
                    password: hash
                  });
                })
                .then(function(result) {
                  // Pull new teacher data from db (including db-generated id)
                  models.teachers.findOne({
                    where:{ 'username': username }
                  }).then(function(user) {
                    var teacherObj = {
                      teacher: {
                        uid: user.dataValues.id,
                        firstName: user.dataValues.firstname,
                        lastName: user.dataValues.lastname,
                        email: user.dataValues.email,
                        classes: []
                      }
                    };
                    // generate a session on the response object
                    utils.createSession(req, res, 't_' + user.dataValues.id);

                    // SUCCESS: Account created -> client redirects to '/teacher'
                    res.status(200).send(teacherObj);
                  });
                });
              });
            });
          }
        });
      } else {
        models.students.findOne({
           where: {'username': username}
         })
        .then(function(matchedUser) {
          // if student exists, send error
          if (matchedUser) { 
             res.status(500).send(username + " account already exists."); 
           } else {
            // if no matches are found
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(password, salt, function(err, hash) {
                sequelize.sync().then(function() {
                  return models.students.create({
                    firstname: firstName,
                    lastname: lastName,
                    username: username,
                    email: email,
                    password: hash
                  });
                })
                .then(function(result) {
                  // pull new student data from db (including db-generated id)
                  models.students.findOne({
                    where: { 'username': username }
                  }).then(function(user){
                    var studentObj = {
                      student: {
                        uid: user.dataValues.id,
                        firstName: user.dataValues.firstname,
                        lastName: user.dataValues.lastname,
                        email: user.dataValues.email,
                        classes: []
                      }
                    };
                    // generate a session on the response object
                    utils.createSession(req, res, 's_' + user.dataValues.id);

                    // SUCCESS -> client redirects to '/student'
                    res.status(200).send(studentObj);
                  });                  
                });
              });
            });
          }
        });
      }
    });
  },

  logout: function(req, res, next) {
    if (req.session) {
      req.session = null;
      res.status(200).send("user logged out");
    } else {
      console.log("no session to destroy");
      res.status(400).send("no user to log out");
    }
  },

  wildcard: function(req, res, next) {
    res.redirect('/');
  },

  checkAuth: function(req, res, next) {
    // req.session.user = 'ian';
    if(utils.isLoggedIn(req)) {
      //Currently can't get session user
      res.status(200).send({user:req.session.user});
    }
    else {
      res.status(200).send({user:false});
    }
  },
};