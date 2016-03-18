var React = require('react-native');
var Login = require('./components/shared/login');

var {
  AppRegistry,
  Component,
  StyleSheet,
  Navigator,
  Text,
  View
} = React;

class thumbroll extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          component: Login,
        }}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromBottom;
        }}
        renderScene={(route, navigator) => {
          if (route.component) {
            return React.createElement(route.component, { navigator, route });
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('thumbroll', () => thumbroll);
