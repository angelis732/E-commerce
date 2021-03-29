import React, { useEffect } from 'react';
import './ViewOrder.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsCart, deleteTotalCart, removeFromCartLS, editQuantity, deleteItem } from '../../actions/cartAction.js';
import PayCart from '../PayCart/PayCart.jsx';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";



export default function ViewOrder() {
    const dispatch = useDispatch();
    const  MySwal  =  withReactContent (Swal);

    const user = useSelector(store => store.auth.userInfo);

    let cartProduct = useSelector(user ? (store => store.product.cart) : (store => store.cart.cartItems));

    useEffect(function () {
        dispatch(getProductsCart(user ? { userId: user.id, state: "carrito" } : null));
    }, [dispatch, user])

    let priceList = [];
    function totalHandler() {
        if (priceList.length > 0) {
            let total = 0;
            for (let i = 0; i < priceList.length; i++) {
                total += priceList[i]
            }
            return total
        }
        return 0
    }
    function deleteItems(data) {
        dispatch(deleteItem(data))
    }

    function deleteCart() {
        if (cartProduct.length >= 0 && cartProduct[0] !== undefined) {
            let idOrder = cartProduct[0].orderId;
            let idUser = user.id;
    
            MySwal.fire({
                title: '¿Estas seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1B9528',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                customClass:{
                    title: "alertTitle",
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(deleteTotalCart({ userId: idUser, orderId: idOrder }))
                }
            })
        } else {
            MySwal.fire({
                position: 'top-center',
                icon: 'info',
                width: "24rem",
                title: 'No hay elementos para borrar',
                showConfirmButton: false,
                timer: 1000,
                customClass:{
                    title: "alertTitle"
                }
            }).then(() =>{} )
        }
    }
    
    function deleteLS() {
        localStorage.clear();
        dispatch(removeFromCartLS(cartProduct))
    }
    
    function sumar(data) {
        if (data.userId && data.orderId) {

            let idProd = data.id;
            let idUsr = data.userId;
            let orderId = data.orderId
            let qty = data.quantity + 1
            dispatch(editQuantity({ idUser: idUsr, productId: idProd, quantity: qty, orderId }))
        } else {

            let idProd = data.id;
            let qty = data.quantity + 1
            dispatch(editQuantity({ productId: idProd, quantity: qty }))
        }


    } function restar(data) {

        if (data.userId && data.orderId) {
            if (data.quantity > 0) {
                let idProd = data.id;
                let idUsr = data.userId;
                let orderId = data.orderId
                let qty = data.quantity - 1
                dispatch(editQuantity({ idUser: idUsr, productId: idProd, quantity: qty, orderId }))
            }
        } else {
            if (data.quantity > 0) {
                let idProd = data.id;
                let qty = data.quantity - 1
                dispatch(editQuantity({ productId: idProd, quantity: qty }))
            }
        }
    }

    
    return (
        <div className="contain" >
            <div className="titulo">
                <h2>Pedidos de tu carrito</h2>
                <div className="soporte">
                    <button className="borrar" onClick={!user ? () => deleteLS() : () => deleteCart()}> Vaciar carrito </button>
                </div>
                <div className="parte-uno">
                    {cartProduct && cartProduct.map((info) => {
                        if (info !== undefined) {
                            let subTot;
                            subTot = info.price * info.quantity;
                            priceList.push(subTot);
                        }
                        return (

                            <div>
                                { info.name ?
                                    <div className="abc" >
                                        <div className="foto" >
                                            <img className="img-responsive" src={info.images ? info.images[0].url : null} alt="Cargando imagen..." />
                                        </div>
                                        <div className="datoName" >
                                            <div className="datoName2">
                                                <h5 className="x">{info.name}</h5>
                                            </div>
                                        </div>
                                        <div className="add" >
                                            <div className="dataAdd">
                                                <button onClick={() => restar(info)}><i className="fas fa-minus" /></button>
                                            </div>
                                        </div>
                                        <div className="dataQuanty" >
                                            <div className="dataQuanty2">
                                                <h5 className="xd">{info.quantity}</h5>
                                            </div>
                                        </div>
                                        <div className="add" >
                                            <div className="dataAdd">
                                                <button onClick={() => sumar(info)}><i className="fas fa-plus" /></button>
                                            </div>
                                        </div>
                                        <div className="dataPrice" >
                                            <div>
                                                <h5 className="xd">$ {info.price}</h5>
                                            </div>
                                        </div>
                                        <div className="dataPrice" >
                                            <div>
                                                <h5 className="xd">$ {info.price * info.quantity}  </h5>
                                            </div>
                                        </div>
                                        <div className="add" >
                                            <div className="dataAdd">
                                                <button onClick={() => deleteItems(info)}><i className="far fa-trash-alt" /></button>
                                            </div>
                                        </div>
                                    </div >
                                    : null
                                }
                            </div>
                        )

                    })}
                </div>
                <br />
            <div className="parte-dos">
                <PayCart dato={totalHandler().toFixed(2)} dato2={cartProduct} dato3={user}/>
            </div>
            </div>
        </div>
    )

};
