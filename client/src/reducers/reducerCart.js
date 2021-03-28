import { ADD_TO_CART_LOCALSTORAGE, GET_PRODUCT_CART_LOCALSTORAGE, DELETE_CART_LS, DELETE_ITEM_LC } from "../constants/productConstants";



export default (
  state = { cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]") }, action) => {
  switch (action.type) {
    case ADD_TO_CART_LOCALSTORAGE:
      return { cartItems: action.payload.cartItems };

    case GET_PRODUCT_CART_LOCALSTORAGE:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      }
    case DELETE_CART_LS:
      return {
        ...state,
        cartItems: []
      }
    case DELETE_ITEM_LC:
      return {
        cartItems: action.payload.cartItems
      };

    default:
      return state;
  }
};
