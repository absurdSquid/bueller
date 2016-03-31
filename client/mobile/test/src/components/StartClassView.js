
import React from "react-native";

const {
  View,
  Text,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  ScrollView,
  ListView
} = React;

class StartClassView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: [{id: 1, name:'Quick Class'}, {id:2, name:'CS 101'}, {id:3, name: 'CS 201'}],
    };
  }

  selectClass(classId) {
    api.getLessons(classId)
    .then((response) => {
      if(response.status === 500){
        console.error('err getting class data');
      } else if(response.status === 200) {
        var lessons = JSON.parse(response._bodyText);

        this.socket = io(server, {jsonp: false});
        this.socket.emit('teacherConnect' , {classId: classId});
        
        this.props.navigator.push({
          component: SelectLessonView,
          classId: classId,
          lessons: lessons,
          socket: this.socket,
          sceneConfig: {
            ...Navigator.SceneConfigs.FloatFromRight,
            gestures: {}
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  renderClasses(classes) {
    return classes.map((cls, index) => {
      return (
        <View style={styles.buttonContainer} key={index}>
          <TouchableOpacity onPress={this.selectClass.bind(this, cls.id)} style={styles.button}>
            <Text style={styles.buttonText}> {cls.name} </Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ededed'}}> 
        <View style={styles.viewContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.pageText}> Your classes </Text>
          </View>
          <ScrollView>
            <View style={styles.buttonsContainer}>
              {this.renderClasses(this.state.classes)}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pageText: {
    fontSize: 20
  },
  buttonsContainer: {
    padding: 20
  },
  buttonContainer: {
    margin: 20
  },
  button: {

  },
  buttonText: {
    fontSize: 20
  }
});