var chai = require('chai');
var server = 'http://localhost:3000';
var expect = require('chai').expect;
var app = require('../server/app')
var supertest = require('supertest');
var api = supertest(app)

describe('Thumbroll', function(){
  it('should list all classes for teacher id 1', function(done){
    api.get('/teachers/classes/1')
    .set('Accept', 'application/json')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body[2].name = "Postmodern Gender Theory";
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should list all lessons for class id 4', function(done){
    api.get('/classes/lessons/4')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.lesson = ''
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should list of poll for lesson id 3', function(done){
    api.get('/lessons/3/polls')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body[0].type = 'multiChoice'
        res.body[1].type = 'thumbs'
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should list class for student id 1', function(done){
    api.get('/students/classes/1')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body[0].class = 'CS101';
      });
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should list class for student id 1', function(done){
    api.get('/teachers/polls/3')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body[0].type = 'multiChoice'
        res.body[1].type = 'thumbs'
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should list lesson for class id 3', function(done){
    api.get('/teachers/classes/3/lessons')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body[0].name = 'Week 1 - Ancient Egypt'
        res.body[1].name = 'Week 2 - Mongols'
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return class ID when teacher added', function(done){
    api.post('/teachers/classes')
    .send({name: 'CS401',teacher_id: 1})
    .end(function(err,res){
      expect(200)
      expect(function(res){
        typeof res.body === 'object'
        Object.keys(res.body) = ['classId']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return poll when teacher add poll', function(done){
    api.post('/teachers/polls')
    .send({lessonId: 1, pollObject: 'thumbs', pollId: 1})
    .end(function(err,res){
      expect(201)
      expect(function(res){
        typeof res.body === 'object'
        Object.keys(res.body) = ['lessonId','pollObject','pollId']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return lessons when teacher create lessons', function(done){
    api.post('/teachers/lessons')
    .send({lessonName: 'coding week 1', data: '2016-04-01T21:04:07.840Z', classId: 1})
    .end(function(err,res){
      expect(200);
      expect(function(res){
        typeof res.body === 'object'
        Object.keys(res.body) = ['id', 'name', 'date', 'class_id']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return studens when teacher add student', function(done){
    api.post('/teachers/class/student')
    .send({studentEmail: 's@email.com', classId: 1})
    .end(function(err,res){
      expect(200)
      expect(function(res){
        typeof res.body === 'object'
        Object.keys(res.body) = ['student', 'created']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return thumbs infomation', function(done){
    api.post('/classes/lessons/thumbs')
    .send({lessonId: 1, type: 'thumbs', title: 'data', question:'Do you know something'})
    .end(function(err,res){
      expect(201)
      expect(function(res){
        typeof res.body === 'object'
        typeof res.body.preset_data === 'object'
        Object.keys(res.body) = ['id', 'type', 'lesson_id', 'name', 'sent', 'preset_data','answer']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return multiChoice infomation', function(done){
    api.post('/classes/lessons/multiChoice')
    .send({lessonId: 1, type: 'multiChoice', title: 'data structure', question:'Do you know something', answer: 'A'})
    .end(function(err,res){
      expect(201)
      expect(function(res){
        typeof res.body === 'object'
        typeof res.body.preset_data === 'object'
        Object.keys(res.body) = ['id', 'type', 'lesson_id', 'name', 'answer', 'sent', 'preset_data']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return teachers information', function(done){
    api.get('/teachers/info/1')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        res.body.id === 1
        Object.keys(res.body) = ['id', 'firstname', 'lastname', 'email', 'username', 'password']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return student information associate class', function(done){
    api.get('/classes/3/students')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        typeof res.body === 'array'
        Object.keys(res.body) = ['student_id', 'first_name', 'last_name', 'lesson_count', 'potential_response_count', 'response_count','correct_response_count','potential_correct_response_count','average_thumb']
      })
      done();
    })
  })
})

describe('Thumbroll', function(){
  it('should return today\'s lessons information', function(done){
    api.get('/teachers/1/lessons/today')
    .end(function(err,res){
      expect(200)
      expect(function(res){
        typeof res.body === 'array'
        typeof res.body[0] === 'object'
        Object.keys(res.body[0]) = ['class_id', 'class_name', 'id', 'name', 'date']
      })
      done();
    })
  })
})

