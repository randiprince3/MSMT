import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import WorkOrderTable from "../../components/WorkOrderTable/WorkOrderTable";
import AlertToggle from "../../components/AlertToggle/AlertToggle";
import UserSelect from "../../components/UserSelect/UserSelect";
import { withRouter } from "react-router-dom";
import axios from "axios";
// import { WorkerList } from "twilio/lib/rest/taskrouter/v1/workspace/worker";

class WorkOrderList extends Component {
  state = {
    isAlert: true,
    selectedUser: null,
    selectedWorkOrder: null,
    users: null,
    currentWorkOrder: null
  };

  componentDidMount() {
    //renderWorkOrders has an axios get request, that hits the "api/workorders" route
    //the function will then dispatch "getWorkOrders" (see store => actions => workOrders)
    //getWorkOrder puts work order data in the redux store
    const query = "/api/workorders";
    this.props.renderWorkOrders(query);

    //the below axios get request hits the "api/users" route
    //gets data on all the users puts data in the local state
    axios("/api/users", {
      method: "GET"
    })
      .then(response => {
        const users = response.data.map(user => {
          return {
            label: user.username,
            value: user.id
          };
        });
        this.setState({ users: users });
      })
      .catch(error => {
        throw error;
      });
  }

  /*   componentWillUnmount() {
    clearInterval(this.interval);
  } */

  // gets the user that is selected (via Select) and sets state (selectedUser)
  handleUserSelect = selectedUser => {
    this.setState({ selectedUser });
  };

  handleIsAlert = isAlert => {
    this.setState({ isAlert });
  };

  // we use this function to get the information (in SQL) of the work order that is selected
  // we grab it from SQL and then put it into redux via props.getCurrentWorkOrder
  handleWorkOrderEdit = values => {
    const workOrders = Object.keys(values);
    const workOrdersSelected = workOrders.filter(workOrderId => {
      return values[workOrderId] === true;
    });

    const workOrderIds = workOrdersSelected.map(workOrderId =>
      parseInt(workOrderId.slice(9))
    );

    if (workOrderIds.length > 1) {
      alert("Can only edit one work order at once!");
    } else {
      axios
        .get("/api/workorders/" + workOrderIds[0])
        .then(response => {
          console.log(response.data);
          //puts the current work order data into Redux
          this.props.getCurrentWorkOrder(response.data);
          this.props.history.replace("/edit/");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  /* handleTableRowClick = event => {
    console.log(event.target.getAttribute("data-value"));
    this.setState({ toggleExpand: true });
  }; */

  //gets the workorder that is selected (via WorkOrderTable)
  //POST or PUT to workOrderAssignments SQL table
  handleWorkOrderAssign = values => {
    const selectedUser = this.state.selectedUser;
    const workOrders = Object.keys(values);
    const workOrdersSelected = workOrders.filter(workOrderId => {
      return values[workOrderId] === true;
    });

    const workOrderIds = workOrdersSelected.map(workOrderId =>
      parseInt(workOrderId.slice(9))
    );

    if (!selectedUser || workOrderIds.length === 0) {
      alert("You have not selected a user or work order!");
    } else {
      // we need to use the map method because there might be more than
      // 1 work order that is selected
      const workOrderAssignmentData = workOrderIds.map(workOrderId => {
        return {
          userId: selectedUser.value,
          workOrderId: workOrderId
        };
      });

      // props.assignWorkOrders is used to either POST or PUT to workOrderAssignments SQL table
      // see store => workOrders
      this.props.assignWorkOrders(workOrderAssignmentData, this.state.isAlert);
      this.setState({ selectedUser: null });
    }
  };

  render() {
    let workOrdersTable;
    let usersSelect;
    let alertToggle;

    //data needs to be loaded before anything can be rendered onto the page
    if (!this.props.workOrders || !this.state.users) {
      workOrdersTable = <h1> loading </h1>;
    } else {
      /*       let createdFromNow = moment().diff(workOrder.createdAt, "minutes");
      createdFromNow =
        moment.duration(createdFromNow, "minutes").humanize() + " ago"; */

      workOrdersTable = (
        <WorkOrderTable
          // give the above workOrdersData to the workOrderTable component
          userId={this.props.userId}
          handleTableRowClick={event => this.handleTableRowClick(event)}
          userPermissions={this.props.userPermissions}
          workOrders={this.props.workOrders}
          onChange={this.handleWorkOrderSelect}
          handleWorkOrderEdit={this.handleWorkOrderEdit}
          handleWorkOrderAssign={this.handleWorkOrderAssign}
        />
      );

      usersSelect = (
        //Select is a third party package (react-select)
        // documentation: https://github.com/JedWatson/react-select
        <UserSelect
          value={this.state.selectedUser}
          changed={this.handleUserSelect}
          options={this.state.users}
        />
      );
    }

    if (this.state.selectedUser) {
      alertToggle = (
        <AlertToggle
          handleIsAlert={this.handleIsAlert}
          isAlert={this.state.isAlert}
        />
      );
    }

    return (
      <Auxil className="background">
        {workOrdersTable}
        {usersSelect}
        {alertToggle}
      </Auxil>
    );
  }
}

const mapStateToProps = state => {
  return {
    workOrders: state.workOrders.workOrders,
    users: state.auth.users,
    userId: state.auth.userId,
    userPermissions: state.auth.userPermissions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    renderWorkOrders: query => dispatch(actions.renderWorkOrders(query)),
    assignWorkOrders: (updatedWorkOrders, isAlert) =>
      dispatch(actions.assignWorkOrders(updatedWorkOrders, isAlert)),
    getCurrentWorkOrder: currentWorkOrder =>
      dispatch(actions.getCurrentWorkOrder(currentWorkOrder))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkOrderList)
);
