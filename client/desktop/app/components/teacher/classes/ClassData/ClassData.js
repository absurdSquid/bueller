import React from 'react';
import {Route, RouteHandler, Router, Link} from 'react-router';
import LessonData from './LessonData';
import StudentData from './StudentData';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import api from '../../../../utils/api';
require('react-datepicker/dist/react-datepicker.css');
require('d3');
d3.tip = require('d3-tip');
import {Button, Card, Row, Col} from 'react-materialize';


class ClassData extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      className : '',
      classId: this.props.params.classId,
      classLessons: [],
      classStudents: [],
      studentPolls: [],
      lessonPolls: [],
      
      displayLessons: true,
      displayStudents: false,
      newLessonName: '',
      newLessonDate: moment(),
      
      newStudent: '',
      studentError: '',

    };
  }

  render(){
    return (
      <div>

        <h2 className='sectionHeading classDataHeading' style={{color: '#424242'}} >{this.state.className}</h2>
        
        <Row className='dataRow'>
          <Col s={2} l={4}>
          &nbsp;
          </Col>
          <Col s={6} l={4}>
            <ul className="tabs">

              <li className='tab col s1 active center-align' onClick={this.switchToLessonsView.bind(this)} 
                style={{cursor: 'default'}}
                style={this.state.displayLessons ? {backgroundColor:'#01579b'} : {backgroundColor:'#fafafa', color: '#424242', cursor:'default'}}
                ><span className='pointer'>Lessons</span></li>
              <li className='tab col s1 center-align' 
                onClick={this.switchToStudentsView.bind(this)} 
                style={{cursor: 'default'}} 
                style={!this.state.displayLessons ? {backgroundColor:'#01579b'} : {backgroundColor:'#fafafa', color: '#424242', cursor:'default'}}>
                <span className='pointer'>Students</span>
              </li>
            </ul>
          </Col>
          <Col s={4} l={4}>
          </Col>
        </Row>
        
        <Lessons 
          newLessonDate={this.state.newLessonDate}
          newLessonName={this.state.newLessonName} 
          addLesson={this.addLesson.bind(this)}
          handleLessonClick={this.handleLessonClick.bind(this)}
          changeNewLessonName={this.changeNewLessonName.bind(this)}
          changeDate={this.changeDate.bind(this)} 
          lessons={this.state.classLessons} 
          display={this.state.displayLessons}
          classId={this.state.classId}/>

        <Students 
          students={this.state.classStudents} 
          display={this.state.displayStudents} 
          classId={this.state.classId}
          handleStudentClick={this.handleStudentClick.bind(this)}
          addStudent={this.addStudent.bind(this)}
          newStudent={this.state.newStudent}
          changeNewStudent={this.changeNewStudent.bind(this)}
          >
          <StudentError studentError={this.state.studentError}/>
        </Students>

      </div>
    )
  }

  componentWillMount(){
    api.getClassName(this.state.classId)
    .then((response) => {
      if(response.status === 200) {
        response.json().then((response) => {
          this.setState({
            className: response.name
          });
          api.getClassLessonsData(this.state.classId)
          .then((response) => {
            if(response.status === 400){
              this.setState({
                 error: 'Data forbidden',
                 isLoading: false
               });
              console.error(this.state.error);
            } else if (response.status === 200) {
              response.json().then((response) => {
               console.log("Class lessons from DB:", response);   
                this.setState({
                  classLessons: response,
                  error: false,
                  isLoading: false
                });
              });
            }
          });
        });
      }
    })
  }

  changeDate(newDate){
    this.setState({
      newLessonDate: newDate
    });
  }

  changeNewLessonName(lesson){
    this.setState({
      newLessonName: lesson,
    })
  }

  switchToStudentsView() {
    this.setState({
      displayStudents: true,
      displayLessons: false,
      isLoading: true,
    });
    api.getClassStudentsData(this.state.classId)
    .then((response) => {
      if(response.status === 400){
        this.setState({
           error: 'Data forbidden',
           isLoading: false
         });
        console.error(this.state.error);
      } else if (response.status === 200) {
        response.json().then((response) => {
         console.log("Class students from DB:", response);   
          this.setState({
            classStudents: response,
            error: false,
            isLoading: false
          });
        });
      }
    });
  }

  switchToLessonsView() {
    this.setState({
      displayStudents: false,
      displayLessons: true,
      isLoading: true,
    });
    api.getClassLessonsData(this.state.classId)
    .then((response) => {
      if(response.status === 400){
        this.setState({
           error: 'Data forbidden',
           isLoading: false
         });
        console.error(this.state.error);
      } else if (response.status === 200) {
        response.json().then((response) => {
         console.log("Class lessons from DB:", response);   
          this.setState({
            classLessons: response,
            error: false,
            isLoading: false
          });
        });
      }
    });
  }

  handleLessonClick(lessonId, lessonName, lessonDate) {
    this.context.router.push({
      pathname: '/class/' + this.state.classId + '/lessons/' + lessonId,
      state: { 
        className: this.state.className,
        lessonId: lessonId,
        classId: this.state.classId,
        lessonName: lessonName,
        lessonDate: lessonDate
      }
    });
  }

  handleStudentClick(studentId, firstName, lastName) {
    this.context.router.push({
      pathname: '/class/' + this.state.classId + '/students/' + studentId,
      state: { 
        className: this.state.className,
        classId: this.state.classId,
        studentId: studentId,
        firstName: firstName,
        lastName: lastName
      }
    });
  }

  addLesson(e){
    e.preventDefault();
    // update state with new list item
    if(!!this.state.newLessonName.trim()){
      var newLessonName = this.state.newLessonName.trim();
      var lessonsCopy = this.state.classLessons.slice();
      var newLessonDate = this.state.newLessonDate;

      // TODO: push to DB, return lesson object and push it to lessonsCopy
      // on a .then()

      api.addLesson(this.state.classId, newLessonName, newLessonDate)
      .then((response) => {
        if(response.status === 500){
          this.setState({
             error: 'Lesson could not be added',
             isLoading: false
           });
          console.log(this.state.error);
        } else if (response.status === 200) {
          response.json().then((response) => {
           console.log("ADDED LESSON = ", response);   
           lessonsCopy.push(response);

            this.setState({
              newLessonName: '',
              error: false,
              isLoading: false,
            });
          });

          // Fetch new class data
          api.getClassLessonsData(this.state.classId)
          .then((response) => {
            if(response.status === 400){
              this.setState({
                 error: 'Data forbidden',
                 isLoading: false
               });
              console.error(this.state.error);
            } else if (response.status === 200) {
              response.json().then((response) => {
               console.log("Class lessons from DB:", response);   
                this.setState({
                  classLessons: response,
                  error: false,
                  isLoading: false
                });
              });
            }
          });
        }
      });
      
      this.setState({
        lessons: lessonsCopy,
        newLessonName: ''
      });
    }
  }

  changeNewStudent(student){
    this.setState({
      newStudent: student,
    })
  }

  addStudent(e){
    e.preventDefault();
    
    // If there is newStudent data in state, call API
    if(!!this.state.newStudent.trim()){
      var newStudentEmail = this.state.newStudent.trim();

      // push to DB, return student object and push it to studentsCopy
      api.addStudentToClass(this.state.classId, newStudentEmail)
      .then((response) => {
        if(response.status === 400){
          this.setState({
             studentError: 'Student not found',
             isLoading: false
           });
          console.log(this.state.studentError);
        } else if (response.status === 200) {
          response.json().then((response) => {
           console.log('STUDENT WAS CREATED: ' + response.created)
           if (response.created === false){
             this.setState({
               studentError: "Student already enrolled in this class"
             });
             console.log(this.state.studentError);
           } else {
             console.log("ADDED STUDENT = ", response);  
             var studentsCopy = this.state.classStudents.slice();
             studentsCopy.push(response);
              this.setState({
                newStudent: '',
                studentError: false,
                isLoading: false
              });

              // Fetch student stats again
              api.getClassStudentsData(this.state.classId)
              .then((response) => {
                if(response.status === 400){
                  this.setState({
                     error: 'Data forbidden',
                     isLoading: false
                   });
                  console.error(this.state.error);
                } else if (response.status === 200) {
                  response.json().then((response) => {
                   console.log("Class students from DB:", response);   
                    this.setState({
                      classStudents: response,
                      error: false,
                      isLoading: false
                    });
                  });
                }
              });
            }
          });
        } else if (response.status === 500) {
          console.log("SERVER ERROR: FAILED TO ADD STUDENT");   
          this.setState({
            studentError: "Failed to add student",
            isLoading: false
          });
        }
      });
    }
  }
}

