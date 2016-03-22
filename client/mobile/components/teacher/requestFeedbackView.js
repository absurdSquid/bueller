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
  TouchableOpacity
} = React;

class RequestFeedbackView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lessonId: this.props.route.lessonId,
      classId: this.props.route.classId,
      socket: this.props.route.socket,
      feedbackOptions: [
        {
          id: 1,
          name: 'Thumbs Check',
          /*options:{for preset answers?}*/
        },
        {
          id: 2,
          name: 'Multiple Choice'
        }
      ],
    };

    //populate feedbackOptions with anything custom from lesson
  }

  dismissClass() {
    // emit socket dismissClass
    this.state.socket.emit('dismiss');
    this.props.navigator.pop();
  }

  selectFeebackOption(feedbackOption) {
    api.startPoll(feedbackOption, this.state.lessonId, this.state.classId)
    .then((response) => {
      if(response.status === 500) {
        console.error('Server error', response);
      } else if(response.status === 201) {
        this.props.navigator.push({
          component: FeedbackView,
          lessonId: this.state.lessonId,
          feedbackOption: feedbackOption,
          socket: this.state.socket,
          sceneConfig: {
            ...Navigator.SceneConfigs.FloatFromRight,
            gestures: {}
          }
        });
      } else {
        console.error('Error getting poll data', response);
      }
    })
    .catch((err) => {
      console.error('Error starting poll', err);
    });
  }

  renderFeedbackOptions(feedbackOptions) {
    return feedbackOptions.map((feedbackOption, index) => {
      return (      
        <Button key={index} onPress={this.selectFeebackOption.bind(this, feedbackOption)} style={styles.button} text={feedbackOption.name} />
      )
    })
  }

  previousSection() {
    this.props.navigator.pop();
  }

  render() {
    //need end class / back button

    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <View>
          <NavBar navi={this.props.navigator} onBack={this.previousSection.bind(this)}>Request Feedback</NavBar>
        </View>
        <View style={styles.viewContainer}>
          <Button onPress={this.dismissClass.bind(this)} style={styles.dismissButton} text={'Dismiss Class'}/>
          {this.renderFeedbackOptions(this.state.feedbackOptions)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dismissContainer: {

  },
  dismissButton: {

  },
  dismissText: {

  },
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

module.exports = RequestFeedbackView;
