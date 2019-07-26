import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  username: null,
  userId: null,
  password: null,
  phoneNumber: null,
  userType: null,
  userPermissions: null
};

const authLogout = (state, action) => {
  return updateObject(state, { username: null, password: null, userId: null });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    username: action.username,
    password: action.password,
    userId: action.userId,
    phoneNumber: action.phoneNumber,
    userType: action.userType,
    error: null
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error
  });
};

const authGetUserPermissions = (state, action) => {
  return updateObject(state, {
    userPermissions: action.userPermissions,
    userType: action.userType
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.AUTH_GET_USER_PERMISSIONS:
      return authGetUserPermissions(state, action);

    default:
      return state;
  }
};

export default reducer;
