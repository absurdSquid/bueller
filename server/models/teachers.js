"use strict";

module.exports = function(sequelize, DataTypes) {
  var teachers = sequelize.define("teachers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        teachers.hasMany(models.classes, {
          foreignKey: 'teacher_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        teachers.hasMany(models.polls, {
          foreignKey: 'teacher_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
      }
    }
  });
  return teachers;
};