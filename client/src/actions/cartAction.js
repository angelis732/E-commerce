import axios from 'axios';
import  Swal  from  'sweetalert2';
import  withReactContent  from  'sweetalert2-react-content';
import {
    ADD_TO_CART, ADD_TO_CART_LOCALSTORAGE,
    GET_PRODUCT_CART, DELETE_TOTAL_CART,
    DELETE_ITEMS_CART, DELETE_CART_LS,
    DELETE_ITEM_LC, UPDATE_COUNT_PRODUCT
} from '../constants/productConstants.js';



export const addProductCart = (data) => async (dispatch, getState) => {
    const  MySwal  =  withReactContent (Swal);
    if (!data.userId) {

        const res = await axios.get(`/products/${data.productId}`)
        const cartItems = getState().cart.cartItems.slice();
        let alreadyExists = false;
        

        cartItems && cartItems.forEach((x) => {

            if (x.id === data.productId) {
                alreadyExists = true;
                MySwal.fire({
                    position: 'top-end',
                    icon: 'info',
                    width: "24rem",
                    title: 'El producto ya se encuentra en el carrito',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass:{
                        title: "alertTitle"
                    }
                }).then(() =>{} )
            }
        });

        if (!alreadyExists) {
            let existe = {
                id: data.productId,
                quantity: data.quantity,
                description: res.data.description,
                name: res.data.name,
                price: res.data.price,
                images: res.data.images
            }
            if (existe !== undefined) {
                cartItems.push(existe);
                MySwal.fire({
                    position: 'top-end',
                    icon: 'success',
                    width: "24rem",
                    title: `El producto ${existe.name} fue agregado al carrito`,
                    showConfirmButton: false,
                    timer: 1500,
                    customClass:{
                        title: "alertTitle"
                    }
                }).then(() =>{} )
            }
        }

        dispatch({
            type: ADD_TO_CART_LOCALSTORAGE,
            payload: { cartItems }
        })

        localStorage.setItem("cartItems", JSON.stringify(cartItems))

    } else {
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

            const cart = getState().product.cart.slice();
            cart && cart.forEach((x) => {

                if (x.id === data.productId) {
                
                }
            });
            const res = await axios.post(`/users/${data.userId}/order`, data);

            const prod = await axios.get(`/products/${res.data.productId}`)
            let order = {
                description: prod.data.description, id: prod.data.id,
                images: prod.data.images, name: prod.data.name,
                price: prod.data.price, quantity: res.quantity, userId: res.userId,
                orderId: res.id
            }
            MySwal.fire({
                position: 'top-end',
                icon: 'success',
                width: "24rem",
                title: `El producto ${order.name} fue agregado al carrito`,
                showConfirmButton: false,
                timer: 1500,
                customClass:{
                    title: "alertTitle"
                }
            }).then(r =>{} )
            dispatch({
                type: ADD_TO_CART,
                payload: order
            });
        } catch (error) {
            MySwal.fire({
                position: 'top-end',
                icon: 'info',
                width: "24rem",
                title: 'El producto ya se encuentra en el carrito',
                showConfirmButton: false,
                timer: 1500,
                customClass:{
                    title: "alertTitle"
                }
            }).then(r =>{} )
            console.log("Error: " + error);
        }
    }
};


export const getProductsCart = (data) => async (dispatch, getState) => {

    if (data) {
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

        try {
            let orderProd = [];
            let order;
            const res = await axios.get(`/users/${data.userId}/order/${data.state}`);
            const valor = res.data;
            for (let i = 0; i < valor.length; i++) {
                let dato1 = valor[i].quantity;
                let userId = data.userId;
                let orderId = valor[i].orderId
                let dataProd = await axios.get(`/products/${valor[i].productId}`)
                order = {
                    description: dataProd.data.description, id: dataProd.data.id,
                    images: dataProd.data.images, name: dataProd.data.name,
                    price: dataProd.data.price, quantity: dato1, userId: userId,
                    orderId: orderId
                }
                orderProd.push(order)
            }

            dispatch({
                type: GET_PRODUCT_CART,
                payload: orderProd,
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    }

}

export const deleteTotalCart = (data) => async (dispatch, getState) => {


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
    const Details = await axios.get(`/users/${data.userId}/order/${"carrito"}`);
    Details.data && Details.data.map((det) => {
       return axios.delete(`/orders/${data.orderId}/${det.productId}`)
            .then(() => {
                dispatch({
                    type: DELETE_ITEMS_CART,
                    payload: det.productId
                });
            })
    })
    await axios.delete(`/users/${data.userId}/order/${data.orderId}`)
    dispatch({
        type: DELETE_TOTAL_CART,
        payload: data.orderId
    });

}
export const removeFromCartLS = (product) => dispatch => {
    dispatch({ type: DELETE_CART_LS, payload: product });

};
export const deleteItem = (data) => async (dispatch, getState) => {
    if (data.orderId) {
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
     await axios.delete(`/orders/${data.orderId}/${data.id}`)
        dispatch({
            type: DELETE_ITEMS_CART,
            payload: data.id
        })
    } else {
        const cartItems = getState().cart.cartItems.slice().filter((x) => x.id !== data.id);
        dispatch({ type: DELETE_ITEM_LC, payload: { cartItems } });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

}
export const editQuantity = ({ idUser, productId, quantity, orderId }) => async (dispatch, getState) => {
    if (orderId && idUser) {
        let orderBody = { productId, quantity, orderId }
        const cart = getState().product.cart.slice();
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
          await axios.put(`/orders/${idUser}/cart`, orderBody);

            cart && cart.forEach((x) => {

                if (x.id === productId) {
                    x.quantity = quantity;
                }
            });
            dispatch({
                type: UPDATE_COUNT_PRODUCT,
                payload: cart
            });
        } catch (error) {
            console.log("Error: " + error);
        }
    } else {
        const cartItems = getState().cart.cartItems.slice();
        cartItems && cartItems.forEach((x) => {

            if (x.id === productId) {
                x.quantity = quantity;
            }
        });
        dispatch({
            type: ADD_TO_CART_LOCALSTORAGE,
            payload: { cartItems }
        })
    }

}
