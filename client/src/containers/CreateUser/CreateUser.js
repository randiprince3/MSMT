import React, { Component } from "react";
import Auxil from "../../hoc/Auxil";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { reset } from "redux-form";
import { withRouter } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";

class CreateUser extends Component {
  createUserClick = values => {
    this.props.onAuth(
      values.username,
      values.password,
      "/signup",
      values.phoneNumber,
      values.userType.value
    );

    this.props.resetAuthForm();
  };

  render() {
    let errorMessage = null;

    //the eror message is provided to us from passport.js (through redux)
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }

    return (
      <Auxil>
        <AuthForm
          isSignup={true}
          userId={this.props.userId}
          userPermissions={this.props.userPermissions}
          authClick={this.createUserClick}
          isAuth={this.props.isAuth}
        />
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
    onAuth: (username, password, query, phoneNumber, userType) =>
      dispatch(actions.auth(username, password, query, phoneNumber, userType))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateUser)
);
