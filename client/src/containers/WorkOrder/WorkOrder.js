import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reset } from "redux-form";
import { Container, Row, Col, Button } from "reactstrap";
import WorkOrderForm from "../../components/WorkOrderForm/WorkOrderForm";
import "./WorkOrder.css";
import CameraApp from "../../components/CameraApp/CameraApp";

class WorkOrder extends Component {
  state = {
    dataUri: null
  };

  onTakePhoto = dataUri => {
    this.setState({ dataUri: dataUri });
  };

  // sends work order data to SQL via Sequelize
  // if no employee is logged in, the userID is, by default, set to nothing
  // otherwise, it grabs the userID via Redux (via mapStateToProps)

  workOrderSubmit = value => {
    let dataUri = this.state.dataUri;
    let urgent = false;
    let remind = false;
    const url = "/api/workorders";

    if (value.urgent) {
      urgent = true;
      remind = true;
    }

    const workOrderData = {
      title: value.title,
      category: value.category,
      location: value.location,
      pictureDataUri: dataUri,
      urgent: urgent,
      remind: remind,
      status: "pending"
    };

    let userID;

    if (this.props.userID) {
      userID = this.props.userID;
    }

    workOrderData.UserinfoId = userID;

    axios(url, {
      method: "POST",
      data: workOrderData
    })
      .then(response => {
        this.props.resetWorkOrderForm();

        this.props.history.replace("/success");
      })
      .catch(error => {
        throw error;
      });
  };

  handleBackButton = () => {
    this.props.history.replace("/workorders");
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs="auto" className="workOrderForm">
            <WorkOrderForm
              handleBackButton={this.HandleBackButton}
              workOrderSubmit={this.workOrderSubmit}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="auto" className="Camera">
            <CameraApp onTakePhoto={this.onTakePhoto} />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    userID: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetWorkOrderForm: () => dispatch(reset("workOrderForm"))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkOrder)
);
