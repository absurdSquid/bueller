var environments = {
  devLocal: {server:'http://localhost', port:3000},
  devDocker: {server:'http://192.168.99.100', port:80},
  devDeployed: {server:'http://45.55.171.230', port:80},
  production: {server:'http://45.55.204.109', port:80}
}

module.exports = environments.production;