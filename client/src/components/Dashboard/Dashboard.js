import React from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { withRouter } from "react-router-dom";
import { Table } from "reactstrap";
import { Container, Row, Col, Button } from "reactstrap";
import "./Dashboard.css";

class Dashboard extends React.Component {
  state = {
    users: null
  };
  componentDidMount() {
    const query = "/api/workorders";
    this.props.renderWorkOrders(query);
  }

  render() {
    const user = localStorage.getItem("username");
    const d = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    const month = months[d.getMonth()];
    const day = days[d.getDay()];
    const date = d.getDate();
    const year = d.getFullYear();
    const hour = d.getHours();
    const minute = d.getMinutes();
    let dashboardData;
    if (!this.props.workOrders || !this.props.userId) {
      dashboardData = <h1> loading </h1>;
    } else {
      console.log(this.props.workOrders);
      dashboardData = this.props.workOrders.map(tableRow => {
        if (
          tableRow.workOrderAssignment &&
          tableRow.workOrderAssignment.UserinfoId ===
            parseInt(this.props.userId, 10)
        ) {
          return (
            <tr>
              <td>{tableRow.id}</td>
              <td>{tableRow.title}</td>
              <td>{tableRow.category}</td>
              <td>{tableRow.location}</td>
              <td>{tableRow.status}</td>
            </tr>
          );
        }
      });
    }
    return (
      <Container>
        <Row xs="auto" />
        <Row>
          <Col xs="auto" className="Table">
            <div className="Greeting">
              <h2>Welcome back {user}!</h2>
              <p>
                Today is {day}, {month}/{date}/{year} and it is currently {hour}
                :{minute}
              </p>
              <p>You have the following items on your to-do list today:</p>
            </div>
            <Table hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{dashboardData}</tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    workOrders: state.workOrders.workOrders
  };
};

const mapDispatchToProps = dispatch => {
  return {
    renderWorkOrders: query => dispatch(actions.renderWorkOrders(query))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
