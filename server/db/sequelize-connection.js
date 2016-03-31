///////////////////////////////////////////////
// sequelize connection to postgres database //
///////////////////////////////////////////////

var env       = process.env.NODE_ENV || "development";
var config    = require('./config.json')[env];
var Sequelize = require('sequelize');
var conString = config.dialect+'://'+config.username+':'+config.password+'@'+config.host+':'+config.port+'/'+config.database;
var sequelize = new Sequelize(conString, {
  dialect: 'postgres'
});

module.exports = sequelize;
