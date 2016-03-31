var React = require('react-native');
var RequestFeedbackView = require('./requestFeedbackView');
var api = require('./../../utils/api');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');

var {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  ScrollView,
  ListView
} = React;

class SelectLessonView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      socket: this.props.route.socket,
      classId: this.props.route.classId,
    };
  }

  componentWillMount(){
    var classId = this.state.classId;
    var that = this;
    api.getLessons(classId)
    .then(function(resp){
      if(resp.status === 500) {
        console.error('Error for getting lessons data')
      } else if(resp.status === 200) {
        var lessons = JSON.parse(resp._bodyInit);
        that.setState({
          lessons: lessons,
        })
      }
    })
    .catch(function(err){
      console.error(err);
    })
  }

  selectLesson(lessonId) {
    this.props.navigator.push({
      component: RequestFeedbackView,
      classId: this.state.classId,
      getActiveStudents: this.props.route.getActiveStudents,
      lessonId: lessonId,
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.HorizontalSwipeJump,
        gestures: {}
      }
    });
  }

  addLesson(classId){
    api.addLesson(classId)
    .then((response) => {
      if(response.status === 500){
        console.error('err getting from data')
      } else if(response.status === 200){
        console.log('lessonId >>>>>>>>>>>>>>>>', response)
        var lessonId = JSON.parse(response._bodyText).id;
        this.selectLesson(lessonId);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  renderLessons(lessons) {
    return lessons.map((lesson, index) => {
      return (
        <Button key={index} onPress={this.selectLesson.bind(this, lesson.id)} style={styles.button} text={lesson.name} />
      )
    })
  }

  previousSection() {
    this.state.socket.disconnect();
    this.props.navigator.pop();
  }

  beforeLogout() {
    this.state.socket.emit('teacherLoggingOut');
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <NavBar navi={this.props.navigator} onBack={this.previousSection.bind(this)} 
          beforeLogout={this.beforeLogout.bind(this)}>
          Your Lessons
        </NavBar>
        <View style={styles.viewContainer}>
          <View>
            <ScrollView>
              <View style={styles.buttonsContainer}>
                {this.renderLessons(this.state.lessons)}
                <Button onPress={this.addLesson.bind(this, this.state.classId)} style={styles.button} text={'Add Lesson'} />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',  
    backgroundColor: '#F5FCFF',
  },
  pageText: {
    fontSize: 20
  },
  buttonsContainer: {
    padding: 20
  },
  buttonContainer: {
    margin: 20
  },
  button: {

  },
  buttonText: {
    fontSize: 20
  }
});

module.exports = SelectLessonView;
