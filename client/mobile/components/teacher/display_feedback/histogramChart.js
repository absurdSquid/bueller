import React, { StyleSheet, View, Component, Animated, ScrollView, Text } from 'react-native';
 
class HistogramChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentData: [],
      transformedData: [],
      animators: [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],       
      xLabels: ['A', 'B', 'C', 'D']
    }
    this.chartHeight = 400;
  }

  componentWillReceiveProps(newData) {
    var updatedStudentData = newData.data;

    this.setState({
      studentData : updatedStudentData,
      transformedData: transformMultiChoiceData(updatedStudentData),
    });
    
    var displayData = transformMultiChoiceData(updatedStudentData);
    var total = displayData.reduce((a,b) => {return a + b});
    for(var i = 0 ; i < displayData.length; i++) {
      Animated.timing(      
        this.state.animators[i],
        {toValue: displayData[i] / total},      
      ).start();   
    }
  }

  renderBars (labels) {
    var height = this.chartHeight;
    return labels.map((label, index) => {
        return (
          <View key={label} style={styles.barContainer}>
            <View >
              <Animated.View style={[{
                height:this.state.animators[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 0]  
                })
              }, styles.barWhite]} />
              <Animated.View style={[{
                height:this.state.animators[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, height]  
                })
              }, styles.barColor]} />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}> {label} </Text>
            </View>
          </View>
        )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          directionalLockEnabled
          style={{height: this.chartHeight}}>
          <View style={[{height:this.chartHeight}, styles.axisContainer]}>
            <Text style={[{marginBottom:this.chartHeight / 5}, styles.axisText]}> 100% </Text>
            <Text style={[{marginBottom:this.chartHeight / 5}, styles.axisText]}> 75% </Text>
            <Text style={[{marginBottom:this.chartHeight / 5}, styles.axisText]}> 50% </Text>
            <Text style={[{marginBottom:this.chartHeight / 5}, styles.axisText]}> 25% </Text>
            <Text style={styles.axisText}> 0% </Text>
          </View>
          <View style={[{height:this.chartHeight}, styles.axisContainer]}>
            <View style={[{height:this.chartHeight}, styles.axis]} />
          </View>
          {this.renderBars.call(this, this.state.xLabels)}
        </ScrollView>
      </View>
    );
  }
}

var transformMultiChoiceData = (responses) => {
  var allResponses = {};

  responses.forEach((answer) => {
    allResponses[answer] = allResponses[answer] || 0;
    allResponses[answer]++;
  });

  return [allResponses['A'] || 0, allResponses['B'] || 0, allResponses['C'] || 0, allResponses['D'] || 0];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  axisContainer: {
    marginTop:10, 
    marginBottom:20,
  },
  axisText: {

  },
  axis: {
    width:2, 
    backgroundColor:'#424242',
  },
  barContainer: {
    padding:5, 
    margin:5,
  },
  barWhite: {
    width:40, 
    backgroundColor:'white', 
  },
  barColor: {
    width:40, 
    backgroundColor:'#e65100', 
  },
  labelContainer: {
    
  }
  labelText: {

  }
});

module.exports = HistogramChart;