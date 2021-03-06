import React, {useEffect} from 'react';
import style from './product.module.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import {getProductById} from '../../actions/productActions.js';
import {addProductCart} from '../../actions/cartAction';
import {getUsers} from '../../actions/userAction';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import Review from '../Review/Review';

function Product(props) {
    const [quantity, setQuantity] = React.useState(1)

    useEffect(() => {
        props.getProductById(props.id);
    }, [])

    let imageUrl;
    if (props.product.images) {
        imageUrl = props.product.images[0].url;
    }

    function Promedio() {
        if (props.product.Reviews) {

            let suma = 0
            let promedio = 0;
            for (let i = 0; i < props.product.Reviews.length; i++) {
                suma = (suma + parseInt(props.product.Reviews[i].rate))
                promedio = suma / props.product.Reviews.length
            }
          return Math.round(promedio);
        }
    }

    let valor = Promedio();

    function ratePromedio(valor) {
  
  
      if (valor === 1) {
        return (
          <>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
      
          </>
    
        )
      } else if (valor === 2) {
        return (
          <>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </>
    
        )
      } else if (valor === 3) {
        return (
          <>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </>
    
        )
      } else if (valor === 4) {
        return (
          <>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
          </>)
    
      } else if (valor === 5) {
        return (
          <>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </>
    
        )
      } else {
        return (
          <>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </>
        )
      }

    }

    const user = props.user;
    
    function handleClick (data){
        props.addProductCart(
          user ? {
            userId:user.id,
            productId: data.id,
            price: data.price,
             quantity: quantity
          }
            : {
            productId: data.id,
            price: data.price,
            quantity:quantity
          }
        )
    }
    
    function change(e) {
        setQuantity(e.target.value)
    }
    return (
        <div className={style.container}>
          <div className={style.container2}>
            
            <Link to={`/`}>
                <button className={style.arrow}>Volver</button>
            </Link>
            <div className={style.detail}>
                <div className={style.image}>
                    <img src={imageUrl} alt="Cargando imagen..." />
                </div>
                <div className={style.data}>
                    <h2>{props.product.name}</h2>
                    <div className={style.start}>
                        <h3 className={style.stars}>{ratePromedio(valor)}</h3>
                    </div>
                    <span className={style.price}>Precio:<strong> ${props.product.price}</strong></span>
                    <form className={style.quantity}>
                        <label className={style.quantityLabel} form="quantity">Cantidad:</label>
                        <select className={style.quantitySelect} name="quantity" id="quantity" onChange={change}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                        {props.product.stock < 1 ? <label className='agotado'>Producto Agotado</label> : <label className='stock'>Stock: {props.product.stock}</label>}
                    </form>
                    <div className="butt">
                        {props.product.stock > 0 || props.prodCart.find(x => x.id === props.id) ? <button className="btn btn-outline-dark" onClick={() => handleClick(props.product)}>Agregar a Carrito</button> : null}
                    </div>
                </div>
            </div>
                <p className={style.description}><strong>Descripci??n: </strong> {props.product.description}</p>
           
            <div className={style.review}>
              <h2>{props.product.Reviews && props.product.Reviews.length > 0 ? <h5 className={style.rese??as}><strong>Rese??as sobre el producto</strong></h5> : <h3 className={style.rese??as}>Este producto a??n no tiene rese??as</h3>}</h2>
                <div>
                    {props.product.Reviews && props.product.Reviews.map((review) => {
                        return (<>
                          <hr/>
                            <Review key={review.id} data={review} />
                        </>)
                    })}
                    <hr/>
                </div>
            </div>
          </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        product: state.product.product,
        user: state.auth.userInfo,
        prodCart: state.product.cart
    }
}

export default connect(mapStateToProps, { getProductById, addProductCart, getUsers })(Product);
