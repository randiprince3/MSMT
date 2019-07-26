import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../store/actions/index";

//this is the container to edit work orders when "edit" button is clicked
class EditWorkOrder extends Component {
  /* accesses handleWorkOrderCompleted in Redux to change the work order status
  to "completed" in SQL */
  handleWorkOrderCompleted = () => {
    // function given to us by Redux
    this.props.updateWorkOrder(
      this.props.currentWorkOrder.id,
      "completed",
      false
    );
    // takes us back to the work orders table
    this.props.history.replace("/workorders");
  };

  handleBackButton = () => {
    this.props.history.replace("/workorders");
  };

  render() {
    // need to declare separate variable here because we get "this.props.currentWorkOrder" asynchronously
    // this.props.currentWorkOrder gives us access to the specific work order's information

    let title;
    let image;

    if (this.props.currentWorkOrder) {
      title = this.props.currentWorkOrder.title;
      image = <img src={this.props.currentWorkOrder.pictureDataUri} />;
    }
    return (
      <Auxil>
        <h1> Issue: {title}</h1>
        {image}
        <button onClick={this.handleWorkOrderCompleted}>Completed</button>
        <button onClick={this.handleBackButton}>Back</button>
      </Auxil>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWorkOrder: state.workOrders.currentWorkOrder
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateWorkOrder: (currentWorkOrderId, status, remind) =>
      dispatch(actions.updateWorkOrder(currentWorkOrderId, status, remind))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditWorkOrder)
);
