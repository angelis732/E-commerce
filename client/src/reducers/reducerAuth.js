import {EDIT_DISCOUNT ,GET_DISCOUNT_ACTIVE,ADD_DISCOUNT, GET_DISCOUNT, LOGIN_USER, LOGOUT_USER, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS} from '../constants/productConstants.js';
import decode from "jwt-decode";


const initialState = {
  userInfo: localStorage.getItem("data") ? decode(localStorage.getItem("data")) : null,
  loading: false,
  error: "",
  isAuthenticated: localStorage.getItem("data")?true:false,
  loginFailed: false,

  discounts: [],
  discountEdit:{},
  discountAdd:{}
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        isAuthenticated:true
      }
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated:true,
        userInfo: decode(action.payload)
      }
    case USER_LOGIN_FAIL:
      return{
        ...state,
        loginFailed: true,
        loading: false,
        error: action.payload,
        isAuthenticated:false
      }
    case LOGOUT_USER:
      return { isAuthenticated:false}

      case GET_DISCOUNT:
      return {
        ...state,
        discounts: action.payload
      }

      case GET_DISCOUNT_ACTIVE:
      return {
        ...state,
        discounts: action.payload
      }
      case ADD_DISCOUNT:
        return {
          ...state,
          discountAdd: action.payload
        }
      case EDIT_DISCOUNT:
        return {
          ...state,
          discountEdit: action.payload
        }
        
    default:
      return state;
  }
};
