import React from 'react';
import styles from './productCard.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import noImage from '../../img/noImage.jpg';
import { addProductCart } from '../../actions/cartAction.js';



export default function ProductCard({ data }) {

    const dispatch = useDispatch();
    const user = useSelector(store => store.auth.userInfo)
  
    function handleClick (data){
        dispatch(addProductCart(user ?
          {
            userId:user.id,
            productId: data.id,
            price: data.price, quantity:1
          } :
          {
            productId: data.id,
            price: data.price,
            quantity:1}));
    }
    

    return (
        <div className={styles.card}  >
            <div>
                {data.images ? (
                    <img src={data.images[0].url} class="card-img-top"  alt="No se encontró la imagen"/>)
                    :
                    (<img src={noImage}  alt="Imagen no encontrada"/>)
                }
            </div>
            <div class={styles.cardbody}>
              <p className={styles.nameProduct}><strong>{data.name}</strong></p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong>Precio:</strong> {'$ ' + data.price}</li>
              <label id="stock" />
               {data.stock<1 ? <label className={styles.soldOut}>Producto Agotado</label> : <label/>}
            </ul>
            <div class="card-body">
              <button disabled={data.stock<1}  onClick={() => handleClick(data)}><i class = "fas fa-cart-plus"/></button>
              <Link to={`/products/detalle/${data.id}`}>
                <button ><i class="fas fa-plus"/></button>
              </Link>
            </div>
        </div>
    )
}

