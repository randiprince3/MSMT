import { updateObject } from "../utility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  workOrders: [],
  currentWorkOrder: null
};

const getWorkOrders = (state, action) => {
  return updateObject(state, {
    workOrders: action.workOrders
    //error: false
  });
};

const getCurrentWorkOrder = (state, action) => {
  return updateObject(state, {
    currentWorkOrder: action.currentWorkOrder
    //error: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_WORK_ORDERS:
      return getWorkOrders(state, action);
    case actionTypes.GET_CURRENT_WORK_ORDER:
      return getCurrentWorkOrder(state, action);
    default:
      return state;
  }
};

export default reducer;
