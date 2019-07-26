import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { reset } from "redux-form";
import { withRouter } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";

class Auth extends Component {
  // this state gets toggled when the CREATE USER button clicked
  // (see component => AuthForm => AuthForm)

  //what happens when an employee clicks "submit"
  loginClick = values => {
    this.props.onAuth(values.username, values.password, "/login");
    this.props.resetAuthForm();
  };

  handleCreateUser = () => {
    this.props.history.replace("/signup");
  };

  handleCreateUser;

  render() {
    let errorMessage = null;

    //the eror message is provided to us from passport.js (through redux)
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    let createUsersButton;

    return (
      <Auxil>
        <AuthForm
          userId={this.props.userId}
          userPermissions={this.props.userPermissions}
          authClick={this.loginClick}
          isAuth={this.props.isAuth}
        />
        {createUsersButton}
        {errorMessage}
      </Auxil>
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
    resetAuthForm: () => dispatch(reset("AuthForm")),
    onAuth: (username, password, query) =>
      dispatch(actions.auth(username, password, query))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Auth)
);
