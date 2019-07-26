var db = require("../models");
var twilioFunctions = require("./twilioFunctions.js");

module.exports = function(app, passport) {
  app.put("/api/workorderassignments", function(req, res) {
    const workOrderAssignments = req.body;

    db.workOrderAssignments
      .update(
        { UserinfoId: workOrderAssignments.UserinfoId },
        {
          where: {
            WorkorderId: workOrderAssignments.WorkorderId
          }
        }
      )
      .then(function(data) {
        db.workOrderAssignments
          .findOne({
            where: {
              WorkorderId: workOrderAssignments.WorkorderId
            },
            include: [
              {
                model: db.Workorders
              },
              {
                model: db.Userinfo
              }
            ]
          })
          .then(function(data) {
            res.json(data);
          });
      });
  });

  app.post("/api/workorderassignments", function(req, res) {
    const workOrderAssignments = req.body;
    db.workOrderAssignments.create(req.body).then(function(data) {
      db.workOrderAssignments
        .findOne({
          where: {
            WorkorderId: workOrderAssignments.WorkorderId
          },
          include: [
            {
              model: db.Workorders
            },
            {
              model: db.Userinfo
            }
          ]
        })
        .then(function(data) {
          res.json(data);
        });
    });
  });

  app.get("/api/workorderassignments", function(req, res) {
    db.workOrderAssignments
      .findAll({
        include: [
          {
            model: db.Userinfo
          }
        ]
      })
      .then(function(data) {
        res.json(data);
      });
  });

  app.get("/api/workorders", function(req, res) {
    db.Workorders.findAll({
      include: [
        {
          model: db.workOrderAssignments,
          include: [
            {
              model: db.Userinfo
            }
          ]
        }
      ]
    }).then(function(data) {
      res.json(data);
    });
  });

  app.put("/api/workorders/:id", function(req, res) {
    db.Workorders.update(
      { status: req.body.status, remind: req.body.remind },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(function(data) {
      res.send(data);
    });
  });

  app.get("/api/workorders/:id", function(req, res) {
    console.log(req.params.id);
    db.Workorders.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.workOrderAssignments
        }
      ]
    }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/users", function(req, res) {
    db.Userinfo.findAll({}).then(function(data) {
      res.json(data);
    });
  });

  app.post("/api/twilio/workorderassigned", function(req, res) {
    const accountSid = "AC53aad807e1c0f727648db258b0146099";
    const authToken = "fbc44c8484e99216a18c1127b72a5b4a";
    const client = require("twilio")(accountSid, authToken);

    console.log(req.body.phoneNumber.length);
    if (req.body.phoneNumber.length > 9) {
      client.messages
        .create({
          body:
            ". \n \nHello " +
            req.body.username +
            ", a new work order has been assigned to you for room " +
            req.body.location +
            "." +
            "\n" +
            "To mark as complete, type C" +
            req.body.WorkorderId,
          from: "+15626081666",
          to: req.body.phoneNumber
        })
        .then(message => res.json(message.sid))
        .done();
    }
  });

  app.post("/api/twilio/reminder", function(req, res) {
    const accountSid = "AC53aad807e1c0f727648db258b0146099";
    const authToken = "fbc44c8484e99216a18c1127b72a5b4a";
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body:
          "the urgent work order in room " +
          req.body.location +
          " has still not been completed",
        from: "+15626081666",
        to: "+15624558688"
      })
      .then(message => res.json(message.sid))
      .done();
  });

  app.post("/api/twilio/inboundsms", function(req, res) {
    let textMessageBody = req.body.Body;
    if (textMessageBody.charAt(0) === "v") {
      twilioFunctions.viewAllWorkOrders(req, res);
    } else if (textMessageBody.charAt(0) === "c" || "C") {
      let workOrderId = textMessageBody.substring(1);
      twilioFunctions.updateWorkOrderStatus(req, res, "completed", workOrderId);
    }
  });

  app.get("/api/usertypes/:userType", function(req, res) {
    db.UserTypes.findOne({
      where: {
        type: req.params.userType
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  app.post("/signup", function(req, res) {
    passport.authenticate("local-signup", function(err, user, info) {
      userInfo = {
        username: user.username,
        password: user.password,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        message: info,
        id: user.id
      };
      req.logIn(user, function(err) {
        res.json(userInfo);
      });
    })(req, res);
  });

  app.post("/login", function(req, res) {
    passport.authenticate("local-signin", function(err, user, info) {
      userInfo = {
        username: user.username,
        password: user.password,
        phoneNumber: user.phoneNumber,
        message: info,
        id: user.id
      };
      req.logIn(user, function(err) {
        res.json(userInfo);
      });
    })(req, res);
  });
};
