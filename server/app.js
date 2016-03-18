var app = require('express')();
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);
var models = require("./models");
var socketLogic = require("./socketLogic");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

models.sequelize.sync({force: true}).then(function () {
  require('./config/routes.js')(app, io);
  socketLogic(io);

  server.listen(PORT, function (){
    console.log('listening on port', PORT);
  });

  // SAMPLE DB INSERTIONS
  models.teachers.create({
    firstname: 'Jake',
    lastname: 'Pace',
    username: 'jakepace',
    password: 'pass',
  });

  models.teachers.create({
    firstname: 'Ian',
    lastname: 'DUBWABLANNNN',
    username: 'ianD',
    password: 'pass123',
  });


  models.students.create({
    firstname: 'Shane',
    lastname: 'McGraw',
    username: 'ShaneM',
    password: 'passworddd',
  });

  models.students.create({
    firstname: 'Jacob',
    lastname: 'Lee',
    username: 'JLee',
    password: '1234',
  });

  models.students.create({
    firstname: 'Orlando',
    lastname: 'Calrisian',
    username: 'OlandoC',
    password: 'pass123',
  });

  models.classes.create({
    name: 'Quick Class',
  });

  models.lessons.create({
    name: 'Default',
    class_id: 1
  });

  models.classes.create({
    name: 'CS101',
    teacher_id: 1,
  });

  models.classes.create({
    name: 'CS102',
    teacher_id: 2,
  });

  models.classes.create({
    name: 'History',
  });

  // Needs correct fiends added
  models.students_classes.create({
    class_id: 2,
    student_id: 1
  });

  models.students_classes.create({
    class_id: 3,
    student_id: 2
  });

  models.students_classes.create({
    class_id: 3,
    student_id: 3
  });

});