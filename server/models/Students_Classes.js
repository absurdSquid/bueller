// id - uuid
// studentId - int (fkey to students)
// classId - int (fkey to classes)

"use strict";

module.exports = function(sequelize, DataTypes) {
  var students_classes = sequelize.define("students_classes", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        students_classes.belongsTo(models.students, {
          foreignKey: 'student_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        students_classes.belongsTo(models.classes, {
          foreignKey: 'class_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
      }
    }
  });
  return students_classes;
};