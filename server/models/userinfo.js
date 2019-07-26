module.exports = function(sequelize, DataTypes) {
  //userinfo data structure
  var Userinfo = sequelize.define("Userinfo", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      isUnique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        len: [1, 100]
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      required: true,
      len: [1, 100]
    },
    userType: {
      type: DataTypes.STRING,
      required: false,
      len: [1, 100]
    },
    createdAt: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active"
    }
  });

  Userinfo.associate = function(models) {
    Userinfo.hasMany(models.Workorders, {
      onDelete: "cascade"
    });

    Userinfo.hasMany(models.userPermissions, {
      onDelete: "cascade"
    });
  };
  return Userinfo;
};
