import {
  GET_ORDERS,
  GET_SPECIFIC_ORDER,
  UPDATE_STATE_ORDER,
  ALL_ORDERS_USER, STATES_ORDERS,
  ADDRESS_ORDER
} from '../constants/productConstants.js';


const initialState = {
  allOrders: [],
  order: [],
  user: [],
  ordersUser: [],
  states: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        allOrders: action.payload
      }

    case GET_SPECIFIC_ORDER:
      return {
        ...state,
        order: action.payload
      }

    case UPDATE_STATE_ORDER:
      return {
        ...state,
        order: action.payload
      }
    case ALL_ORDERS_USER:
      return {
        ...state,
        ordersUser: action.payload
      }
    case STATES_ORDERS:
      return {
        ...state,
        states: action.payload
      }

    case ADDRESS_ORDER:
      return {
        ...state,
        order: action.payload
      }

    default:
      return state;
  }
};
