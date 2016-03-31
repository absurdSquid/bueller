var models = require("./models");

module.exports = function(io) {

  io.on('connection', function(client){
    var room;
    //TEACHER CODE
    client.on('teacherConnect', function(data) {
      room = 'room' + data.classId;
      client.join(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      console.log('Teacher connected to', room);
      io.sockets.to(room).emit('teacherJoinedRoom', data);
    });

    //maybe not necessary since basically the same as above
    client.on('teacherQuickClassConnect', function(data) {
      room = 'room' + data.classId;
      client.join(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      console.log('Teacher connected to quick class', room);
      io.sockets.to(room).emit('teacherJoinedRoom', data);
    });

    client.on('teacherClosePoll', function(data) {
      var pollId = data.pollId;
      // var classId = data.classId;
      console.log('teacher closing poll', pollId, 'in', room);
      io.sockets.to(room).emit('closePoll', data);
    });

    client.on('callOnStudent', function(data) {
      io.sockets.to(room).emit('teacherCalledOnStudent', data);
    });

    client.on('teacherLeavingClass', function(data) {
      // var classId = data.classId;
      console.log('teacher leaving class', data);
      client.leave(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      io.sockets.to(room).emit('teacherLeftClass', data);
      room = undefined;
    });

    client.on('teacherLoggingOut', function(data) {
      // var classId = data.classId;
      console.log('teacher logging out from class', data);
      data.userCount = io.sockets.adapter.rooms[room].length -1;
      client.leave(room);
      io.sockets.to(room).emit('teacherLeftClass', data);
      room = undefined;
    });

    //STUDENT CODE
    client.on('studentConnect', function(data) {
      // FRONTEND-LISTENER: client.on('newStudentConnected', (studentInfo) => {display(studentCount++ and studentInfo);});
      var userId = data.user.uid;
      room = 'room' + data.classId;
      client.join(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      console.log('Student', userId, 'connected to', room);
      io.sockets.to(room).emit('studentJoinedRoom', data);
      //TODO: DB.write('newStudentConnected', data);
    });

    client.on('studentQuickClassConnect', function(data) {
      room = 'room' + data.classId;
      client.join(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      console.log('Student connected to quick class', room);
      io.sockets.to(room).emit('studentJoinedRoom', data);
    });

    client.on('studentResponse', function(data) {
      console.log('INCOMING STUDENT RESPONSE:', data);
      data.userCount = io.sockets.adapter.rooms[room].length;
      io.sockets.to(room).emit('studentResponseForTeacher', data);

      if(data.pollId !== 'Quick Poll') {
        models.poll_responses.create({
          response_val: data.answer,
          student_id: data.user.uid,
          poll_id: data.pollId
        })
        .catch(function(err) {
          console.error('Error saving student', data.user.uid, 'poll response to DB:', err);
        });
      }

    });

    client.on('raiseHand', function(data) {
      console.log('Student', data.user.uid, 'raised hand');
      io.sockets.to(room).emit('studentRaisedHand', data);
    });

    client.on('askQuestions', function(data) {
      io.sockets.to(room).emit('studentQuestions', data);
    })

    client.on('studentLeavingClass', function(data) {
      var userId = data.user.uid;
      // var classId = data.classId;
      client.leave(room);
      data.userCount = io.sockets.adapter.rooms[room].length;
      console.log('Student', userId, 'leaving', room);
      io.sockets.to(room).emit('studentLeftRoom', data);
      room = undefined;
    });

    client.on('studentLoggingOut', function(data) {
      var userId = data.user.uid; 
      // var classId = data.classId;
      data.userCount = io.sockets.adapter.rooms[room] - 1;
      client.leave(room);
      console.log('Student', userId, 'leaving', room);
      io.sockets.to(room).emit('studentLeftRoom', data);
      room = undefined;
    });
  });
};