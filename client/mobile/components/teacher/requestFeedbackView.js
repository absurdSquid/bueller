var React = require('react-native');
var FeedbackView = require('./display_feedback/feedbackView');
var api = require('./../../utils/api');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');

var {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Alert,
  TextInput,
  Dimensions,
  Image,
} = React;

class RequestFeedbackView extends React.Component {
  constructor(props) {
    super(props);
    var {height, width} = Dimensions.get('window');
    this.state = {
      lessonId: this.props.route.lessonId,
      classId: this.props.route.classId,
      socket: this.props.route.socket,
      lesson: '',
      modal: false,
      modalQuestion: false,
      height: height,
      width: width,
      feedbackOptions: [
        {
          type: 'thumbs',
          name: 'Thumbs Check',
          /*options:{for preset answers?}*/
        },
        {
          type: 'multiChoice',
          name: 'Multiple Choice'
        }
      ],
      raisedHandList: [],
      raisedHandCount: 0,
      count: 0,
      questionLists:[],
      polls:[],
      pollModal: false,
    };
    //populate feedbackOptions with anything custom from lesson
    this.state.socket.on('studentRaisedHand', function(data){
      var raisedHandCount = this.state.raisedHandCount;
      var raisedHandList = this.state.raisedHandList.slice();
      if(raisedHandList.length === 0) {
        raisedHandCount += 1;
        if(data.user.firstName) {
          raisedHandList.unshift({id: data.user.uid, student: data.user.firstName + ' ' + data.user.lastName , active: true});    
        } else {
          raisedHandList.unshift({id: data.user.uid, student: data.user.uid, active: true});
        }
      } else {
        for(var i = 0; i < raisedHandList.length; i++){
          if(data.user.uid === raisedHandList[i].id && raisedHandList[i].active === false) {
            raisedHandCount += 1;
            raisedHandList[i].active = true;
          }
          if(raisedHandList.length < 5 && data.user.uid !== raisedHandList[i].id) {
            raisedHandCount += 1;
            if(data.user.firstName) {
              raisedHandList.unshift({id: data.user.uid, student: data.user.firstName + ' ' + data.user.lastName , active: true});    
            } else {
              raisedHandList.unshift({id: data.user.uid, student: data.user.uid, active: true});
            }
          } 
        }
      }
      this.setState({
        raisedHandList: raisedHandList,
        raisedHandCount: raisedHandCount,
      });
    }.bind(this))

    this.state.socket.on('studentQuestions', function(data){
      var questionLists = this.state.questionLists.slice();
      if(data.student.firstName) {
        var student = data.student.firstName + ' ' + data.student.lastName;
      } else {
        var student = data.student.uid
      }
      questionLists.push({question: data.question, student: student});
      this.setState({
        questionLists: questionLists,
      })
    }.bind(this))
  }

  componentWillMount(){
    var lesson = this.state.lessonId;
    if( lesson === 'Quick Class') {
      this.setState({
        lesson: 'Quick Class',
      })
    } else {
      var that = this;
      api.getCurrentLesson(lesson)
      .then(function(resp){
        if(resp.status === 500) {
          console.error('Error for getting lesson data')
        } else if(resp.status === 200) {
          var lessons = JSON.parse(resp._bodyInit);
          that.setState({
            lesson: lessons.name,
          })
        }
      })
      .catch(function(err){
        console.error(err);
      })
      api.getLessonPolls(lesson)
      .then(function(resp){
        if(resp.status === 500) {
          console.error('Error for getting poll data');
        } else if(resp.status === 200) {
          var polls = JSON.parse(resp._bodyInit).filter(function(polls) {
            return polls.sent === false
          });
          that.setState({
            polls: polls,
          })
        }
      })
    }
  }

  answeredQuestion() {
    var questionLists = this.state.questionLists.slice();
    questionLists.shift();
    this.setState({
      questionLists: questionLists,
    })
  }

  clickQuestion() {
    this.setState({
      modalQuestion: !this.state.modalQuestion,
    })
  }

  clickRaisedHand() {
    var count = this.state.count + 1;
    this.setState({
      modal: !this.state.modal,
      count: count,
      raisedHandCount: 0,
    })
    if(this.state.modal === false) {
      this.setState({
        count: 0,
      })
    }
  }

  dismissClass() {
    // emit socket dismissClass
    this.state.socket.emit('dismiss');
    // if quickClass, need to disconnect from socket
    if(this.state.lessonId = 'Quick Class') {
      this.state.socket.disconnect();
    }
    this.props.navigator.pop();
  }

  beforeLogout() {
    this.state.socket.emit('teacherLoggingOut');
  }

  listQuestion(list) {
    if( list.length === 0 ) {
      return(
        <Text>No questions asked</Text>
      )
    } 
    return (
      <View>
        <Text>From {list[0].student}:</Text>
        <Text style={{fontStyle: 'italic'}}>{list[0].question}</Text>
      </View>
    )
  }

  listStudent(list) {
    if(list.length === 0) {
      return (
        <Text>No hands raised</Text>
      )
    }
    return list.map((student, index) => {
      if(!this.state.modal && this.state.count > 0) {
        student.active = false
      }
      if(student.active){
        return (
          <View key={index}>
            <Text style={styles.studentName}>
              {student.student}
            </Text>
          </View>     
        )
      } else {
        return (
          <View key={index}>
            <Text style={styles.studentNameChange}>
              {student.student}
            </Text>
          </View>     
        )
      }
    })
  }

  clearList() {
    this.setState({
      raisedHandList: [],
      count: 0,
      raisedHandCount: 0,
    })
  }

