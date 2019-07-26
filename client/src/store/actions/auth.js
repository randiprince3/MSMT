import axios from "axios";
import * as actionTypes from "./actionTypes";
import history from "../../history";

// puts the info of the user that is logged in into Redux
export const authSuccess = (username, password, phoneNumber, id) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    username: username,
    password: password,
    phoneNumber: phoneNumber,
    userId: id
  };
};

export const authLogout = (username, password, phoneNumber) => {
  //removes data from the local storage
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  return {
    //changes these to null in the store
    type: actionTypes.AUTH_LOGOUT,
    username: username,
    password: password,
    phoneNumber: phoneNumber
  };
};

//error message comes from passport
export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

// **WARNING - incoming long lines of code~~~~~!!!~!~!~!~!~
export const auth = (username, password, query, phoneNumber, userType) => {
  let userId;
  return dispatch => {
    const authData = {
      username: username,
      password: password,
      phoneNumber: phoneNumber,
      userType: userType
    };

    // url route depends on whether the user is logging in, or signing up
    let url = query;

    axios
      .post(url, authData)

      .then(response => {
        console.log(response.data);
        //puts user information into local storage after authentication
        if (url === "/login" && response.data.username) {
          localStorage.setItem("token", response.data.password);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("userId", response.data.id);
        }

        //if there is no response, it will dispatch a failure (see below)
        if (response.data.username && url === "/login") {
          userId = response.data.id;
          dispatch(
            authSuccess(
              response.data.username,
              response.data.password,
              response.data.phoneNumber,
              userId,
              response.data.userType
            )
          );

          dispatch(authfetchUserPermissions(userId));
          history.replace("/dashboard");
          //this block of code below sets up user permissions when an account is created
          // first checks if the user is registering
        } else {
          //response.data.message is given to us from passport
          dispatch(authFail(response.data.message));
        }

        if (url === "/signup") {
          //grabs the userID of the authenticated user
          let userPermissionsData = {
            UserinfoId: response.data.id
          };

          //grabs the userType (admin, supervisor, user, etc)
          const userType = response.data.userType;

          //looks in the UserTypes table to grab the specific permissions based on the userType
          axios.get("/api/usertypes/" + userType).then(response => {
            //once we have the permissions, we add it to the userPermissionsData object above
            console.log(response.data);
            userPermissionsData.PermissionId = response.data.defaultPermissions;
            console.log(response.data);
            //and then we post it to the userPermissions table
            axios.post("/api/userpermissions", userPermissionsData);
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};

export const authfetchUserPermissions = userId => {
  return dispatch => {
    const url = "/api/userpermissions/" + userId;
    axios.get(url).then(response => {
      console.log(response.data);
      dispatch(
        authGetUserPermissions(
          response.data.userPermissions,
          response.data.userType
        )
      );
    });
  };
};

//this automatically logs a user in by checking local storage
//allows for persistent login (i.e. if the browser is closed)
export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token || token == null) {
      dispatch(authLogout());
    } else {
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");

      dispatch(authSuccess(username, token, null, userId));
    }
  };
};

export const authGetUserPermissions = (userPermissions, userType) => {
  return {
    type: actionTypes.AUTH_GET_USER_PERMISSIONS,
    userPermissions: userPermissions,
    userType: userType
  };
};
