var React = require('react-native');
var Slider = require('react-native-slider');
var ThumbRoll = require('./thumbRoll');
var Button = require('./../../shared/button');
var NavBar = require('./../../shared/navbar');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
} = React;

class ThumbCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      pollInfo: this.props.route.pollInfo,
      socket: this.props.route.socket,
      user: this.props.route.user,
    }
    this.state.socket.on('closePoll', function(data) {
      this.state.socket.removeListener('closePoll');
      this.props.navigator.pop();
    }.bind(this));
  }

  submitResponse() {
    console.log('Student',this.state.userId,'answered',this.state.value,'to poll',this.state.pollInfo.pollId);
    this.state.socket.emit('studentResponse', {
      user: this.state.user,
      answer: this.state.value,
      pollId: this.state.pollInfo.pollId
    })
    this.state.socket.removeListener('closePoll');
    this.props.navigator.pop();
  }

  valueChange(value) {
    this.setState({value: Math.floor(value)})
  }
  
  onBack() {
    this.state.socket.removeListener('closePoll');
    this.props.navigator.pop();
  }

  beforeLogout() {
    this.state.socket.emit('studentLoggingOut', {user:this.state.user});
  }

  render() {
    return (
      <View style={styles.sceneContainer}>
        <NavBar navi={this.props.navigator} beforeLogout={this.beforeLogout.bind(this)} onBack={this.onBack.bind(this)}>
          Thumbroll
        </NavBar>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.textSize}> Enter Percentage </Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.thumbRollContainer}>
              <ThumbRoll onUpdate={(value)=>{this.valueChange(value);}}/>
            </View>
              <Button onPress={this.submitResponse.bind(this)} text={'Submit'} />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#424242',
  },
  contentContainer: {
    marginTop: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  bodyContainer: {
    alignItems: 'center'
  },
  thumbRollContainer: {
    alignItems: 'stretch',
  },
  textSize:{
    fontSize:25,
    fontWeight: 'normal',
    color: '#fafafa' 
  }
})

var customStyles = StyleSheet.create({
  track: {
      height: 4,
      borderRadius: 2,
    },
    thumb: {
      width: 30,
      height: 30,
      borderRadius: 30 / 2,
      backgroundColor: '#424242',
      borderColor: '#30a935',
      borderWidth: 2,
    }
})

module.exports = ThumbCheck;