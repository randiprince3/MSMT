import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar/ProgressBar.js";

class WorkOrderSuccess extends Component {
  state = {
    percentage: 10
  };
  render() {
    return (
      <Auxil>
        <p> Sucess! Thank you for submitting work order </p>
        <ProgressBar percentage={this.state.percentage} />
      </Auxil>
    );
  }
}

export default withRouter(
  connect(
    null,
    null
  )(WorkOrderSuccess)
);