  callOnStudent() {
    var studentsObj = this.props.route.getActiveStudents();
    var keys = Object.keys(studentsObj);
    var index = Math.floor(Math.random() * keys.length);
    var randomKey = keys[index];
    var student = studentsObj[randomKey];
    console.log('Calling on:', student);
    this.state.socket.emit('callOnStudent', student);
    if(!student || studentsObj === undefined) {
      Alert.alert('No student has yet signed in');
    } else {
      if(student.firstName) {
        Alert.alert('Selected', student.firstName + ' ' + student.lastName);
      } else {
        Alert.alert('Selected student', student.uid);
      }
    }
  }

  selectFeedbackOption(feedbackOption) {
    api.startPoll(feedbackOption, this.state.lessonId, this.state.classId)
    .then((response) => {
      if(response.status === 500) {
        console.error('Server error', response);
      } else if(response.status === 201) {
        var pollId = JSON.parse(response._bodyText).pollId;
        this.props.navigator.push({
          component: FeedbackView,
          lessonId: this.state.lessonId,
          pollId: pollId,
          feedbackOption: feedbackOption,
          socket: this.state.socket,
          sceneConfig: {
            ...Navigator.SceneConfigs.HorizontalSwipeJump,
            gestures: {}
          }
        });
      } else {
        console.error('Error getting poll data', response);
      }
      this.setState({
        pollModal: false
      })

    })
    .catch((err) => {
      console.error('Error starting poll', err);
    });
  }

  renderFeedbackOptions(feedbackOptions) {
    return feedbackOptions.map((feedbackOption, index) => {
      return (      
        <Button key={index} onPress={this.selectFeedbackOption.bind(this, feedbackOption)} text={feedbackOption.name} />
      )
    })
  }

  presetPoll() {
    this.setState({
      pollModal: !this.state.pollModal,
    })
  }

  listOfPoll (list) {
    return list.map((poll, index) => {
      return (
        <Button key={index} text={poll.name} onPress={this.selectFeedbackOption.bind(this, poll)}/>
      )
    })
  }

  previousSection() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <NavBar navi={this.props.navigator} beforeLogout={this.beforeLogout.bind(this)} 
          onBack={this.previousSection.bind(this)}>
          Request Feedback
        </NavBar>
        <View style={styles.viewContainer}>
          <Button onPress={this.dismissClass.bind(this)} text={'Dismiss Class'}/>
          {this.renderFeedbackOptions(this.state.feedbackOptions)}
          <Button onPress={this.callOnStudent.bind(this)} text={'Call On Student'}/>
          <Button onPress={this.presetPoll.bind(this)} text={'Preset Polls'} />
        </View>
        <View style={styles.studentResponse}>
          <TouchableOpacity onPress={this.clickQuestion.bind(this)} style={styles.questionBox}>
            <View style={styles.imageBox}>
              <Image source={require('../../image/question.png')}/>
              <Text style={styles.textSize}>
                : {this.state.questionLists.length}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.currentLessonBox, {width: this.state.width - 205}]}>
            <Text style={styles.currentLesson}>{this.state.lesson}</Text>
          </View>
          <TouchableOpacity onPress={this.clickRaisedHand.bind(this)} style={styles.raiseHandBox}>
            <View style={styles.imageBox}>
              <Image source={require('../../image/raiseHand.png')}/>
              <Text style={styles.textSize}>
                : {this.state.raisedHandCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>


        <Modal visible={this.state.modal} transparent={true} animated={true}>
          <View style={styles.modal}>
            <View style={{height:this.state.height * 0.8, width:this.state.width * 0.85}}>
              <View style={styles.modalBox}>
                <Text style={styles.textSizeModal}> Hands up </Text>
                {this.listStudent(this.state.raisedHandList)}
              </View>
              <Button onPress={this.clearList.bind(this)} text={'Clear list'}/>
              <Button onPress={this.clickRaisedHand.bind(this)} text={'Close'}/>
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.modalQuestion} transparent={true} animated={true}>
          <View style={styles.modal}>
            <View style={{height:this.state.height * 0.8, width:this.state.width * 0.85}}>
              <View style={styles.modalBox}>
                <Text style={styles.textSizeModal}> Questions </Text>
                {this.listQuestion(this.state.questionLists)}
              </View>
              <Button onPress={this.answeredQuestion.bind(this)} text={'Mark as answered'} />
              <Button onPress={this.clickQuestion.bind(this)} text={'Close'}/>
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.pollModal} transparent={true} animated={false}>
          <View style={styles.modal}>
            <View style={{height:this.state.height * 0.8, width:this.state.width * 0.85}}>
              <View style={styles.modalBox}>
                {this.listOfPoll(this.state.polls)}
              </View>
              <Button onPress={this.presetPoll.bind(this)} text={'Close'}/>
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
    backgroundColor: '#fafafa',
  },

  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  textSizeModal: {
    fontSize : 20,
    fontWeight: 'bold',
  },

  studentName: {
    fontSize: 35,
    fontWeight: 'bold',
  },

  studentNameChange:{
    fontSize: 35,
    fontWeight: 'bold',
    color: '#C6C7C3',
  },

  textSize: {
    fontSize : 25,
    fontWeight: 'bold',
    color: '#fafafa'
  },

  studentResponse: {
    flexDirection: 'row', 
    height:60, 
    width: null, 
    justifyContent: 'space-between',
  },

  questionBox: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor:'#01579b', 
    height: 60, 
    width: 100,
  },

  raiseHandBox: {
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor:'#01579b', 
    height: 60, 
    width: 100,
  },
  imageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLessonBox: {
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#01579b',
  },
  currentLesson: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#fafafa',
  },
});

module.exports = RequestFeedbackView;
