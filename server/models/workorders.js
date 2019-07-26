module.exports = function(sequelize, DataTypes) {
  var Workorders = sequelize.define("Workorders", {
    title: DataTypes.TEXT,
    category: DataTypes.TEXT,
    location: DataTypes.TEXT,
    status: DataTypes.TEXT,
    urgent: DataTypes.BOOLEAN,
    remind: DataTypes.BOOLEAN,
    pictureDataUri: {
      type: DataTypes.BLOB("long"),
      get() {
        if (this.getDataValue("pictureDataUri")) {
          return this.getDataValue("pictureDataUri").toString("utf8");
        }
      }
    }
  });

  Workorders.associate = function(models) {
    Workorders.belongsTo(models.Userinfo, {
      foreignKey: {
        allowNull: false
      }
    });

    Workorders.hasOne(models.workOrderAssignments, {
      onDelete: "cascade"
    });
  };
  return Workorders;
};
