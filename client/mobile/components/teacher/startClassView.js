var React = require('react-native');
var SelectLessonView = require('./selectLessonView');
var RequestFeedbackView = require('./requestFeedbackView');
var api = require('./../../utils/api');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');
require('./../../utils/userAgent');
var io =require('socket.io-client/socket.io');
var env = require('./../../utils/environment');
var TeacherQCModal = require('./teacherQCModal');

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
  ListView,
  StatusBar
} = React;

class StartClassView extends React.Component {
  constructor(props) {
    var {height, width} = Dimensions.get('window');
    super(props);
    this.state = {
      classes: [],
      height: height,
      width: width,
      randomId: '',
      teacher: this.props.route.user,
      socket: undefined,
      classCode: '',
      modalVisible: false,
      activeStudents: {}
    };
  }

  componentWillMount(){
    var teacher = this.state.teacher;
    var that = this;
    api.getClasses(teacher.uid)
    .then(function(resp){
      if(resp.status === 500) {
        console.error('Error for getting class data')
      } else if(resp.status === 200) {
        var classes = JSON.parse(resp._bodyInit);
        that.setState({
          classes: classes,
        })
      }
    })
    .catch(function(err){
      console.error(err);
    })
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
      getActiveStudents: this.getActiveStudents.bind(this),
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.HorizontalSwipeJump,
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
            ...Navigator.SceneConfigs.HorizontalSwipeJump,
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
        <StatusBar
            barStyle='light-content'
          />
        <NavBar navi={this.props.navigator}>Your Classes</NavBar>
        <View style={styles.viewTopContainer}>
          <View>
            <ScrollView>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button onPress={this.selectQuickClass.bind(this)} text={'Start Quick Class'} />
                {this.renderClasses(this.state.classes)}
              </View>
            </ScrollView>
          </View>
        </View>

        <TeacherQCModal visible={this.state.modalVisible} onEnter={this.navigateFromModal.bind(this)}
          randomId={this.state.randomId}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewTopContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',  
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textSize: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  codeSize: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

module.exports = StartClassView;
