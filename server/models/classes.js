// id - uuid
// name - text
// teacherId (fkey to teachers)

"use strict";

module.exports = function(sequelize, DataTypes) {
  var classes = sequelize.define("classes", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        classes.belongsTo(models.teachers, {
          foreignKey: 'teacher_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        classes.hasMany(models.lessons, {
          foreignKey: 'class_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        classes.hasMany(models.students_classes, {
          foreignKey: 'class_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
      }
    }
  });
  return classes;
};
