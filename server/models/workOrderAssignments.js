module.exports = function(sequelize, DataTypes) {
  const workOrderAssignments = sequelize.define("workOrderAssignments", {});

  workOrderAssignments.associate = function(models) {
    workOrderAssignments.belongsTo(models.Userinfo, {
      foreignKey: {
        allowNull: false
      }
    });

    workOrderAssignments.belongsTo(models.Workorders, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return workOrderAssignments;
};
