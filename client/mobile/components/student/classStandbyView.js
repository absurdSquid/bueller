var React = require('react-native');
var ThumbCheck =  require('./responses/thumbCheck.js');
var MultiChoice =  require('./responses/multiChoice.js');
var NavBar = require('./../shared/navbar');
var Button = require('./../shared/button');

var {
  Text,
  StyleSheet,
  View,
  Navigator
} = React;

class ClassStandbyView extends React.Component {
  constructor(props){ 
    super(props);
    this.state = {
      socket: this.props.route.socket,
      userId: this.props.route.userId,
      class: this.props.route.class
    };
    var that = this;
    this.state.socket.on('teacherConnect', () => {
      console.log('Class is in sesson');
    });

    this.state.socket.on('newPoll', function(pollInfo) {
      console.log('message received from server!', pollInfo);
      if(pollInfo.pollObject.id == 1) {
        that.thumbcheckPage(pollInfo);
      } else if(pollInfo.pollObject.id == 2) {
        that.multiPage(pollInfo);
      }
    });
  }

  thumbcheckPage(pollInfo) {
    this.props.navigator.push({
      component: ThumbCheck,
      pollInfo: pollInfo,
      userId: this.state.userId,
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {}
      }
    })
  }

  multiPage(pollInfo) {
    this.props.navigator.push({
      component: MultiChoice,
      pollInfo: pollInfo,
      userId: this.state.userId,
      socket: this.state.socket,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {}
      }
    })
  }

  previousSection() {
    this.state.socket.emit('studentLeavingClass', {userId: this.state.userId, classId:this.state.class.id});
    this.props.navigator.pop();
  }

  render(){
    return(
      <View>
        <View>
          <NavBar navi={this.props.navigator} onBack={this.previousSection.bind(this)}>{this.state.class.name}</NavBar>
        </View>
        <View>
          <Text onPress={this.thumbcheckPage.bind(this)} >ThumbCheck</Text>
        </View>
        <View>
          <Text onPress={this.multiPage.bind(this)} >MutipleChoice</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.textSizeOne}>Waiting for Teacher!</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topStyle: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ededed'
  },

  textSize: {
    fontSize : 20
  },
  container:{
    flex: 1,
    width: null,
    height: null,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textSizeOne: {
    fontSize : 35,
    fontWeight: 'bold',
  }
})
module.exports = ClassStandbyView;
