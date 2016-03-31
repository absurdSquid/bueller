import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import App from './components/app';
import Login from './components/login'
import Signup from './components/signup'
import Classes from './components/teacher/classes/Classes'
import Lessons from './components/teacher/classes/ClassData/ClassData'
import LessonsData from './components/teacher/classes/ClassData/LessonData'
import Students from './components/teacher/classes/ClassData/StudentData'
import Profile from './components/Profile'
import auth from './utils/auth.js'
require('./styles.css');

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component = {App}>
      <IndexRoute component = {Classes} onEnter={requireAuth} />
      <Route path='/profile' component={Profile} onEnter={requireAuth} />
      <Route path='class/:classId/lessons' component={Lessons} onEnter={requireAuth} />
      <Route path='class/:classId/lessons/:lessonId' component={LessonsData} onEnter={requireAuth} />
      <Route path='class/:classId/students/:studentId' component={Students} onEnter={requireAuth} />
    </Route>
    <Route path='login' component={Login} />
  </Router>
), document.getElementById("app"));

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({state:{nextPathName: nextState.location.pathname}, pathname:'/login'});
  }
}

