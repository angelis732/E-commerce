import axios from "axios";
import {ADD_REVIEW, GET_ALL_REVIEWS_USER, GET_PRODUCTS_STATE_COMPLETE,  EDIT_REVIEW, DELETE_REVIEW} from "../constants/productConstants";


export const getProductStateComplete = (userId) => async (dispatch, getState) => {

    try {
        if(getState().auth.userInfo!==null){
            const accessToken = localStorage.getItem('data')
          
            axios.interceptors.request.use(
                config =>{
                    config.headers.authorization=`Bearer ${accessToken}`;
                    return config;
                },
                error =>{
                    return Promise.reject(error)
                }
            )
          }
        const products = await axios.get(`/users/${userId}/orders/complete`);

        // console.log("esto es products",products)
        let producto=[];// todos los productos con y sin review
 
        for(var i=0; i<products.data.length; i++){ //con esto accedo a las ordenes
            for(var j=0; j<products.data[i].products.length; j++){// accedo a los productos

                producto.push(products.data[i].products[j])//obtengo todos los productos en array
            }
        }
        
        // console.log('esto son todos los productos', producto)

        dispatch({
            type: GET_PRODUCTS_STATE_COMPLETE,
            payload: producto
        });

    } catch (error) {
        console.log("Error: " + error)
    }
}


export const getAllReviewsUser = (userId) => async (dispatch,getState) => {
    try {
        if(getState().auth.userInfo!==null){
            const accessToken = localStorage.getItem('data')
          
            axios.interceptors.request.use(
                config =>{
                    config.headers.authorization=`Bearer ${accessToken}`;
                    return config;
                },
                error =>{
                    return Promise.reject(error)
                }
            )
          }
        const products = await axios.get(`/users/${userId}/review`);

        // console.log('esto es productos con review:', products)

        dispatch({
            type: GET_ALL_REVIEWS_USER,
            payload: products.data
        });

    } catch (error) {
        console.log("Error: " + error)
    }
}


export const addReview = (productId,body) => async (dispatch,getState) => {
    try {
        if(getState().auth.userInfo!==null){
            const accessToken = localStorage.getItem('data')
          
            axios.interceptors.request.use(
                config =>{
                    config.headers.authorization=`Bearer ${accessToken}`;
                    return config;
                },
                error =>{
                    return Promise.reject(error)
                }
            )
          }
        const product = await axios.post(`/products/${productId}/review`,body);

        // console.log('esto es product de add review',product.data )

        dispatch({
            type: ADD_REVIEW,
            payload: product.data
        });

    } catch (error) {
        console.log("Error: " + error)
    }
}


export const editReview = (productId, reviewId, data) => async (dispatch,getState) => {
    try {
        if(getState().auth.userInfo!==null){
            const accessToken = localStorage.getItem('data')
          
            axios.interceptors.request.use(
                config =>{
                    config.headers.authorization=`Bearer ${accessToken}`;
                    return config;
                },
                error =>{
                    return Promise.reject(error)
                }
            )
          }
        const editar = await axios.put(`/products/${productId}/review/${reviewId}`,data);

        // console.log('esto es product de put review', editar)

        dispatch({
            type: EDIT_REVIEW,
            payload: editar
        });
// esto comentado, anda
    } catch (error) {
        console.log("Error: " + error)
    }
}


export const deleteReview = (productId, reviewId) => async (dispatch,getState) => {
    try {
        if(getState().auth.userInfo!==null){
            const accessToken = localStorage.getItem('data')
          
            axios.interceptors.request.use(
                config =>{
                    config.headers.authorization=`Bearer ${accessToken}`;
                    return config;
                },
                error =>{
                    return Promise.reject(error)
                }
            )
          }
        const eliminar = await axios.delete(`/products/${productId}/review/${reviewId}`);

        // console.log('este es delete', eliminar)

        dispatch({
            type: DELETE_REVIEW,
            payload: eliminar
        });

    } catch (error) {
        console.log("Error: " + error)
    }
}



// export const getAllReviewProduct = (productId) => async (dispatch) => {
//     try {
//         const reviewsProduct = await axios.get(`/products/${productId}/review`);

//         dispatch({
//             type: GET_ALL_REVIEW_PRODUCT,
//             payload: reviewsProduct
//         });

//     } catch (error) {
//         console.log("Error: " + error)
//     }
// }
