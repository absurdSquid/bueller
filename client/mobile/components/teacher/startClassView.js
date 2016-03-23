var React = require('react-native');
var SelectLessonView = require('./selectLessonView');
var RequestFeedbackView = require('./requestFeedbackView');
var api = require('./../../utils/api');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');
require('./../../utils/userAgent');
var io =require('socket.io-client/socket.io');
var env = require('./../../utils/environment');
var server = env.server + ':' + env.port;

var {
  View,
  Text,
  StyleSheet,
  Navigator,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  ListView
} = React;

class StartClassView extends React.Component {
  constructor(props) {
    var {height, width} = Dimensions.get('window');
    super(props);
    this.state = {
      classes: [{id: 1, name:'Quick Class'}, {id:2, name:'CS 101'}, {id:3, name: 'CS 201'}],
      height: height,
      width: width,
      randomId: '',
      socket: undefined,
      classCode: '',
      modalVisible: false,
      activeStudents: {}
    };
  }

  selectQuickClass() {
    // generate modal with randomID
    var randomId = '' + Math.floor(Math.random() * 10) 
      + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
    var classCode = 'qc' + randomId;

    this.socket = io(server, {jsonp: false});
    this.socket.emit('teacherQuickClassConnect' , {classId: classCode});
    this.setState({
      randomId: randomId,
      classCode: classCode, 
      modalVisible: true,
      socket: this.socket,
      activeStudents: {}
    });

    this.socket.on('studentJoinedRoom', function(data) {
      var userCount = data.userCount;
      var activeCopy = JSON.parse(JSON.stringify(this.state.activeStudents));
      var studentObj = {uid: data.user.uid, firstName: data.user.firstName, lastName: data.user.lastName};
      activeCopy[studentObj.uid] = studentObj;
      this.setState({
        activeStudents: activeCopy
      });
    }.bind(this));

    this.socket.on('studentLeftRoom', function(data) {
      var userCount = data.userCount;
      var activeCopy = JSON.parse(JSON.stringify(this.state.activeStudents));
      delete activeCopy[data.user.uid];
      this.setState({
        activeStudents: activeCopy
      });
    }.bind(this));
  }

  navigateFromModal() {
    this.setState({
      modalVisible: false
    });
    this.props.navigator.push({
      component: RequestFeedbackView,
      classId: this.state.classCode,
      lessonId: 'Quick Class',
      activeStudents: this.state.activeStudents,
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromRight,
        gestures: {}
      }
    });
  }

  getActiveStudents() {
    return this.state.activeStudents;
  }

  selectClass(classId) {
    api.getLessons(classId)
    .then((response) => {
      if(response.status === 500){
        console.error('err getting class data');
      } else if(response.status === 200) {
        var lessons = JSON.parse(response._bodyText);

        this.socket = io(server, {jsonp: false});
        this.setState({
          activeStudents: {}
        });
        this.socket.emit('teacherConnect' , {classId: classId});

        this.socket.on('studentJoinedRoom', function(data) {
          var userCount = data.userCount;
          var activeCopy = JSON.parse(JSON.stringify(this.state.activeStudents));
          var studentObj = {uid: data.user.uid, firstName: data.user.firstName, lastName: data.user.lastName};
          activeCopy[studentObj.uid] = studentObj;
          this.setState({
            activeStudents: activeCopy
          });
        }.bind(this));

        this.socket.on('studentLeftRoom', function(data) {
          var userCount = data.userCount;
          var activeCopy = JSON.parse(JSON.stringify(this.state.activeStudents));
          delete activeCopy[data.user.uid];
          this.setState({
            activeStudents: activeCopy
          });
        }.bind(this));
        
        this.props.navigator.push({
          component: SelectLessonView,
          classId: classId,
          lessons: lessons,
          getActiveStudents: this.getActiveStudents.bind(this),
          socket: this.socket,
          sceneConfig: {
            ...Navigator.SceneConfigs.FloatFromRight,
            gestures: {}
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  renderClasses(classes) {
    return classes.map((cls, index) => {
      return (
        <Button onPress={this.selectClass.bind(this, cls.id)} style={styles.button} text={cls.name} key={index  }/>
      )
    })
  }

  render() {
    return (
      <View style={{flex: 1}}> 
        <NavBar navi={this.props.navigator}>Your Classes</NavBar>
        <ScrollView>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={this.selectQuickClass.bind(this)} text={'Start Quick Class'} />
            {this.renderClasses(this.state.classes)}
          </View>
        </ScrollView>
        <Modal visible={this.state.modalVisible} transparent={true} animated={true}>
          <View style={styles.modal}>
            <View style={{height:this.state.height * 0.6, width:this.state.width * 0.8}}>
              <View style={styles.modalBox}>
                <Text> Your secret code is: </Text>
                <Text> {this.state.randomId} </Text>
                <TouchableHighlight onPress={this.navigateFromModal.bind(this)}>
                  <Text> Okay </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pageText: {
    fontSize: 20
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  buttonContainer: {
    margin: 20
  },
  button: {

  },
  buttonText: {
    fontSize: 20
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

module.exports = StartClassView;
