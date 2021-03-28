import axios from 'axios';

import {
    DELETE_CATEGORY, UPDATE_CATEGORY, POST_CATEGORY, GET_PRODUCT_BY_CATEGORY, GET_PRODUCT_BY_ID, GET_CATEGORIES,
    SEARCH_PRODUCT, GET_PRODUCTS, DELETE_PRODUCT, POST_PRODUCT
} from '../constants/productConstants.js';

if(localStorage.getItem('data')){
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
export const getProductById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/products/${id}`);
        dispatch({
            type: GET_PRODUCT_BY_ID,
            payload: res.data
        });
    } catch (error) {
        console.log("Error: " + error);
    }
};

export const getProducts = () => async (dispatch) => {
    try {
        const respuesta = await axios.get('/products/');
        dispatch({
            type: GET_PRODUCTS,
            payload: respuesta.data
        });
    } catch (error) {
        console.log("Error: " + error)
    }
}

export function getProductByCategory(categoryName) {
    return function (dispatch) {
        return axios.get(`/products/category/${categoryName}`)
            .then(products => {
                dispatch({ type: GET_PRODUCT_BY_CATEGORY, payload: products.data });
            })
            .catch(err => console.log(err))
    };
}

export const insertCategory = (category) => async dispatch => {
    const response = await axios.post(`/products/category/`, category);
    dispatch({
        type: POST_CATEGORY,
        payload: response.data
    });
}


export function getCategories() {
    return function (dispatch) {
        return axios.get('/products/categories')
            .then(categories => {
                dispatch({ type: GET_CATEGORIES, payload: categories.data });
            });
    };
}

export const deleteCategory = (id) => async dispatch => {
    await axios.delete(`/products/category/${id}`);
    dispatch({
        type: DELETE_CATEGORY,
        payload: id
    });

}

export const editCategory = category => async dispatch => {
    try {
        let answer = await axios.put(`/products/category/${category.id}`, category);
        dispatch({
            type: UPDATE_CATEGORY,
            payload: answer.data
        });
    } catch (error) {
        console.log("Error" + error)
    }
}

export const searchProduct = (name) => async (dispatch) => {
    try {
        const resp = await axios.get(`/products/search?value=${name}`);
        dispatch({
            type: SEARCH_PRODUCT,
            payload: resp.data
        });
    } catch (error) {
        console.log("Error: " + error)
    }
}
export const deleteProduct = (id) => async dispatch => {
    await axios.delete(`/products/${id}`);
    const categories = await axios.get(`/products/${id}/categories/`);
    if (categories) {
        categories.map((categorie) => {
           return axios.delete(`/products/${id}/category/${categorie.id}`)
                .then(() => {
                    dispatch({
                        type: DELETE_PRODUCT,
                        payload: id
                    });
                })
        })
    }
}
export const insertProduct = (datos) => async dispatch => {
    const response = await axios.post('/products/', datos.product);
    datos.cate.map((category) => {
       return axios.post(`/products/${response.data.id}/category/${category}`)
            .then((responseProdCat) => {
                dispatch({
                    type: POST_PRODUCT,
                    payload: responseProdCat.data
                });
            })
    })
}

export const editProduct = product => async dispatch => {
    await axios.put(`/products/${product.id}`, product);
    const categories = await axios.get(`/products/${product.id}/categories/`);
    
    if (categories) {
        for (let i = 0; i < categories.data.length; i++) {
           await axios.delete(`/products/${product.id}/category/${categories.data[i].id}`)

        }
    }
    for (let i = 0; i < product.categories.length; i++) {
        await axios.post(`/products/${product.id}/category/${product.categories[i].id}`)
    }
}
