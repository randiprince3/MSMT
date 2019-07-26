import * as actionTypes from "./actionTypes";
import moment from "moment";
import axios from "axios";

//puts all the workorders from SQL into Redux (see renderWorkOrders)
export const getWorkOrders = workOrders => {
  return {
    type: actionTypes.GET_WORK_ORDERS,
    workOrders: workOrders
  };
};

//puts the current workorder (that is selected from the table) into Redux
export const getCurrentWorkOrder = currentWorkOrder => {
  return {
    type: actionTypes.GET_CURRENT_WORK_ORDER,
    currentWorkOrder: currentWorkOrder
  };
};

// action used to assign work orders to different users
// WARNING: the below code is long and complicated
export const assignWorkOrders = (workOrderAssignmentData, isAlert) => {
  const url = "/api/workorderassignments";

  // we first get all of the data in SQL's WorkOrderAssignments table
  // we need to do this because we need to check if a workorder assignment already exists
  return dispatch => {
    axios(url, {
      method: "GET"
    })
      .then(response => {
        // workOrderAssignmentData is given to us from container => WorkOrderList => WorkOrderList (line 96)
        // here, we use the map method to structure it into array because we need to label whether the assigment is a POST or PUT
        /*         
                        EXAMPLE STRUCTURE: 
                        [
                          {type: PUT,
                          data: ...},
                          {type: pOST,
                          data: ...}
                        ] */
        const WorkOrderRequests = workOrderAssignmentData.map(assignment => {
          // checks if a workorder assignment already exists for the work order
          const WorkOrderId = response.data.find(
            workOrder => workOrder.WorkorderId === assignment.workOrderId
          );

          //if it already exists in the table, the type is PUT
          if (WorkOrderId) {
            return {
              type: "PUT",
              data: {
                UserinfoId: assignment.userId,
                WorkorderId: assignment.workOrderId
              }
            };
          } else {
            //if it DOESN'T exists in the table, the type is POST
            return {
              type: "POST",
              data: {
                UserinfoId: assignment.userId,
                WorkorderId: assignment.workOrderId
              }
            };
          }
        });

        // now that we have labeled the request type (POST or PUT) for each request,
        // we iterate over our structured array and send the requests to the backend via axios
        WorkOrderRequests.forEach(request => {
          // if the request type is a PUT, then we PUT
          if (request.type === "PUT") {
            axios.put(url, request.data).then(response => {
              dispatch(
                sendWorkOrder(
                  response.data.Userinfo.phoneNumber,
                  response.data.Userinfo.username,
                  response.data.Workorder.location,
                  response.data.WorkorderId,
                  isAlert
                )
              );
              dispatch(updateWorkOrder(response.data.WorkorderId, "assigned"));
            });
          } else {
            // if the request type is a POST, then we POST
            axios.post(url, request.data).then(response => {
              console.log(response.data);
              console.log(
                response.data.Userinfo.phoneNumber,
                response.data.Userinfo.username
              );
              dispatch(
                sendWorkOrder(
                  response.data.Userinfo.phoneNumber,
                  response.data.Userinfo.username,
                  response.data.Workorder.location,
                  response.data.WorkorderId,
                  isAlert
                )
              );

              // in addition, if this is a newly posted work assignment, we need to set
              // the work order's status from pending => assigned
              dispatch(updateWorkOrder(response.data.WorkorderId, "assigned"));
            });
          }
        });
      })
      .catch(error => {
        throw error;
      });
  };
};

// renderWorkOrders is used to show all the work orders in the work order table
// see line 24 (under componentDidMount) in containers => WorkOrderList => WorkOrderList
export const renderWorkOrders = query => {
  return dispatch => {
    axios
      .get(query)
      .then(response => {
        dispatch(getWorkOrders(response.data));
        response.data.forEach(workOrder => {
          let createdFromNow = moment().diff(workOrder.createdAt, "minutes");
          if (
            workOrder.remind &&
            workOrder.urgent &&
            createdFromNow > 2 &&
            workOrder.status !== "completed"
          ) {
            console.log(workOrder.id);
            console.log(workOrder.status);
            console.log(workOrder.remind);
            dispatch(remindWorkOrder(workOrder.location));
            dispatch(updateWorkOrder(workOrder.id, workOrder.status, false));
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const sendWorkOrder = (
  phoneNumber,
  username,
  location,
  WorkorderId,
  isAlert
) => {
  const url = "/api/twilio/workorderassigned";
  return dispatch => {
    if (isAlert) {
      axios
        .post(url, {
          phoneNumber: phoneNumber,
          username: username,
          location: location,
          WorkorderId: WorkorderId
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
};

export const remindWorkOrder = location => {
  const url = "/api/twilio/reminder";
  return dispatch => {
    axios
      .post(url, {
        location: location
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
};

export const updateWorkOrder = (workOrderId, status, remind) => {
  return dispatch => {
    let updatedStatus = {
      status: status,
      remind: remind
    };

    let url = "/api/workorders/" + workOrderId;

    console.log(url);

    axios
      .put(url, updatedStatus)
      .then(response => {
        console.log(response.data);
        let url = "/api/workorders";
        dispatch(renderWorkOrders(url));
      })
      .catch(error => {
        console.log(error);
      });
  };
};
