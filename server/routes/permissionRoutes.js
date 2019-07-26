var db = require("../models");

module.exports = function(app, userPermissions) {
  app.get("/api/usertypes", function(req, res) {
    db.userTypes.findAll({}).then(function(data) {
      res.json(data);
    });
  });
  app.post("/api/userpermissions", function(req, res) {
    console.log("PERMISSION ID>>>>>>", req.body.PermissionId);
    let permissionIdArray = new Array();
    permissionIdArray = req.body.PermissionId.split(",");

    permissionIdArray.forEach(PermissionId => {
      const userPermissionsData = {
        UserinfoId: req.body.UserinfoId,
        PermissionId: PermissionId
      };

      userPermissions.create(userPermissionsData).then(function(data) {
        console.log(data);
      });
    });
  });
  app.get("/api/userpermissions/:id", function(req, res) {
    db.Userinfo.findOne({
      include: [
        {
          model: db.userPermissions,
          include: [
            {
              model: db.Permissions
            }
          ]
        }
      ],
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      //console.log(data);
      res.json(data);
    });
  });
};
