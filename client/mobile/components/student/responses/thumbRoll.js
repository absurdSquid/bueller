var React = require('react-native');
var Slider = require('react-native-slider');
var Progress = require('react-native-progress');

var {
  View,
  Text,
  PanResponder,
  Dimensions
} = React;

class ThumbRoll extends React.Component {
  constructor(props) {
    super(props)
    var {height, width} = Dimensions.get('window');
    this.width = width;
    this.circleSize = 300;
    this.padding = 40;
    this._panResponder = {};
    this.circleCenter = {};

    this.state = {
      value: 0.004,
      fullLoop: false,
      emptyLoop: false
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.refs.circle.measure( (fx, fy, width, height, px, py) => {
          this.circleCenter.y = py + this.circleSize / 2 + this.padding;
          this.circleCenter.x = width / 2;
          console.log(this.circleCenter);
          var xPos = gestureState.x0 - this.circleCenter.x;
          var yPos = this.circleCenter.y - gestureState.y0;
          var theta = Math.atan2(xPos, yPos);
          var percent = theta / (2 * Math.PI);
          if(xPos < 0) {
            percent = 1 + percent;
          }
          if(this.state.fullLoop) {
            percent = 1;
          }
          this.setState({
            value: percent
          });
          this.props.onUpdate(Math.floor(percent * 100));
        });
        this.setState({
          fullLoop: false
        })
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        var xPos = gestureState.moveX - this.circleCenter.x;
        var yPos = this.circleCenter.y - gestureState.moveY;
        var theta = Math.atan2(xPos, yPos);
        var percent = theta / (2 * Math.PI);
        if(xPos < 0) {
          percent = 1 + percent;
        }
        if(percent > 0.99) {
          this.setState({
            fullLoop: true
          });
        }
        if(percent < 0.99 && percent > 0.2) {
          this.setState({
            fullLoop: false
          });
        }
        if(percent < 0.01) {
          this.setState({
            emptyLoop: true
          });
        }
        if(percent > 0.01 && percent < 0.90) {
          this.setState({
            emptyLoop: false
          });
        }
        if(this.state.fullLoop) {
          percent = 1;
        }
        if(this.state.emptyLoop) {
          percent = 0.004;
        }
        this.setState({
          value: percent
        });
        this.props.onUpdate(Math.floor(percent * 100));
      },
      
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }
  
  render() {
    return (
      <View ref='circle' style={{alignItems: 'center', padding:this.padding}} {...this._panResponder.panHandlers}>
        <Progress.Circle size={this.circleSize} progress={this.state.value} showsText={true} thickness={50} borderWidth={5} color={'#03a9f4'}/>
      </View>
    )
  }
}

module.exports = ThumbRoll;



