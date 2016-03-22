var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Navigator,
} = React;

class Button extends React.Component {
  
  render () {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttons} onPress={this.props.onPress}>
          <Text style={styles.textSize}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    height: 80,
    width: 365,
    backgroundColor:'#6FC3D1',
    borderColor: '#6FC3D1',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSize: {
    fontSize: 30,
    alignSelf: 'center',
    color: 'white'
  },
  
})

module.exports = Button;