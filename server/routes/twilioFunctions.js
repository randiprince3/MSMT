var exports = (module.exports = {});
var db = require("../models");

exports.viewAllWorkOrders = function(req, res) {
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
    const MessagingResponse = require("twilio").twiml.MessagingResponse;
    const workOrderdata = data.map(workOrder => {
      return {
        id: workOrder.id,
        location: workOrder.location,
        category: workOrder.category,
        status: workOrder.status,
        assignedTo:
          workOrder.dataValues.workOrderAssignment.dataValues.Userinfo
            .dataValues.username
      };
    });

    console.log(workOrderdata);

    const twiml = new MessagingResponse();
    twiml.message("the robots are coming!");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  });
};

exports.updateWorkOrderStatus = function(req, res, status, workOrderId) {
  db.Workorders.update(
    { status: status },
    {
      where: {
        id: workOrderId
      }
    }
  ).then(function(data) {
    const MessagingResponse = require("twilio").twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    twiml.message("updated status");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  });
};
