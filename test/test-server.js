var chai = require('chai');
var chaiHttp = require('chai-http');
var request = require('request');
var server = 'http://localhost:3000';
var expect = require('chai').expect;

chai.use(chaiHttp);

describe('Thumbroll', function(){
  it('should list all classes for teacher id 1', function(){
    return chai.request(server)
    .get('/teachers/classes/1')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body[2].name).to.deep.equal("Postmodern Gender Theory")
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should list all lessons for class id 4', function(){
    return chai.request(server)
    .get('/classes/lessons/4')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.lesson).to.deep.equal();
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should list of poll for lesson id 2', function(){
    return chai.request(server)
    .get('/lessons/2/polls')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body[0].type).to.deep.equal('thumbs');
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should list class for student id 1', function(){
    return chai.request(server)
    .get('/students/classes/1')
    .then(function(res){
      var classes = res.body[0].class
      expect(res).to.have.status(200);
      expect(classes.name).to.deep.equal('CS101');
    })
    .catch(function(err){
      throw err;
    })
  })
})
// teachers/polls/:lessonId

describe('Thumbroll', function(){
  it('should list class for student id 1', function(){
    return chai.request(server)
    .get('/teachers/polls/3')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body[0].type).to.deep.equal('multiChoice');
      expect(res.body[1].type).to.deep.equal('multiChoice');
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should list lesson for class id 3', function(){
    return chai.request(server)
    .get('/teachers/classes/3/lessons')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body[0].name).to.deep.equal('Week 1 - Ancient Egypt');
      expect(res.body[1].name).to.deep.equal('Week 2 - Mongols');
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return class ID when teacher added', function(){
    return chai.request(server)
    .post('/teachers/classes')
    .send({name: 'CS401',teacher_id: 1})
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['classId'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return poll when teacher add poll', function(){
    return chai.request(server)
    .post('/teachers/polls')
    .send({lessonId: 1, pollObject: 'thumbs', pollId: 1})
    .then(function(res){
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['lessonId','pollObject','pollId'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return lessons when teacher create lessons', function(){
    return chai.request(server)
    .post('/teachers/lessons')
    .send({lessonName: 'coding week 1', data: '2016-04-01T21:04:07.840Z', classId: 1})
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['id', 'name', 'date', 'class_id'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return studens when teacher add student', function(){
    return chai.request(server)
    .post('/teachers/class/student')
    .send({studentEmail: 's@email.com', classId: 1})
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['student', 'created'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return thumbs infomation', function(){
    return chai.request(server)
    .post('/classes/lessons/thumbs')
    .send({lessonId: 1, type: 'thumbs', title: 'data', question:'Do you know something'})
    .then(function(res){
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(JSON.parse(res.body.preset_data)).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['id', 'type', 'lesson_id', 'name', 'sent', 'preset_data','answer'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return multiChoice infomation', function(){
    return chai.request(server)
    .post('/classes/lessons/multiChoice')
    .send({lessonId: 1, type: 'multiChoice', title: 'data structure', question:'Do you know something', answer: 'A'})
    .then(function(res){
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('object');
      expect(JSON.parse(res.body.preset_data)).to.be.an('object');
      expect(Object.keys(res.body)).to.deep.equal(['id', 'type', 'lesson_id', 'name', 'answer', 'sent', 'preset_data'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return teachers information', function(){
    return chai.request(server)
    .get('/teachers/info/1')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body.id).to.be.equal(1);
      expect(Object.keys(res.body)).to.deep.equal(['id', 'firstname', 'lastname', 'email', 'username', 'password'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return student information associate class', function(){
    return chai.request(server)
    .get('/classes/3/students')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(Object.keys(res.body[0])).to.deep.equal(['student_id', 'first_name', 'last_name', 'lesson_count', 'potential_response_count', 'response_count','correct_response_count','potential_correct_response_count','average_thumb'])
    })
    .catch(function(err){
      throw err;
    })
  })
})

describe('Thumbroll', function(){
  it('should return today\'s lessons information', function(){
    return chai.request(server)
    .get('/teachers/1/lessons/today')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.be.an('object');
      expect(Object.keys(res.body[0])).to.deep.equal(['class_id', 'class_name', 'id', 'name', 'date'])
    })
    .catch(function(err){
      throw err;
    })
  })
})
