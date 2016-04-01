var React = require('react-native');
var ClassStandbyView = require('./classStandbyView.js');
require('./../../utils/userAgent');
var io =require('socket.io-client/socket.io');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');
var env = require('./../../utils/environment');
var api = require('./../../utils/api');
var StudentQCModal = require('./studentQCModal');

var server = env.server + ':' + env.port;

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Navigator,
  ScrollView,
  StatusBar
} = React;


class JoinClassView extends React.Component {
  constructor(props){
    super(props);
    var {height, width} = Dimensions.get('window');
    this.state = {
      enrolledClasses: [],
      user: this.props.route.user,
      secretCode: '',
      height: height,
      width: width,
      modalVisible: false
    }
  }

  componentWillMount() {
    var userId = this.state.user.uid;
    var that =  this;
    api.getStudentClasses(userId)
    .then(function(resp){
      if(resp.status === 500) {
        console.error('Error for getting class data')
      } else if(resp.status === 200) {
        var classes = JSON.parse(resp._bodyInit);
        that.setState({
          enrolledClasses: classes,
        })
      }
    })
    .catch(function(err){
      console.error(err);
    })
  }

  selectedClass(cls) {
    //perhaps pass class as part of url to socket
    this.socket = io(server, {jsonp: false});
    this.socket.emit('studentConnect', {user: this.state.user, classId: cls.class.id});

    this.props.navigator.push({
      component: ClassStandbyView,
      class: cls,
      user: this.state.user,
      socket: this.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.HorizontalSwipeJump,
        gestures: {}
      }
    });
  }

  selectQuickClass() {
    this.setState({
      modalVisible: true
    })
  }

  handleCodeChange(event) {
    this.setState({
      secretCode: event.nativeEvent.text
    });
  }

  handleModalSubmit(secretCode) {
    var classCode = 'qc' + secretCode;
    this.setState({
      modalVisible: false
    });
    //assuming code is valid:
    this.socket = io(server, {jsonp: false});
    this.socket.emit('studentQuickClassConnect', {user: this.state.user, classId: classCode});
    this.setState({
      secretCode: ''
    });
    var classObj = {
      id: classCode,
      name: 'Quick Class: ' + classCode 
    };
    this.props.navigator.push({
      component: ClassStandbyView,
      class: classObj,
      user: this.state.user,
      socket: this.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.HorizontalSwipeJump,
        gestures: {}
      }
    });
  }

  handleModalCancel() {
    this.setState({
      secretCode: '',
      modalVisible: false,
    });
  }

  eachClasses(classes){
    return classes.map((cls, index) => {
      return (
        <View key={index}>
          <Button onPress={this.selectedClass.bind(this, cls)} text={cls.class.name} />
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{flex:1}}>
      <StatusBar
          barStyle='light-content'
        />
        <NavBar navi={this.props.navigator}>Enrolled Classes</NavBar>
        <View style={styles.container}>
          <View>
            <ScrollView>
              <View style={styles.container}>
                <Button onPress={this.selectQuickClass.bind(this)} text={'Join Quick Class'}/>
                {this.eachClasses(this.state.enrolledClasses)}
              </View>
            </ScrollView>
          </View>
        </View>
        <StudentQCModal visible={this.state.modalVisible} onEnter={this.handleModalSubmit.bind(this)}
          onCancel={this.handleModalCancel.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',  
    justifyContent: 'center',
    backgroundColor: '#424242',
  },
  modalTextSize: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
})
module.exports = JoinClassView;