var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} = React;

class Button extends React.Component {
  constructor(props){
    super(props);
    var {height, width} = Dimensions.get('window');
    this.state = {
      height: height,
      width: width,
    }
  }
  render () {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.buttons, {width: this.state.width * 0.85}]} onPress={this.props.onPress}>
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
    height: 45,
    backgroundColor:'#03a9f4',
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSize: {
    fontSize: 22,
    alignSelf: 'center',
    color: '#fafafa'
  },
  
})

module.exports = Button;