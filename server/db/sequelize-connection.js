///////////////////////////////////////////////
// sequelize connection to postgres database //
///////////////////////////////////////////////

var config = require('./config');
var env = config.production;
var Sequelize = require('sequelize');
var conString = env.dialect+'://'+env.username+':'+env.password+'@'+env.host+':'+env.port+'/'+env.database;
var sequelize = new Sequelize(conString, {
  dialect: 'postgres'
});

module.exports = sequelize;