const Students = (props) => {
  if(props.display) {
    return (
      <div className='dataTable'>
        <StudentTable students={props.students} handleStudentClick={props.handleStudentClick} />
        <div className='addNew'>
          <h5 className='sectionHeading' >Add Student</h5>
          <div>
            <form onSubmit={props.addStudent}>
              <input type='text' style={{minWidth: '20em'}} placeholder='Student Email' value={props.newStudent} onChange={(event) => {
                props.changeNewStudent(event.target.value);
              }} />
              
              <div>
                <button style={{marginLeft:'0', fontSize: '1em'}} type='submit'>Add</button>
              </div>
            </form>
            {props.children}
          </div>
        </div>
        <StudentChart students={props.students} />
      </div>
    )
  } else {
    return (<div></div>);
  }
}

const StudentError = (props) => {
  if (props.studentError) {
    return (<div> {props.studentError} </div>)
  } else {
    return (<div></div>)
  }
}

const Lessons = (props) => {
  if(props.display) {
    return (
      <div className='dataTable'>
        <LessonTable lessons={props.lessons} handleLessonClick={props.handleLessonClick} />
        <div className='addNew'>
          <h5 className='sectionHeading' >Add Lesson</h5>
          <div>
            <form onSubmit={props.addLesson}>
              <input placeholder='Lesson Name' style={{maxWidth: '200px'}} type='text' value={props.newLessonName} onChange={(event) => {
                props.changeNewLessonName(event.target.value);
              }} />
                <DatePicker minDate={moment()} selected={props.newLessonDate} onChange={(date) => {
                  props.changeDate(date);
                }} />
                <button style={{fontSize: '1em'}} type='submit'>Add</button>
            </form>
          </div>
        </div>
        <LessonChart lessons={props.lessons} />
      </div>
    )
  } else {
    return (<div></div>)
  }
}

