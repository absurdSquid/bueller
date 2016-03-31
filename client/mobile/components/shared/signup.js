var React = require('react-native');
var Login = require('./login');
var JoinClassView = require('./../student/joinClassView');
var StartClassView = require('./../teacher/startClassView');
var api = require('./../../utils/api');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Navigator,
  ScrollView
} = React;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmedPassword: '',
      accountType: this.props.route.accountType,
      isLoading: false,
      error: false,
      passwordError: false
    };
  }

  handleFirstNameChange(event) {
    this.setState({
      firstName: event.nativeEvent.text
    });
  }

  handleLastNameChange(event) {
    this.setState({
      lastName: event.nativeEvent.text
    });
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.nativeEvent.text
    });
  }

  handleEmailChange(event) {
    this.setState({
      email: event.nativeEvent.text
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.nativeEvent.text
    });
  }

  handleConfirmedPasswordChange(event) {
    this.setState({
      confirmedPassword: event.nativeEvent.text
    });
  }

  handleSubmit() {
    if (this.state.password === this.state.confirmedPassword) {
      this.setState({
        isLoading: true,
        passwordError: false
      });
      api.signup(this.state.firstName, this.state.lastName, this.state.username, 
        this.state.email, this.state.password, this.state.accountType)
      .then((response) => {
        if(response.status === 500){
          this.setState({
            error: 'User already exists',
            password: '',
            confirmedPassword: '',
            isLoading: false
          });
        } else if(response.status === 200) {
          //keychain stuff?
          var body = JSON.parse(response._bodyText);
          if(body.teacher) {
            this.props.navigator.push({
              component: StartClassView,
              classes: body.teacher.classes,
              user: body.teacher,
              sceneConfig: {
                ...Navigator.SceneConfigs.FloatFromBottom,
                gestures: {}
              }
            });
          } else if (body.student) {
            this.props.navigator.push({
              component: JoinClassView,
              classes: body.student.classes,
              user: body.student,
              sceneConfig: {
                ...Navigator.SceneConfigs.FloatFromBottom,
                gestures: {}
              }
            });
          }
        }
      })
      .catch((err) => {
        this.setState({
          error: 'User already exists' + err,
          isLoading: false
        });
      });
    } else {
      this.setState({
        isLoading: false,
        password: '',
        confirmedPassword: '',
        passwordError: 'passwords do not match'
      });
    }
  }

  handleRedirect() {
    this.props.navigator.pop();
  }

  render() {
    var showErr = (
      this.state.error ? <Text style={styles.err}> {this.state.error} </Text> : <View></View>
    );
    var showPasswordErr = (
      this.state.passwordError ? <Text style={styles.err}> {this.state.passwordError} </Text> : <View></View>
    );
    return (
      <ScrollView>
        <View style={{flex: 1, backgroundColor: 'white'}}> 
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                {this.state.accountType[0].toUpperCase() + this.state.accountType.slice(1) + ' Sign Up'}
              </Text>
            </View>
            <TextInput
              placeholder='First Name'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={16}
              style={styles.userInput}
              value={this.state.firstName}
              returnKeyType={'next'}
              onChange={this.handleFirstNameChange.bind(this)}
              onSubmitEditing={(event) => {
                this.refs.SecondInput.focus();
              }} 
            />
            <TextInput
              ref='SecondInput'
              placeholder='Last Name'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={16}
              style={styles.userInput}
              value={this.state.lastName}
              returnKeyType={'next'}
              onChange={this.handleLastNameChange.bind(this)}
              onSubmitEditing={(event) => {
                this.refs.ThirdInput.focus();
              }} 
            />
            <TextInput
              ref='ThirdInput'
              placeholder='Username'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={16}
              style={styles.userInput}
              value={this.state.username}
              returnKeyType={'next'}
              onChange={this.handleUsernameChange.bind(this)}
              onSubmitEditing={(event) => {
                this.refs.FourthInput.focus();
              }} 
            />
            <TextInput
              ref='FourthInput'
              placeholder='Email'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={25}
              style={styles.userInput}
              value={this.state.email}
              returnKeyType={'next'}
              onChange={this.handleEmailChange.bind(this)}
              onSubmitEditing={(event) => {
                this.refs.FifthInput.focus();
              }} 
            />
            <TextInput
              ref='FifthInput'
              placeholder='Password'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={16}
              secureTextEntry={true}
              style={styles.userInput}
              value={this.state.password}
              returnKeyType={'next'}
              onChange={this.handlePasswordChange.bind(this)}
              onSubmitEditing={(event) => {
                this.refs.SixthInput.focus();
              }} 
            />
            <TextInput
              ref='SixthInput'
              placeholder='Confirm Password'
              autoCapitalize={'none'}
              autoCorrect={false}
              maxLength={16}
              secureTextEntry={true}
              style={styles.userInput}
              value={this.state.confirmedPassword}
              returnKeyType={'go'}
              onSubmitEditing={this.handleSubmit.bind(this)}
              onChange={this.handleConfirmedPasswordChange.bind(this)} 
            />
           
            <TouchableHighlight
              style={styles.button}
              onPress={this.handleSubmit.bind(this)}
              underlayColor='#01579b'
            >
              <Text style={styles.buttonText}> Sign Up </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.handleRedirect.bind(this)}
              underlayColor='#ededed'
            >
              <Text style={styles.signin}> Already have an account? Sign in! </Text>
            </TouchableHighlight>
            <ActivityIndicatorIOS
              animating= {this.state.isLoading}
              size='large'
              style={styles.loading}
            />
            {showErr}
            {showPasswordErr}
          </View>
        </View>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerContainer: {
    justifyContent: 'center',
    marginBottom: 30
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center'
  },
  userInput: {
    height: 50,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#616161',
    borderRadius: 4,
    color: '#616161',
    margin: 10
  },
  picker: {
    bottom: 70,
    height: 70
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FF5A5F',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 30,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  signin: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center'
  },
  loading: {
    marginTop: 20
  },
  err: {
    fontSize: 14,
    textAlign: 'center'
  },
});

module.exports = Signup;