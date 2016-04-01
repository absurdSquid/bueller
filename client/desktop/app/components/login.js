import React from 'react';
import api from './../utils/api';
import auth from './../utils/auth';
import {Button, Row, Col, Navbar, Footer} from 'react-materialize';
import ReactDriveIn from "react-drive-in";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      isLoading: false,
      videoURL: 'https://s3-us-west-1.amazonaws.com/thumbroll/IMG_4645.mp4'
    };
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  checkSubmit(e) {
    if (e && e.keyCode === 13) {
      console.log("SUBMIT CONDITION MET!")
      this.handleSubmit();
    }
  }

  handleSubmit(event) {
    // Invoke controller to send POST request
    event.preventDefault()
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
    var showErr = this.state.error ? <div className='error'> {this.state.error} </div> : <div></div>;
    return (
      <div>
      <div className='center-align'>
        <h1 style={{color: 'white'}} className='light-blue title'>
        Thumb<span className='titleCheck'>roll</span>
        </h1>
      <main>
        <ReactDriveIn
          className ="backgroundVideo"
          show="https://s3-us-west-1.amazonaws.com/thumbroll/IMG_4645.mp4"
          poster="http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.jpg"
        />

        <Row style={{marginTop:'2em', marginBottom:'4em'}}>
        <Col s={12} l={12}>
          <h2 style={{fontSize: '3em'}} className='center-align callToAction'
          >Login</h2>
        </Col>
        </Row>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className='valign'>
            <Row className='loginRow'>
              <Col s={12} l={12}>
                <input style={{fontSize: '3em'}} style={{maxWidth: '10em'}} className='center-align callToAction'
                type="text" 
                placeholder="Username" 
                value={this.state.username} 
                onChange={this.handleUsernameChange.bind(this)} 
                />
              
                <input style={{fontSize: '3em'}} style={{maxWidth: '10em'}} className='center-align callToAction'
                type="password" 
                placeholder="Password" 
                value={this.state.password} 
                onChange={this.handlePasswordChange.bind(this)} 
                />
                </Col>
            </Row>
            <Row className='loginRow'>
              <Col s={12} l={12}>
                <button type='submit' style={{fontSize: '2em'}} className='center-align loginButton' >
                Submit
                </button>
              </Col>
            </Row>
          </div>
        </form>
        {showErr}
        </main>
      </div>
        <div className='footer'>
          <footer className="page-footer light-blue">
            <div className="container">
              <Row className='loginRow'>
                <Col l={12} s={12}>
                  <h5 className="welcomeMessage white-text center-align">Your students, engaged at lightspeed.</h5>
                </Col>
              </Row>
            </div>
            <div className="footer-copyright">
              <div className="container left copywriter" style={{paddingLeft: '10px'}}>
              © 2016 Thumbroll
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.any.isRequired
};

module.exports = Login;