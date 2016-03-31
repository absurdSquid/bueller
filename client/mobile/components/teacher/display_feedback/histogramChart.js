import React, { StyleSheet, View, Component } from 'react-native';
import RNChart from 'react-native-chart';

 
class HistogramChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentData: [],
      transformedData: [],
      chartData: [
        {
          name: 'BarChart',
          type: 'bar',
          color: '#219dff',
          widthPercent: 1,
          data: [],
        }
      ],
      xLabels: ['A', 'B', 'C', 'D']
    }
  }


  componentWillReceiveProps(newData) {
    var updatedStudentData = newData.data;
    var updatedColor;

    this.setState({
      studentData : updatedStudentData,
      transformedData: transformMultiChoiceData(updatedStudentData),
      color: '#219dff'
    });
    
    var displayData = transformMultiChoiceData(updatedStudentData);
    return (
      <View style={styles.container}>
        <RNChart style={styles.chart}
          chartData={[{
          name: 'BarChart',
          type: 'bar',
          color: this.state.color,
          widthPercent: .5,
          data: this.state.transformedData
        }]}
          verticalGridStep={5}
          xLabels={['A', 'B', 'C', 'D']}
         />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <RNChart style={styles.chart}
          chartData={[{
          name: 'BarChart',
          type: 'bar',
          color: this.state.color,
          widthPercent: .5,
          data: this.state.transformedData
        }]}
          verticalGridStep={5}
          xLabels={this.state.xLabels}
         />
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

const flag = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chart: {
    position: 'absolute',
    top: 15,
    left: 15,
    bottom: 4,
    right: 15,
  }
});

module.exports = HistogramChart;