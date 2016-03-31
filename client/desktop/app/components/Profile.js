import React from 'react'
import {Route, RouteHandler, Link, Button} from 'react-router'

import api from './../utils/api'
import auth from './../utils/auth'

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      teacherData: {
        name: '',
        email: '',
        teacherId: ''
      }
    };
  }

  handleLogout() {
    auth.logout();
    this.context.router.push({
      pathname: '/login'
    });
  }

  render() {
    return(
      <div>
        <h2 className='sectionHeading'>Settings</h2>
        <div className='profile' style={{marginLeft: '20%'}}>
          
          <div >
            <span>Name: </span><span>{this.state.name}</span>
          </div>
          
          <div>
            <span>Email: </span><span>{this.state.email}</span>
          </div>
        </div>
        <button onClick={this.handleLogout.bind(this)} style={{marginLeft: '20%'}}>Logout</button>
      </div>
    )
  }

  componentWillMount() {
    this.state.teacherId = window.localStorage.userId;

    if(this.state.teacherId){
      api.getTeacherInfo(this.state.teacherId)
      .then((result) => {
        result = result.json().then((jsonRes) => {
          this.setState({
            name : jsonRes.firstname + ' ' + jsonRes.lastname,
            email : jsonRes.email,
          })
          console.log(jsonRes);
        });
      });
    }
    
  }

}

Profile.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = Profile;