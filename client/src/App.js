import React, { Component } from "react";
import Layout from "./hoc/Layout/Layout";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./containers/Login/Login";
import WorkOrder from "./containers/WorkOrder/WorkOrder";
import Guest from "./containers/Guest/Guest";
import WorkOrderList from "./containers/WorkOrderList/WorkOrderList";
import EditWorkOrder from "./containers/EditWorkOrder/EditWorkOrder";
import WorkOrderSuccess from "./containers/WorkOrderSuccess/WorkOrderSuccess";
import * as actions from "./store/actions/index";
import CreateUser from "./containers/CreateUser/CreateUser";
import Dashboard from "./components/Dashboard/Dashboard";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    if (this.props.userId) {
      this.props.authfetchUserPermissions(this.props.userId);
    }

    return (
      <div>
        <Layout>
          <Route path="/" exact component={Login} />
          <Route path="/guest" exact component={Guest} />
          <Route path="/create" exact component={WorkOrder} />
          <Route path="/workorders" exact component={WorkOrderList} />
          <Route path="/success" exact component={WorkOrderSuccess} />
          <Route path="/edit" exact component={EditWorkOrder} />
          <Route path="/signup" exact component={CreateUser} />
          <Route path="/dashboard" exact component={Dashboard} />
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.password !== null,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    authfetchUserPermissions: userId =>
      dispatch(actions.authfetchUserPermissions(userId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
