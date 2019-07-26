module.exports = function(sequelize, DataTypes) {
  const Permissions = sequelize.define("Permissions", {
    permission: DataTypes.TEXT
  });

  Permissions.associate = function(models) {
    Permissions.hasMany(models.userPermissions, {
      onDelete: "cascade"
    });
  };

  return Permissions;
};
