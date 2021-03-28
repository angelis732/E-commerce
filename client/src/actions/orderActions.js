import axios from "axios";
import { ALL_ORDERS_USER, GET_ORDERS, GET_SPECIFIC_ORDER, UPDATE_STATE_ORDER, MELI_CART, ADDRESS_ORDER } from "../constants/productConstants";



export function getAllOrders(state) {
  return function (dispatch, getState) {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    var url = "/orders";
    if (state) {
      url += `?state=${state}`
    }
    return axios.get(url)
      .then(orders => {
        dispatch({ type: GET_ORDERS, payload: orders.data });
      });
  };
}


export function getUserOrder(id) {
  return function (dispatch, getState) {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    return axios.get(`/orders/${id}`)
      .then(userOrders => {
        dispatch({ type: GET_SPECIFIC_ORDER, payload: userOrders.data });
      });
  };
};

export function updateStateOrder(orderId, state) {

  return function (dispatch, getState) {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    // console.log("este",orderId)
    return axios.put(`/orders/${orderId}`, { "state": state })
      .then(order => {
        dispatch({ type: UPDATE_STATE_ORDER, payload: order.data })
      });
  };
};

export function getOrdersUser(id) {
  return function (dispatch, getState) {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    return axios.get(`/users/${id}/orders`)
      .then(orders => {
        dispatch({ type: ALL_ORDERS_USER, payload: orders.data });
      });
  };
}

//-----------------------------MELI-----------------------------------//


export const meliPost = (data, orderId) => async (dispatch, getState) => {
  try {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    console.log(data)
    const algo = await axios.post(`/mercadopago/`, { carrito: data, orderId: orderId })

    // console.log("esto es la data de la ction",algo)

    window.location = algo.data.redirect

    dispatch({
      type: MELI_CART,
      payload: algo.data
    })
  } catch (err) {
    console.log("este es el bendito error", err)
  }
}

//***********action adress */

export const addressOrder = (orderId, direccion) => async (dispatch, getState) => {
  try {
    if (getState().auth.userInfo !== null) {
      const accessToken = localStorage.getItem('data')

      axios.interceptors.request.use(
        config => {
          config.headers.authorization = `Bearer ${accessToken}`;
          return config;
        },
        error => {
          return Promise.reject(error)
        }
      )
    }
    // console.log("action", direccion, orderId)
    const algo = await axios.put(`/orders/${orderId}/address/`, { address: direccion })

    //  console.log("esto es la data de la ction",algo)

    dispatch({
      type: ADDRESS_ORDER,
      payload: algo
    })
  } catch (err) {
    console.log("este es el bendito error", err)
  }

}
