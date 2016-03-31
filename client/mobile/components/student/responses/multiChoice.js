var React = require('react-native');
var NavBar = require('./../../shared/navbar');
var Button = require('./../../shared/button');

var {
  View,
  Text,
  StyleSheet,
} = React;

class MultiChoice extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      socket: this.props.route.socket,
      user: this.props.route.user,
      pollInfo: this.props.route.pollInfo,
      questionFromTeacher: '',
      choice: '',
    }
    var that = this
    this.state.socket.on('closePoll', function(data) {
      this.state.socket.removeListener('closePoll');
      this.props.navigator.pop();
    }.bind(this));
  }  
  componentWillMount(){
    if(this.state.pollInfo.pollObject.preset_data) {
      var question = this.state.pollInfo.pollObject.preset_data;
      var questionNanswer = JSON.parse(question);
      var teacherQuestion = questionNanswer.question
      this.setState({
        questionFromTeacher: teacherQuestion,
        choice: questionNanswer,
      })
    } else {
      var empty = {A: '', B: '', C: '', D: ''}
      this.setState({
        choice: empty
      })
    }
  }

  submitAnswer(answer) {
    answer = answer.slice(0,1)
    console.log('Student',this.state.userId,'answered',answer,'to poll',this.state.pollInfo.pollId);
    this.state.socket.emit('studentResponse', {
      user: this.state.user,
      answer: answer,
      pollId: this.state.pollInfo.pollId
    })
    this.state.socket.removeListener('closePoll');
    this.props.navigator.pop();
  }

  onBack() {
    this.state.socket.removeListener('closePoll');
    this.props.navigator.pop();
  }

  beforeLogout() {
    this.state.socket.emit('studentLoggingOut', {user:this.state.user});
  }

  renderButton(value) {
    return (
      <Button onPress={this.submitAnswer.bind(this, value)} text={value} />
    )
  }

  render() {
    return (
      <View style={{flex:1}}>
        <NavBar navi={this.props.navigator} beforeLogout={this.beforeLogout.bind(this)} onBack={this.onBack.bind(this)}>
          MultiChoice
        </NavBar>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#424242' }}>
          <Text style={styles.textSize}>{this.state.questionFromTeacher}</Text>
          {this.renderButton('A  '+ this.state.choice["A"])}
          {this.renderButton("B  " + this.state.choice["B"])}
          {this.renderButton("C  " + this.state.choice["C"])}
          {this.renderButton("D  " + this.state.choice["D"])}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  textSize: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
})

module.exports = MultiChoice;