const LessonTable = (props) => {
  return (
    <div className='tableContainer'>
      <table className='highlight'>
        <thead>
          <tr>
            <th> Lesson </th>
            <th> Date </th>
            <th> Attendance </th>
            <th> Count of Polls </th>
            <th> M.C. Accuracy </th>
            <th> Average Thumb </th>
          </tr>
        </thead>
        <tbody>
        {props.lessons.map((lesson) => {
          var correctRate = (lesson.correct_response_count || 0) / lesson.potential_correct_responses_count * 100;
          var date = new Date(lesson.date).toLocaleDateString();
          return (
            <tr style={{cursor: 'pointer'}} key={'L' + lesson.lesson_id} 
              onClick={props.handleLessonClick.bind(null, lesson.lesson_id, lesson.lesson_name, lesson.date)}>
              <td> {lesson.lesson_name} </td>
              <td> {date} </td>
              <td> {lesson.student_count || 0} </td>
              <td> {lesson.poll_count || 0} </td>
              <td> {!isNaN(correctRate) ? correctRate.toFixed(2) + '%' : 'N/A'} </td>
              <td> {lesson.average_thumb ? lesson.average_thumb.toFixed(2) + '%' : 'N/A'} </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
  )
}

class LessonChart extends React.Component { 
  constructor(props) {
    super(props);
    this.width = 700;
    this.height = 300;
    this.xOffset = 50;
    this.yOffset = 50;
    this.state = {
      displayThumbs: true,
      displayAttendance: false,
      displayAccuracy: false,
    };
  }

  componentDidMount() {
    //Helpers
    var xOffset = this.xOffset;
    var yOffset = this.yOffset

    //Render axes
    this.yAxisScale = d3.scale.linear()
      .domain([0,100])
      .range([this.height - yOffset, yOffset]);
    this.yAxis = d3.svg.axis()
      .scale(this.yAxisScale)
      .orient('left');
    var yAxisGroup = d3.select('svg').append('g')
      .attr('class', 'axis yaxis')
      .attr('transform', 'translate(' + xOffset + ', 0)')
      .call(this.yAxis);

    d3.select('svg').append('line')
      .attr('class', 'axis')
      .attr('x1', xOffset).attr('y1', this.height - yOffset)
      .attr('x2', this.width - xOffset).attr('y2', this.height - yOffset)

    //Render axis labels
    d3.select('svg').append('text')
      .attr('class', 'xAxisLabel axisLabel')
      .attr('text-anchor', 'end')
      .attr('y', 6)
      .attr('x', -this.height / 2 + yOffset + 20)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Average Thumb Poll (%)'); 

    d3.select('svg').append('text')
      .attr('class', 'axisLabel')
      .attr('text-anchor', 'end')
      .attr('y', this.height - 30)
      .attr('x', this.width / 2 + xOffset)
      .attr('dy', '.75em')
      .text('Lessons');

    //Add tooltip to svg
    this.tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
      var correctRate = (d.correct_response_count || 0) / d.potential_correct_responses_count * 100;
      var avgThumb = d.average_thumb;
      correctRate = d.potential_correct_responses_count ? correctRate.toFixed(1) + '%' : 'N/A';
      avgThumb = avgThumb ? avgThumb.toFixed(1) + '%' : 'N/A';
      return d.lesson_name + '<br/>' +
        'Avg Thumb: ' + avgThumb + '<br/>' +
        'Attendance: ' + d.student_count + '<br/>' + 
        'Accuracy Rate: ' + correctRate;
    });
    d3.select('svg').call(this.tip);
  }

  componentWillUpdate(nextProps, nextState) {
    //Helpers
    var xOffset = this.xOffset;
    var yOffset = this.yOffset;
    var barWidth = Math.floor((this.width - 2 * xOffset) / nextProps.lessons.length);

    var mapToChart = function(percent) {
      return (100 - percent) / 100 * (this.height - 2 * yOffset) + yOffset;
    }.bind(this);

    //Remove existing axis label
    d3.select('svg')
      .selectAll('.xAxisLabel')
      .remove();

    //Add new axis label depending on state
    d3.select('svg').append('text')
      .attr('class', 'xAxisLabel axisLabel')
      .attr('text-anchor', 'end')
      .attr('y', 6)
      .attr('x', -this.height / 2 + yOffset + 20)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text(function(d) {
        if(nextState.displayThumbs) {
          return 'Average Thumb Poll (%)'
        } else if (nextState.displayAccuracy) {
          return 'Accuracy (%)'
        } else if (nextState.displayAttendance) {
          return 'Attendance'
        }
      }.bind(this));

    //Scale axis depending on state

    //Set functions for height and y based on state
    var heightFunc;
    var yFunc;
    if(nextState.displayThumbs) {
      heightFunc = function(d) {
        var avgThumb = d.average_thumb || 1;
        return mapToChart(100 - avgThumb) - yOffset;
      };
      yFunc = function(d) {
        var avgThumb = d.average_thumb || 1;
        return mapToChart(avgThumb); 
      };
      this.yAxisScale.domain([0, 100])

    } else if(nextState.displayAccuracy) {
      heightFunc = function(d) {
        var correctRate = (d.correct_response_count || 0) / d.potential_correct_responses_count * 100;
        correctRate = correctRate ? correctRate : 1;
        return mapToChart(100 - correctRate) - yOffset;
      };
      yFunc = function(d) {
        var correctRate = (d.correct_response_count || 0) / d.potential_correct_responses_count * 100;
        correctRate = correctRate ? correctRate : 1;
        return mapToChart(correctRate); 
      }; 
      this.yAxisScale.domain([0, 100])

    } else if(nextState.displayAttendance) {
      var max = Math.max.apply(null, nextProps.lessons.map(function(lesson) {
        return lesson.student_count;
      }));
      var ceil = Math.ceil(max / 10) * 10;
      mapToChart = function(percent) {
        return (ceil - percent) / ceil * (this.height - 2 * yOffset) + yOffset;
      }.bind(this);  
      
      heightFunc = function(d) {
        var attendance = d.student_count;
        // attendance = Number(attendance) ? attendance : 1;
        return mapToChart(ceil - attendance) - yOffset;
      };
      yFunc = function(d) {
        var attendance = d.student_count;
        // attendance = Number(attendance) ? attendance : 1;
        return mapToChart(attendance); 
      };
      this.yAxisScale.domain([0, ceil])
    }

    //Adjust height of axis:
    d3.select('svg').select('.yaxis')
        .transition().duration(500)
        .call(this.yAxis);

    //Adjust height and width on existing lessons
    d3.select('svg').selectAll('.lessonChartBar')
      .data(nextProps.lessons, function(d) {
        return d.lesson_id;
      })
      .transition()
      .duration(500)
      .attr('x', function(d, i) {
        return 10 + xOffset + i * barWidth;
      })
      .attr('y', yFunc)
      .attr('width', barWidth - 20)
      .attr('height', heightFunc);

    //Render new lessons
    d3.select('svg').selectAll('.lessonChartBar')
      .data(nextProps.lessons, function(d) {
        return d.lesson_id;
      })
      .enter()
      .append('rect')
      .attr('class', 'lessonChartBar')
      .attr('x', function(d, i) {
        return 10 + xOffset + i * barWidth;
      })
      .attr('y', yFunc)
      .attr('width', barWidth - 20)
      .attr('height', heightFunc)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide);
  }

  render(){
    return (
      <div className='chartContainer center-align' style={{padding:'10px'}}>
        <svg width={this.width} height={this.height} />
        <div>
          <Row className='dataRow'>
            <Col s={2} l={4}>
            &nbsp;
            </Col>
            <Col s={6} l={4}>
              <ul className="tabs">

                <li className='tab col s1 active center-align' 
                  onClick={() => {this.setState({displayAccuracy: false, displayThumbs: true, displayAttendance: false})}} 
                  style={{cursor: 'default'}}
                  style={this.state.displayThumbs ? {backgroundColor:'#01579b'} : {backgroundColor:'#fafafa', color: '#424242', cursor:'default'}}
                  ><span className='pointer'>Thumbs</span></li>
                <li className='tab col s1 center-align' 
                  onClick={() => {this.setState({displayAccuracy: true, displayThumbs: false, displayAttendance: false})}} 
                  style={{cursor: 'default'}} 
                  style={this.state.displayAccuracy ? {backgroundColor:'#01579b'} : {backgroundColor:'#fafafa', color: '#424242', cursor:'default'}}>
                  <span className='pointer'>Accuracy</span>
                </li>
                <li className='tab col s1 center-align' 
                  onClick={() => {this.setState({displayAccuracy: false, displayThumbs: false, displayAttendance: true})}} 
                  style={{cursor: 'default'}} 
                  style={this.state.displayAttendance ? {backgroundColor:'#01579b'} : {backgroundColor:'#fafafa', color: '#424242', cursor:'default'}}>
                  <span className='pointer'>Attendance</span>
                </li>

              </ul>
            </Col>
            <Col s={4} l={4}>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

const StudentTable = (props) => {
  return (
    <div className='tableContainer'>
      <table className='highlight'>
        <thead style={{maxWidth:'10em'}}>
          <tr>
            <th> Name </th>
            <th> Lessons Attended </th>
            <th> Response Rate </th>
            <th> M.C. Accuracy </th>
            <th> Average Thumb </th>
          </tr>
        </thead>
        <tbody>
        {props.students.map((student) => {
          var responseRate = (student.response_count || 0) / student.potential_response_count * 100;
          var correctRate = (student.correct_response_count || 0) / student.potential_correct_response_count * 100;
          return (
            <tr style={{cursor: 'pointer'}} onClick={props.handleStudentClick.bind(null, student.student_id, student.first_name, student.last_name)}
              key={'S' + student.student_id}>
              <td> {student.first_name + ' ' + student.last_name} </td>
              <td> {student.lesson_count ? student.lesson_count : 0} </td>
              <td> {!isNaN(responseRate) ? responseRate.toFixed(2) + '%' : 'N/A'} </td>
              <td> {!isNaN(correctRate) ? correctRate.toFixed(2) + '%' : 'N/A'} </td>
              <td> {student.average_thumb ? student.average_thumb.toFixed(2) + '%' : 'N/A' } </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
  )
}


class StudentChart extends React.Component { 
  constructor(props) {
    super(props);
    this.width = 500;
    this.height = 500;
  }

  componentWillReceiveProps(props) {
    //add axes
    var xOffset = 50;
    var yOffset = 50;

    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
      var responseRate = (d.response_count || 0) / d.potential_response_count * 100;
      var correctRate = (d.correct_response_count || 0) / d.potential_correct_response_count * 100;
      var avgThumb = d.average_thumb;
      responseRate = d.potential_response_count ? responseRate.toFixed(1) + '%' : 'N/A';
      correctRate = d.potential_correct_response_count ? correctRate.toFixed(1) + '%' : 'N/A';
      avgThumb = avgThumb ? avgThumb.toFixed(1) + '%' : 'N/A';
      return d.first_name + ' ' + d.last_name + '<br/>' +
        'Avg Thumb: ' + avgThumb + '<br/>' +
        'Response Rate: ' + responseRate + '<br/>' + 
        'Accuracy Rate: ' + correctRate;
    });
    d3.select('svg').call(tip);

    var mapToChart = function(percent, xOrY) {
      if(xOrY == 'y') {
        return (100 - percent) / 100 * (this.height - 2 * yOffset) + yOffset;
      } else {
        return percent / 100 * (this.width - 2 * xOffset) + xOffset;
      }
    }.bind(this);

    var xAxisScale = d3.scale.linear()
      .domain([0,100])
      .range([xOffset, this.width - xOffset]);
    var yAxisScale = d3.scale.linear()
      .domain([0,100])
      .range([this.height - yOffset, yOffset]);
    var xAxis = d3.svg.axis()
      .scale(xAxisScale)
      .orient('bottom');
    var yAxis = d3.svg.axis()
      .scale(yAxisScale)
      .orient('left');

    //render students
    d3.select('svg').selectAll('.studentChartNode')
      .data(props.students)
      .enter()
      .append('circle')
      .attr('class', 'studentChartNode')
      .attr('r', function(d) {
        return d.average_thumb / 5 + 5 || 5;
      })
      .attr('cx', function(d) {
        var responseRate = (d.response_count || 0) / d.potential_response_count * 100;
        responseRate = responseRate || 0;
        return mapToChart(responseRate, '`x');
      })
      .attr('cy', function(d) {
        var correctRate = (d.correct_response_count || 0) / d.potential_correct_response_count * 100;
        correctRate = correctRate || 0;
        return mapToChart(correctRate, 'y');
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    //Render axes
    var xAxisGroup = d3.select('svg').append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate( 0,' + (this.height - yOffset) + ')')
      .call(xAxis);
    var yAxisGroup = d3.select('svg').append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + xOffset + ', 0)')
      .call(yAxis);

    //Render axis labels
    d3.select('svg').append('text')
      .attr('class', 'axisLabel')
      .attr('text-anchor', 'end')
      .attr('x', this.width / 2 + xOffset)
      .attr('y', this.height - 10)
      .text('Response Rate (%)');

    d3.select('svg').append('text')
      .attr('class', 'axisLabel')
      .attr('text-anchor', 'end')
      .attr('y', 6)
      .attr('x', -this.height / 2 + 10)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Accuracy Rate (%)');
    
  }

  render(){
    return (
      <div className='chartContainer center-align' style={{padding:'10px'}}>
        <svg width={this.width} height={this.height}>
        </svg>
      </div>
    )
  }
}


ClassData.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = ClassData;