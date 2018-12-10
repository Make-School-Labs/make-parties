'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    desc: DataTypes.TEXT
  }, {});

  Event.associate = function(models) {
    Event.hasMany(models.Comment); // CommentId
  };

  return Event;
};
