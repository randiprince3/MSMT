module.exports = function(sequelize, DataTypes) {
  const userPermissions = sequelize.define("userPermissions", {});

  userPermissions.associate = function(models) {
    userPermissions.belongsTo(models.Userinfo, {
      foreignKey: {
        allowNull: false
      }
    });

    userPermissions.belongsTo(models.Permissions, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return userPermissions;
};
