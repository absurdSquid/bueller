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
      //classes: this.props.route.classes
      lessons: this.props.route.lessons,
      socket: this.props.route.socket,
      classId: this.props.route.classId,
    };
  }

  selectLesson(lessonId) {
    
    this.props.navigator.push({
      component: RequestFeedbackView,
      classId: this.state.classId,
      lessonId: lessonId,
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromRight,
        gestures: {}
      }
    });
  }

  addLesson(){
    api.addLesson()
    .then((response) => {
      if(response.status === 500){
        console.error('err getting from data')
      } else if(response.status === 200){
        var lessonId = JSON.parse(response._bodyText).lessonId;
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
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <View>
          <NavBar navi={this.props.navigator} onBack={this.previousSection.bind(this)}>Your Lessons</NavBar>
        </View>
        <View style={styles.viewContainer}>
          <ScrollView>
            <View style={styles.buttonsContainer}>
              {this.renderLessons(this.state.lessons)}
              <Button onPress={this.addLesson.bind(this)} style={styles.button} text={'Add Lesson'} />
            </View>
          </ScrollView>
        </View>
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
