import React, { Component } from "react";
import Auxil from "../Auxil";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { withRouter } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar.js";
import ChatPlatform from "../../components/ChatPlatform/ChatPlatform";
class Layout extends Component {
  authLogout = () => {
    if (this.props.username) {
      this.props.logOut();
    }
  };

  //toggles whether the employee is signing up or logging in
  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    });
  };

  render() {
    return (
      <div>
        <NavBar
          isAuth={this.props.isAuth}
          userId={this.props.userId}
          userPermissions={this.props.userPermissions}
          authLogout={this.authLogout}
          userType={this.props.userType}
        />

        <Auxil>
          <main>{this.props.children}</main>
        </Auxil>
        {this.props.isAuth ? <ChatPlatform /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    isAuth: state.auth.password !== null,
    error: state.auth.error,
    userPermissions: state.auth.userPermissions,
    userType: state.auth.userType,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password, phoneNumber, userType, isSignup) =>
      dispatch(
        actions.auth(username, password, phoneNumber, userType, isSignup)
      ),
    logOut: () => dispatch(actions.authLogout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Layout)
);
