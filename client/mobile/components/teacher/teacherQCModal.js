var React = require('react-native');
var Button = require('./../shared/button');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Dimensions
} = React;


class TeacherQCModal extends React.Component {
  constructor(props) {
    super(props);
    var {height, width} = Dimensions.get('window');

    this.state = {
      height: height,
      width: width,
    };
  }

  handleEnter() {
    this.props.onEnter.call(null)
  }

  render() {
    return (
      <Modal visible={this.props.visible} transparent={true} animated={true}>
        <View style={styles.modal}>
          <View style={{height:this.state.height * 0.5, width:this.state.width * 0.85}}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTextSize}> Your secret code is: </Text>
              <Text style={styles.modalTextSize}> {this.props.randomId} </Text>
            </View>
          </View>
          <Button onPress={this.handleEnter.bind(this)} text={'Okay'} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
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
      backgroundColor: '#e3f2fd'
    },
    modalTextSize: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 20,
    },
});

module.exports = TeacherQCModal;


