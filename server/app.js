var express = require('express');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);
var models = require("./models");
var socketLogic = require("./socketLogic");
var bodyParser = require("body-parser");
var session = require('express-session');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var moment = require('moment');

var PORT = process.env.PORT || 3000;

// CORS handling
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://thumbroll.xyz"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Session handling
app.use(cookieParser('Bueller'));
app.use(session({secret: 'Bueller'}));

// Serve bundled index.html
app.use(express.static(__dirname + '/../client/desktop/dist'));

app.use(express.static(path.join(__dirname, '../client/desktop/dist')));

models.sequelize.sync({force: true}).then(function () {
  require('./config/routes.js')(app, io);
  socketLogic(io);

  server.listen(PORT, function (){
    console.log('listening on port', PORT);
  });

  // SAMPLE DB INSERTIONS
  models.teachers.create({
    firstname: 'Mr.',
    lastname: 'Teacher',
    username: 't',
    // t
    password: '$2a$10$l/UC8xusY/ae.2aGtm5iNOHC3m7wzKMNYmVZuU.aWsHpSG.jqpBNm',
    email: 'teacher@education.com'
  });

  models.teachers.create({
    firstname: 'Jake',
    lastname: 'Pace',
    username: 'jakepace',
    // 123
    password: '$2a$10$cWPLKHIJUX7YRLwJvpMrVeIi0Pxo/IATOPNJ43S2NU/2MG2Qd6rEq',
    email: 'jake@email.com'
  });

  models.teachers.create({
    firstname: 'Ian',
    lastname: 'DUBWABLANNNN',
    username: 'ianD',
    // 123
    password: '$2a$10$f1jdZ5ppWnnWXwL6Hm66/O.gWG25ajXG6KBHJKQtB1fE7rSEgFuNy',
    email: 'ian@gmail.com'
  });

  models.students.create({
    firstname: 'Dunning',
    lastname: 'Kruger',
    username: 's',
    // s
    password: '$2a$10$UR9XmBRvc90YMA9bWuXxcOqPXLK2M1QWgr1FR65wkAaNABaMlMGie',
    email: 's@email.com'
  });

  models.students.create({
    firstname: 'Shane',
    lastname: 'McGraw',
    username: 'shane',
    // 123
    password: '$2a$10$cWPLKHIJUX7YRLwJvpMrVeIi0Pxo/IATOPNJ43S2NU/2MG2Qd6rEq',
    email: 'shane@email.com'
  });

  models.students.create({
    firstname: 'Jacob',
    lastname: 'Lee',
    username: 'JLee',
    // 123
    password: '$2a$10$f1jdZ5ppWnnWXwL6Hm66/O.gWG25ajXG6KBHJKQtB1fE7rSEgFuNy',
    email: 'jacob@email.com'
  });

  models.students.create({
    firstname: 'Orlando',
    lastname: 'Calrisian',
    username: 'OlandoC',
    // 123
    password: '$2a$10$cWPLKHIJUX7YRLwJvpMrVeIi0Pxo/IATOPNJ43S2NU/2MG2Qd6rEq',
    email: 'orlando@cloudcity.com'
  });

  models.students.create({
    firstname: 'Max',
    lastname: 'Kroshka',
    username: 'Max',
    // 123
    password: '$2a$10$cWPLKHIJUX7YRLwJvpMrVeIi0Pxo/IATOPNJ43S2NU/2MG2Qd6rEq',
    email: 'max@email.com'
  });

  models.students.create({
    firstname: 'Edison',
    lastname: 'Huff',
    username: 'Edison',
    // 123
    password: '$2a$10$cWPLKHIJUX7YRLwJvpMrVeIi0Pxo/IATOPNJ43S2NU/2MG2Qd6rEq',
    email: 'edison@tinder.com'
  });

  ///////////////
  // Test data //
  ///////////////
  
  // models.classes.create({
  //   name: 'CS101',
  //   teacher_id: 1,
  // });

  // models.classes.create({
  //   name: 'CS201',
  //   teacher_id: 2
  // });

  // models.classes.create({
  //   name: 'History',
  //   teacher_id: 1
  // });

  // models.classes.create({
  //   name: 'Postmodern Gender Theory',
  //   teacher_id: 1
  // });

  // models.lessons.create({
  //   name: 'Week 1 - Intro',
  //   class_id: 1,
  //   date: moment().subtract(2, 'weeks').format()
  // });

  // models.lessons.create({
  //   name: 'Week 2 - JS Basics',
  //   class_id: 1,
  //   date: moment().subtract(1, 'weeks').format()
  // });

  // models.lessons.create({
  //   name: 'Week 3 - Algorithms',
  //   class_id: 1,
  //   date: moment().format()
  // });

  // models.lessons.create({
  //   name: 'Week 4 - Data Structures',
  //   class_id: 1,
  //   date: moment().add(1, 'weeks').format()
  // });

  // // Add History lessons
  // models.lessons.create({
  //   name: 'Week 1 - Ancient Egypt',
  //   class_id: 3,
  //   date: moment().subtract(1, 'weeks').format()
  // });

  // models.lessons.create({
  //   name: 'Week 2 - Mongols',
  //   class_id: 3,
  //   date: moment().add(1, 'weeks').format()
  // });

  // // Adding students to CS101
  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 1
  // });

  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 2
  // });

  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 3
  // });

  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 4
  // });

  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 5
  // });

  // models.students_classes.create({
  //   class_id: 1,
  //   student_id: 6
  // });

  // // Misc enrollments
  // models.students_classes.create({
  //   class_id: 3,
  //   student_id: 2
  // });

  // models.students_classes.create({
  //   class_id: 4,
  //   student_id: 5
  // });

  // models.polls.create({
  //   type: 'thumbs',
  //   lesson_id: 2,
  //   name: 'For loops',
  //   sent: true
  // });

  // models.polls.create({
  //   type: 'multiChoice',
  //   lesson_id: 3,
  //   name: "Sort time complexity",
  //   answer: 'B',
  //   sent: true,
  //   preset_data: JSON.stringify({
  //     subType: "ABCD", 
  //     question: "What is the time complexity of a merge sort?",
  //     A: "O(n)",
  //     B: "O(n log(n))",     
  //     C: "O(n2)",
  //     D: "O(log n)"
  //   })
  // });

  // models.polls.create({
  //   type: 'multiChoice',
  //   lesson_id: 3,
  //   name: "n-Queens",
  //   answer: 'A',
  //   sent: true,
  //   preset_data: JSON.stringify({
  //     subType: "ABC", 
  //     question: "n-Queens for n=3?",
  //     A: "0",
  //     B: "3",    
  //     C: "6",
  //   })
  // });

  // models.polls.create({
  //   type: 'thumbs',
  //   lesson_id: 3,
  //   name: 'Merge Sort',
  //   sent: true
  // });

  // models.polls.create({
  //   type: 'multiChoice',
  //   lesson_id: 5,
  //   answer: 'B',
  //   name: 'American Presidents',
  //   sent: false,
  //   preset_data: JSON.stringify({ 
  //     question: "Who is my favorite president?",
  //     A: 'Lincoln',
  //     B: 'Carter',    
  //     C: 'Clinton',
  //     D: 'Jackson'
  //   })
  // });

  // models.polls.create({
  //   type: 'thumbs',
  //   lesson_id: 2,
  //   name: 'Underscore',
  //   sent: true
  // });

  // models.poll_responses.create({
  //   response_val: 2,
  //   student_id: 1,
  //   poll_id: 1,
  // });

  // models.poll_responses.create({
  //   response_val: 16,
  //   student_id: 2,
  //   poll_id: 1,
  // });

  // models.poll_responses.create({
  //   response_val: 70,
  //   student_id: 3,
  //   poll_id: 1,
  // });

  // models.poll_responses.create({
  //   response_val: 90,
  //   student_id: 4,
  //   poll_id: 1,
  // });

  // models.poll_responses.create({
  //   response_val: 90,
  //   student_id: 5,
  //   poll_id: 1,
  // });


  // models.poll_responses.create({
  //   response_val: 'B',
  //   student_id: 1,
  //   poll_id: 2,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'A',
  //   student_id: 2,
  //   poll_id: 2,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'B',
  //   student_id: 3,
  //   poll_id: 2,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'A',
  //   student_id: 1,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'A',
  //   student_id: 2,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'C',
  //   student_id: 3,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'A',
  //   student_id: 4,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'B',
  //   student_id: 5,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 'A',
  //   student_id: 6,
  //   poll_id: 3,
  // }); 

  // models.poll_responses.create({
  //   response_val: 10,
  //   student_id: 1,
  //   poll_id: 4,
  // }); 

  // models.poll_responses.create({
  //   response_val: 23,
  //   student_id: 2,
  //   poll_id: 4,
  // }); 

  // models.poll_responses.create({
  //   response_val: 77,
  //   student_id: 3,
  //   poll_id: 4,
  // }); 

  // models.poll_responses.create({
  //   response_val: 91,
  //   student_id: 4,
  //   poll_id: 4,
  // }); 

  // models.poll_responses.create({
  //   response_val: 100,
  //   student_id: 5,
  //   poll_id: 4,
  // }); 

  // models.poll_responses.create({
  //   response_val: 15,
  //   student_id: 1,
  //   poll_id: 6,
  // }); 

  // models.poll_responses.create({
  //   response_val: 100,
  //   student_id: 2,
  //   poll_id: 6,
  // }); 

  // models.poll_responses.create({
  //   response_val: 65,
  //   student_id: 3,
  //   poll_id: 6,
  // }); 

  // models.poll_responses.create({
  //   response_val: 60,
  //   student_id: 4,
  //   poll_id: 6,
  // }); 

  // models.poll_responses.create({
  //   response_val: 95,
  //   student_id: 5,
  //   poll_id: 6,
  // }); 
});
module.exports = app
