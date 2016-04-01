var React = require('react-native');
var Button = require('./../shared/button');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Modal,
  Dimensions,
  ScrollView
} = React;


class StudentQCModal extends React.Component {
  constructor(props) {
    super(props);
    var {height, width} = Dimensions.get('window');
    this.state = {
      secretCode: '',
      height: height,
      width: width,
    }
  }

  handleCodeChange(event) {
    this.setState({
      secretCode: event.nativeEvent.text
    });
  }

  handleCancel() {
    this.setState({
      secretCode: ''
    });
    this.props.onCancel();
  }

  handleEnter() {
    var secretCode = this.state.secretCode;
    this.setState({
      secretCode: ''
    });
    this.props.onEnter.call(null, secretCode)
  }


  render() {
    return (
      <Modal visible={this.props.visible} transparent={true} animated={true}>
          <ScrollView scrollEnabled={false}>
        <View style={styles.modal}>
            <View style={{height:this.state.height * 0.6, width:this.state.width * 0.85}}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTextSize}> Enter the secret code: </Text>
                <View>
                  <TextInput
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    maxLength={4}
                    style={styles.userInput}
                    keyboardType='numeric'
                    value={this.state.secretCode}
                    returnKeyType={'done'}
                    onChange={this.handleCodeChange.bind(this)}
                    onSubmitEditing={this.props.onEnter.bind(null, this.state.secretCode)}
                  />
                </View>
              </View>
            </View>
          <Button onPress={this.handleEnter.bind(this)} text={'Enter'} />
          <Button onPress={this.handleCancel.bind(this)} text={'Cancel'} />
        </View>
          </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    marginTop: 50
  },
  userInput: {
    backgroundColor: '#e1f5fe',
    width: 300,
    height: 45,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 4,
  },
  modalTextSize: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

module.exports = StudentQCModal;

