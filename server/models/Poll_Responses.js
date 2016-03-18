// id - uuid
// studentId - int (fkey to students)
// pollId - int (fkey to polls)
// responseVal - text

"use strict";

module.exports = function(sequelize, DataTypes) {
  var poll_responses = sequelize.define("poll_responses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    response_val: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        poll_responses.belongsTo(models.students, {
          foreignKey: 'student_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        poll_responses.belongsTo(models.polls, {
          foreignKey: 'poll_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
      }
    }
  });
  return poll_responses;
};