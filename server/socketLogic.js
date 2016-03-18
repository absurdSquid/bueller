var models = require("./models");

module.exports = function(io) {
  
  var poll = {
    responseId: 1,
    type: 'thumbs',
    datetime: new Date(),
    lessonId: 13,
  };

  io.on('connection', function(client){

    //TEACHER CODE
      
    client.on('studentConnect', function(data) {
      // FRONTEND-LISTENER: client.on('newStudentConnected', (studentInfo) => {display(studentCount++ and studentInfo);});
      
      //TODO: DB.write('newStudentConnected', data);
      console.log('Student connected');
    });

    client.on('studentResponse', function(data) {
      console.log('INCOMING STUDENT RESPONSE:', data);
      io.sockets.emit('studentResponseForTeacher', data);

      //TODO: only save if not quick class?
      models.poll_responses.create({
        response_val: data.answer,
        student_id: data.userId,
        poll_id: data.pollId
      })
      .catch(function(err) {
        console.error('Error saving student', data.userId, 'poll response to DB:', err);
      });
    });

    client.on('teacherConnect', function(data) {
      console.log('Teacher connected');
    });


    //STUDENT CODE

  });
};