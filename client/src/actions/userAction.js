import axios from 'axios';
import decode from "jwt-decode";

import {
    POST_USER, ADD_TO_CART, LOGIN_USER, LOGOUT_USER,
    USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, GET_USER, UPDATE_USER,
    UPDATE_PROMOTE, GET_USER_BY_ID, UPDATE_PASSWORD, POST_RESERT_PASSWORD,
    FORGOT_PASSWORD, POST_USER_FAILED, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_SUCCESS, DELETE_CART_LS
} from '../constants/productConstants.js';

export const getUsers = () => async (dispatch, getState) => {
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
        const respuesta = await axios.get('/users/');
        dispatch({
            type: GET_USER,
            payload: respuesta.data
        });
    } catch (error) {
        console.log("Error: " + error)
    }
}

export const bloquearUsers = ({ id }) => async (dispatch, getState) => {
    if (id) {
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

        const users = getState().product.user.slice();

        try {
            const res = await axios.put(`/auth/${id}/banned`);

            users && users.forEach((x) => {
                if (x.id === id && x.banned === false) {
                    x.banned = true;
                }
            });

            dispatch({
                type: UPDATE_USER,
                payload: res.data
            });

        } catch (error) {
            console.log("Error: " + error)
        }
    }
}


export const desbloquearUsers = ({ id }) => async (dispatch, getState) => {
    if (id) {
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
        const users = getState().product.user.slice();

        try {
            const res = await axios.put(`/auth/${id}/banned`);

            users && users.forEach((x) => {
                if (x.id === id && x.banned === true) {
                    x.banned = false;
                }
            });

            dispatch({
                type: UPDATE_USER,
                payload: res.data
            });

        } catch (error) {
            console.log("Error: " + error)
        }
    }
}


export const updateToAdmin = ({ id }) => async (dispatch, getState) => {

    if (id) {
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
        const users = getState().product.user.slice();

        try {
            await axios.put(`/auth/promote/${id}`);

            users && users.forEach((x) => {

                if (x.id === id && x.rol !== "admin") {
                    x.rol = "admin";
                }
            });

            dispatch({
                type: UPDATE_PROMOTE,
                payload: users
            });
        } catch (error) {
            console.log("Error: " + error)
        }
    }
}
export const updateToUsers = ({ id }) => async (dispatch, getState) => {

    if (id) {
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
        const users = getState().product.user.slice();
        try {
            await axios.put(`/auth/demote/${id}`);
            users && users.forEach((x) => {
                if (x.id === id && x.rol === "admin") {
                    x.rol = "User";
                }
            });

            dispatch({
                type: UPDATE_PROMOTE,
                payload: users
            });
        } catch (error) {
            console.log("Error: " + error)
        }
    }
}

export const postResertPassword = ({ id }) => async (dispatch, getState) => {

    const users = getState().product.user.slice();
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

        await axios.post(`/auth/${id}/forceReset/`);

        dispatch({
            type: POST_RESERT_PASSWORD,
            payload: users
        });

    } catch (error) {
        console.log("Error: " + error)
    }
}
async function productsMove(cartItems, idUser, getState, dispatch) {

    let products = JSON.parse(localStorage.getItem("cartItems"));
    if (products && products.length > 0) {
        const cartItems = products;

        for (let i = 0; i < cartItems.length; i++) {

            const prod = await axios.get(`/products/${cartItems[i].id}`);
            const res = await axios.post(`/users/${idUser}/order`, { productId: cartItems[i].id, price: prod.data.price, quantity: cartItems[i].quantity });

            let order = {
                description: prod.data.description, id: prod.data.id,
                images: prod.data.images, name: prod.data.name,
                price: prod.data.price, quantity: res.quantity, userId: res.userId,
                orderId: res.id
            }
            dispatch({
                type: ADD_TO_CART,
                payload: order
            });
            localStorage.removeItem('cartItems')
        }
    }
}
export const postUser = (data) => async (dispatch, getState) => {
    try {
        const response = await axios.post('/users/', data);


        dispatch({
            type: POST_USER,
            payload: response.data
        })
        if (getState().cart.cartItems.length > 0) {
            const cartItems = getState().cart.cartItems;

            for (let i = 0; i < cartItems.length; i++) {

                const prod = await axios.get(`/products/${cartItems[i].id}`)
                const res = await axios.post(`/users/${response.data.user.id}/order`, { productId: cartItems[i].id, price: prod.data.price, quantity: cartItems[i].quantity });
                let order = {
                    description: prod.data.description, id: prod.data.id,
                    images: prod.data.images, name: prod.data.name,
                    price: prod.data.price, quantity: res.quantity, userId: res.userId,
                    orderId: res.id
                }
                dispatch({
                    type: ADD_TO_CART,
                    payload: order
                });
                localStorage.removeItem('cartItems')
            }
        }
    } catch (error) {
        dispatch({
            type: POST_USER_FAILED,
            payload: error.response || error.response.data
        })

    }

}

export const loginUser = (email, password, getState) => {
    return function (dispatch) {
        dispatch({ type: LOGIN_USER, payload: { email, password } });
        return axios.post('/auth/login', { email, password })
            .then(res => {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data })
                localStorage.setItem('data', res.data);
                let productsStorage = localStorage.getItem('cartItems')
                let idUser = decode(localStorage.getItem('data')).id
                productsMove(productsStorage, idUser, getState, dispatch);
            })
            .catch(error => {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
                })
            })
    }
}
export const loginUserGoogle = (data, getState) => {
    return function (dispatch) {
        return axios.post(`/auth/google/redirect${data}`)
            .then(res => {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data })
                localStorage.setItem('data', res.data);
                let productsStorage = localStorage.getItem('cartItems')
                let idUser = decode(localStorage.getItem('data')).id
                productsMove(productsStorage, idUser, getState, dispatch);
            })
            .catch(error => {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
                })
            })
    }
}

export const loginUserFacebook = (data, getState) => {
    return function (dispatch) {
        return axios.post(`/auth/facebook/callback${data}`)
            .then(res => {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data })
                localStorage.setItem('data', res.data);
                let productsStorage = localStorage.getItem('cartItems')
                let idUser = decode(localStorage.getItem('data')).id
                productsMove(productsStorage, idUser, getState, dispatch);
            })
            .catch(error => {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    payload: error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
                })
            })
    }
}


export const logoutUser = () => (dispatch) => {
    localStorage.clear();
    dispatch({ type: LOGOUT_USER })
    dispatch({ type: DELETE_CART_LS })
}

export const getUserById = (id) => async (dispatch, getState) => {
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
        const respuesta = await axios.get(`/users/${id}`);
        dispatch({
            type: GET_USER_BY_ID,
            payload: respuesta.data
        });
    } catch (error) {
        console.log("Error: " + error)
    }
}
export const updatePassword = user => async (dispatch, getState) => {
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
        let answer = await axios.put(`/users/passwordReset/${user.id}`, user);
        dispatch({
            type: UPDATE_PASSWORD,
            payload: answer.data
        });
    } catch (error) {
        console.log("Error" + error)
    }
}

export const forgotPassword = email => async (dispatch, getState) => {
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
        dispatch({
            type: FORGOT_PASSWORD
        })
        let answer = await axios.post(`/users/forgot`, email);
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: answer.data
        });
    }catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response || error.response.data
        })
}
}





