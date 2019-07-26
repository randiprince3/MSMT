module.exports = function(sequelize, DataTypes) {
    const userTypes = sequelize.define("UserTypes", {
      type: DataTypes.TEXT,
      defaultPermissions: DataTypes.TEXT
    });
   

  return userTypes;
};