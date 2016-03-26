import React from 'react';
import api from './../utils/api';
import auth from './../utils/auth';
import {Button, Row, Col} from 'react-materialize';
import ReactDriveIn from "react-drive-in";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      isLoading: false,
      videoURL: 'https://s3-us-west-1.amazonaws.com/thumbroll/tester.mp4'
    };
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }


  handleSubmit() {
    // Invoke controller to send POST request

    auth.login(this.state.username, this.state.password, (success) => {
      if(success) {
        this.setState({
          error: false,
          isLoading: false
        });
        // pass these to teacher dashboard component:
        // classes: body.teacher.classes,
        // userId: body.teacher.uid

        // Redirect to teacher dashboard
        // userId: body.teacher.uid
        // classes: body.teacher.classes,
        if(this.props.location.state) {
          var nextPage = this.props.location.state.nextPathName;
          this.context.router.replace(nextPage);
          return;
        }
        else {
          this.props.history.replace('/');
          return;
        }
      } else {
        this.setState({
          error: 'Username or password is incorrect',
          isLoading: false
        });
        console.log(this.state.error);
      }
      this.setState({
        isLoading: false,
        username: '',
        password: ''
      });
    });
  }

  render(){
    var showErr = this.state.error ? <div> {this.state.error} </div> : <div></div>;
    return (
      <div className='center-align'>
        
        <ReactDriveIn
          className ="backgroundVideo"
          show="https://s3-us-west-1.amazonaws.com/thumbroll/tester.mp4"
          poster="http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.jpg"
        />
        <Row>
          <Col s={6} l={12} >
          <h1 
            style={
            {
              color: '#03A9F4',
            }}>
              Thumbroll
          </h1>
          </Col>
        </Row>

        <Row>
        <Col s={6} l={12}>
          <h3 className='center-align'
          >Login</h3>
        </Col>
        </Row>

        <div className='valign'>
          <Row>
            <Col s={6} l={12}>
              <input style={{maxWidth: '10em'}} className='center-align'
              type="text" 
              placeholder="Username" 
              value={this.state.username} 
              onChange={this.handleUsernameChange.bind(this)} 
              />
            </Col>
          </Row>
          <Row>
            <Col s={6} l={12}>
              <input style={{maxWidth: '10em'}} className='center-align'
              type="password" 
              placeholder="Password" 
              value={this.state.password} 
              onChange={this.handlePasswordChange.bind(this)} 
              />
              </Col>
          </Row>
          <Row>
            <Col s={6} l={12}>
              <button className='center-align' onClick={this.handleSubmit.bind(this)}>
              Submit
              </button>
            </Col>
          </Row>
        </div>
        {showErr}
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = Login;