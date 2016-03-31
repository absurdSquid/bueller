var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;


class NavBar extends React.Component {
  constructor(props){
    super(props);

  }
  handleBackPress() {
    if(this.props.onBack) {
      this.props.onBack();
    } else {
      this.props.navi.pop();
    }
  }
  logout(){
    // this.state.socket.emit('studentLeavingClass', {userId: this.state.userId, classId:this.state.class.id});
    if(this.props.beforeLogout) {
      this.props.beforeLogout();
    }
    this.props.navi.popToTop();
  }
  render () {
    var backButton = '<<'
    return (
      <View>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.back}onPress={this.handleBackPress.bind(this)}>
            <View>
              <Text style={styles.textSize}> {backButton} </Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.textSizeOne}>{this.props.children}</Text>
          </View>
         <TouchableOpacity style={styles.logout} onPress={this.logout.bind(this)}>
            <View>
              <Text style={styles.textSize}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  nav: {
    flex: 0.2,
    marginTop: 0,
    paddingTop: 20,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#03a9f4',
    alignItems: 'center',
  },
  back: {
    height: 50,
    width: 50,
    justifyContent: 'center',
  },
  logout:{
    height: 50,
    width: 55,
    justifyContent: 'center',
  },
  textSize: {
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  textSizeOne: {
    fontSize: 25,
    justifyContent: 'center',
    color: '#fafafa',
  },
})

module.exports = NavBar;