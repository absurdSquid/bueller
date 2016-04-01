import React, { StyleSheet, View, Component, Text, Animated, Dimensions } from 'react-native';
var Progress = require('react-native-progress');
 
class PercentageChart extends Component {
  constructor(props) {
    super(props);
    var {height, width} = Dimensions.get('window');
    this.width = width;
    this.state = {
      studentData: [],
      color: ['#03a9f4','#03a9f4','#03a9f4'],
      minAnim: new Animated.Value(0),
      maxAnim: new Animated.Value(0),
      xLabels: ['Lowest', 'Average Student Response', 'Highest']
    }
  }


  componentWillReceiveProps(newData) {
    var updatedStudentData = [newData.lowest / 100, newData.average / 100, newData.highest / 100];
    var updatedColor = [];

    // Change color based on average response
    for(var i = 0; i < updatedStudentData.length; i++) {
      if(updatedStudentData[i] > 0.8) {
        updatedColor[i] = '#66ff99';
      } else if(updatedStudentData[i] > 0.4) {
        updatedColor[i] = '#fcfa8b';
      } else {
        updatedColor[i] = '#ff4f4d';
      }
    }

    Animated.timing(      
      this.state.minAnim,
      {toValue: updatedStudentData[0]},      
    ).start();
    Animated.timing(      
      this.state.maxAnim,
      {toValue: updatedStudentData[2]},      
    ).start();

    this.setState({
      studentData : updatedStudentData,
      color: updatedColor,
    });
  }

  render() {
    var width = this.width * 0.5;
    return (
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <Progress.Circle size={300} progress={this.state.studentData[1]} 
            showsText={true} thickness={50} borderWidth={5} color={this.state.color[1]}
            textStyle={styles.progressText}/>
        </View>
        <View stlye={[{width:width}, styles.barsContainer]}>
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}> Max: </Text>
            <Animated.View style={[{
              backgroundColor: this.state.color[2],
                width:this.state.maxAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width]  
                })
              }, styles.bar]} />
              <Text style={styles.barLabel}> 
                {Math.round(this.state.studentData[2] * 100 || 0) + '%'} 
              </Text>
          </View>
          <View style={styles.barContainer}>
            <Text style={styles.barLabel}> Min: </Text>
            <Animated.View style={[{
                backgroundColor: this.state.color[0],
                width:this.state.minAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width]  
                })
              }, styles.bar]} />
              <Text style={styles.barLabel}> 
                {Math.round(this.state.studentData[0] * 100 || 0) + '%'} 
              </Text>
          </View>
        </View>
      </View>
    );
  }
}

const flag = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  progressText: {
    color: '#03a9f4'
  },
  barsContainer: {

  },
  barContainer: {
    flexDirection: 'row',
    margin: 10,
    marginLeft: 40
  },
  bar: {
    height: 20,
  }, 
  barLabel: {
    padding: 5,
    alignSelf: 'center'
  }
});

module.exports = PercentageChart;