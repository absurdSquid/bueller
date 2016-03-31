// id - uuid
// type - enum (thumbs, multiChoice)
// lessonId - int (fkey to lessons)
// preset_data - text

"use strict";

module.exports = function(sequelize, DataTypes) {
  var polls = sequelize.define("polls", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING, 
    type: DataTypes.ENUM('thumbs', 'multiChoice'),
    answer: DataTypes.STRING, 
    preset_data: DataTypes.JSON,
    sent: DataTypes.BOOLEAN
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        polls.belongsTo(models.lessons, {
          foreignKey: 'lesson_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
        polls.hasMany(models.poll_responses, {
          foreignKey: 'poll_id',
          onDelete: 'set null',
          onUpdate: 'cascade'
        }); 
      }
    }
  });
  return polls;
};