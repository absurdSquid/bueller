import React from 'react'
import ClassData from './ClassData/ClassData'
import {Route, RouteHandler, Link, Navigation} from 'react-router'
import api from '../../../utils/api';
import auth from '../../../utils/auth';
import {Button, Card, Row, Col} from 'react-materialize';


class Classes extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      uid: undefined,
      classes : [],
      lessons: [],
      newClassName : '',
      currentClass: '',
      currentStudent: '',
      loading: false
    };
  }

  render(){
    return (
      <div>
        <Row className='row'>
          <Col l={1}>
            &nbsp;
          </Col>
          <Col l={5}>
            <h2 className='sectionHeading'>Classes</h2>

            <div className='classList'>
              {this.state.classes.map((specificClass) => {
                return (<li className='classListItem' style={{cursor: 'default'}} key={"class:"+specificClass.id}>
                  <Link to={`class/${specificClass.id}/lessons`}>{specificClass.name}</Link>
                  </li>)
               })
              }
            </div>

            <div className='newClass'>
              <h5 className='sectionHeading' style={{minWidth: '200px'}}>Create Class</h5>
              <div>
                <form onSubmit={this.addClass.bind(this)}>
                  <input placeholder='Class Name' className='newClassForm' 
                  type='text' value={this.state.newClassName} maxLength={24}
                  onChange={(event) => {
                    this.setState({
                      newClassName: event.target.value
                    });
                  }} />
                  <div>
                    <button style={{fontSize: '1em'}} type='submit'>Add</button>
                  </div>
                </form>
              </div>
            </div>
        </Col>
        <Col l={5}>
            <LessonsToday handleLessonClick={this.handleLessonClick.bind(this)} lessons={this.state.lessons}/>
          <div>
            {this.props.children}
          </div>
        </Col>
      </Row>
    </div>

    );
  }

  addClass(e){
    e.preventDefault();
    // update state with new list item
    if(!!this.state.newClassName.trim()){
      this.setState({
        isLoading:true
      });
      api.addClass(this.state.uid, this.state.newClassName)
      .then((response) => {
        if(response.status == 200) {
          console.log('Successfully added new class:', this.state.newClassName);
          this.setState({
            isLoading:false,
            newClassName: ''
          });
          api.getClasses(this.state.uid)
          .then((response) => {
            if(response.status === 400){
              this.setState({
                 error: 'No classes found',
                 isLoading: false
               });
              console.error(this.state.error);
            } else if (response.status === 200) {
              response.json().then((response) => {
                console.log("RESPONSE = ", response);   
                this.setState({
                  classes: response,
                  error: false,
                  isLoading: false
                });
              });
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          loading:false,
          newClassName: ''
        });
      });      
    }

  }

  handleLessonClick(lessonId, lessonName, classId, className) {
    this.context.router.push({
      pathname: '/class/' + classId + '/lessons/' + lessonId,
      state: { 
        className: className,
        lessonId: lessonId,
        classId: classId,
        lessonName: lessonName
      }
    });
  }

  componentWillMount(){
    auth.checkForSession((user) => {
      if(!user) {
        this.transitionTo('/login');
        return;
      }
      user = user.split('_')[1];
      this.setState({
        uid: user
      });
      window.localStorage.userId = user;
      api.getClasses(this.state.uid)
      .then((response) => {
        if(response.status === 400){
          this.setState({
             error: 'No classes found',
             isLoading: false
           });
          console.error(this.state.error);
        } else if (response.status === 200) {
          response.json().then((response) => {
            console.log("RESPONSE = ", response);   
            this.setState({
              classes: response,
              error: false,
              isLoading: false
            });
          });
        }
        api.getTodaysLessons(this.state.uid)
        .then((response) => {
          if(response.status === 400) {
            console.error('Error getting todays lessons');
          } else if(response.status === 200) {
            response.json().then((response) => {
              this.setState({
                lessons: response
              });
            });
          }
        });
      });
    })
  }
}

const LessonsToday = (props) => {
  if(!props.lessons.length) {
    return (
      <div >
        <h2 className='sectionHeading'>Today's Lessons</h2>
        <p>There are no lessons today.</p>
      </div>
    )
  }
  return(
    <div>
      <h2 className='sectionHeading lessonsToday'>Today's Lessons</h2>
      <ul className='classList'>
        {props.lessons.map((lesson) => {
          return (
            <li className='classListItem' style={{cursor: 'pointer'}} key={'L' + lesson.id}>
              <span onClick={props.handleLessonClick.bind(null, lesson.id, lesson.name, lesson.class_id, lesson.class_name)}>
                {lesson.name}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Classes.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = Classes;