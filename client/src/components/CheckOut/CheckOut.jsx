import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProductsCart } from "../../actions/cartAction"
import style from "./checkOut.module.scss"
import ML from "../../img/ML.jpeg"
import { addressOrder, getUserOrder, meliPost, updateStateOrder } from '../../actions/orderActions';
import { useHistory } from 'react-router';
import { getDiscountActive } from '../../actions/discountsActions';

export default function CheckOut() {
    const history= useHistory()
    const dispatch = useDispatch();
    const [descuento, setDescuento] = useState()
    const [percentage, setPercentage] = useState()
    const user = useSelector(store => store.auth.userInfo);
    const orderId= useSelector((store)=> store.orderStore.order.id)
    const order= useSelector((store)=> store.orderStore.order)
    const descuentos= useSelector((store)=> store.auth.discounts)
    const cartProduct = useSelector(store => store.product.cart );
  
    const[inputContact, setInputContact]= useState({
       telefono: "",
    })

    const [inputShipping, setInputShipping]= useState({
        provincia: "",
        ciudad:"",
        direccion: "",
        piso:"",
        comentarios:""
    })
    
    function ValidateInputContact(inputContact) {
        let errorContact = {};
        if(!inputContact.telefono){
        errorContact.telefono = '**Requiere un teléfono valido';
    }
    return errorContact;
}

function ValidateInputShipping(inputShipping) {
    
    let errorShipping = {};
    
    if (!inputShipping.provincia) {
        errorShipping.provincia = '**Requiere una provincia';
    }else if(!inputShipping.ciudad){
        errorShipping.ciudad = '**Requiere una ciudad';
    }else if(!inputShipping.direccion){
        errorShipping.direccion = '**Requiere una dirección';
    }else if(!inputShipping.piso){
        errorShipping.piso = '**Requiere un piso válido';
    }
    return errorShipping;
}

const [errorContact, setErrorContact] = useState({});
  const [errorShipping, setErrorShipping] = useState({});
  
  const [pasos, setPasos] = useState(1)
  const handlePasos = () => {
      setPasos(pasos + 1)
    }
    
    const handlePasosVolver = () => {
        setPasos(pasos - 1)
    }
    
    const handleInputChange = (e)=> {
        setInputContact({
            ...inputContact,
            [e.target.name]: e.target.value
        });
        setInputShipping({
            ...inputShipping,
            [e.target.name]: e.target.value
        });
        setErrorContact(ValidateInputContact ({
            ...inputContact,
            [e.target.name]: e.target.value
        }));
        setErrorShipping(ValidateInputShipping ({
            ...inputContact,
            [e.target.name]: e.target.value
        }));
    }
    
    useEffect(function () {
        dispatch(getProductsCart(user ? { userId: user.id, state: "carrito" } : null));
        dispatch(getDiscountActive());
    }, [dispatch, user])

    useEffect(()=>{
        if(cartProduct.length<1)return
        console.log(cartProduct)
        dispatch(getUserOrder(cartProduct[0].orderId))
    },[dispatch, cartProduct])
    
    
    const [carrito,setCarrito] = useState([])

    useEffect(()=>{
       if( order.products && order.products.length>0 ){
       let arr= order.products.map(product => {
           
           return { name: product.name, price: product.price, quantity: product.OrderDetails.quantity, porcentaje:percentage? percentage : 0}
        })
        setCarrito(arr)
    }
    },[order, percentage])
    
    function Meli() {
        console.log(carrito)
        dispatch( meliPost(carrito , orderId) )
        
    }
    
    const sumaTotal = useCallback(() => {
        if(cartProduct){
          let suma= 0
      
          for(let i=0; i<cartProduct.length; i++){
            suma= suma +( parseInt(cartProduct[i].price)* cartProduct[i].quantity)
          }
          return suma
        }
      }, [cartProduct])
    
  
    
    const [habitado, setHabilitado]= useState(false)
    
    function habilitarPago() {
        setHabilitado(true)
    }
    function cambio() {
        if (orderId) {
          let state = "procesando";
          dispatch(updateStateOrder( orderId, state ))
          
        }
    }
    
    let domicilio= `Provincia: ${inputShipping.provincia}, Ciudad/Localidad: ${inputShipping.ciudad}, Dirección de la calle: ${inputShipping.direccion}, Piso/N°: ${inputShipping.piso}, Comentarios: ${inputShipping.comentarios}, Teléfono: ${inputContact.telefono}`
    
    function addAddress() {
        dispatch(addressOrder(orderId, domicilio))
    }
    
    useEffect(()=>{
        if(descuentos === undefined || descuentos.length === 0) return
        let sum = sumaTotal()
        let filtro =descuentos.filter((e)=>e.mount <= sum)
        console.log("entra?", filtro,sum)
        if (filtro.length<1) return

        let mayor = filtro.sort((a, b)=> {
            if (a.mount < b.mount) {
                return 1;
            }
            if (a.mount > b.mount) {
                return -1;
            }
            return 0;
        })[0]
        setPercentage(mayor.percentage)
        setDescuento((mayor.percentage*sum)/100)
        
    },[descuentos, cartProduct, sumaTotal])
  
    function handleCosa() {
        cambio()
        Meli()
        addAddress()
}
return (
    <div >
        <form class="row g-3 needs-validation" onSubmit={(e)=> e.preventDefault()}>
            <div className={style.contenedorGrande}>
                <>
                    {pasos === 1 && (
                        <div className={style.grupo}>
                            <h3>Información Personal</h3>
                            <br />
                            <div >
                                <h6  class="form-label"> Usuario: {user.fullname} </h6>
                            </div>

                            <div >
                                <h6  class="form-label">Email: {user.email} </h6>
                            </div>
                            <div >
                                <h6 class="form-label">Teléfono</h6>
                                <input name="telefono"  value={inputContact.telefono} type="number"  class="form-control" required onChange={handleInputChange} />
                                
                            {errorContact.telefono && ( <p>{errorContact.telefono}</p> )}
                            </div>

                            <br />
                            <div className={style.botones}>
                                <button className={style.next} onClick={() => history.push("/user/order")}>Volver</button>
                               {
                               errorContact.telefono || inputContact.telefono===''? <button className={style.next} >Continuar</button>
                               :
                                <button className={style.next} onClick={handlePasos}>Continuar</button>
                               }
                            </div>
                        </div>
                    )}
                </>
                <>
                    {pasos === 2 && (
                        <div className={style.grupo}>
                            <h3>Datos de Envio</h3>
                            <br />
                            <div >
                                <h6  class="form-label">Provincia</h6>
                                <input name="provincia" value={inputShipping.provincia} type="text" class="form-control"  required onChange={handleInputChange} />
                                
                            </div>
                            <div >
                                <h6 class="form-label">Ciudad / Localidad</h6>
                                <input name="ciudad" value={inputShipping.ciudad} type="text" class="form-control"  required placeholder="Calle y número de la casa" onChange={handleInputChange} />
                                
                            </div>
                            <div >
                                <h6 class="form-label">Domicilio</h6>
                                <input name="direccion" value={inputShipping.direccion} type="text" class="form-control"  required placeholder="Calle y número de la casa" onChange={handleInputChange} />
                               
                            </div>
                            <div >
                                <h6 class="form-label">Piso / N°</h6>
                                <input name="piso" value={inputShipping.piso} type="text" class="form-control"  required placeholder="N° de planta o N°" onChange={handleInputChange} />
                                
                            </div>
                            <div >
                                <h6 class="form-label">Comentarios</h6>
                                <input name="comentarios" value={inputShipping.comentarios} type="text" class="form-control"  placeholder="Informacion extra sobre envio" onChange={handleInputChange} />
                                
                            </div>
                            <br />
                            <div className={style.botones}>
                                <button className={style.volver} onClick={handlePasosVolver}>Volver</button>
                                {
                                    errorShipping.provincia || errorShipping.ciudad || errorShipping.direccion || errorShipping.piso
                                        ? <button className={style.next} >Continuar</button> : <button className={style.next} onClick={handlePasos}>Continuar</button>
                                }
                            </div>
                        </div>
                    )}
                </>
                <>
                        {pasos === 3 && (
                            <div className={style.grupo} download="compra">
                                <div >
                                    <h3>Detalles de pago</h3>
                                    <br />
                                    <h6 class="form-label"><strong>Nombre: </strong>{user.fullname}</h6>
                                    <h6 class="form-label"><strong>Email: </strong>{user.email}</h6>
                                    <h6 class="form-label"><strong>Teléfono: </strong>{inputContact.telefono}</h6>
                                    <h6 class="form-label"><strong>Provincia: </strong>{inputShipping.provincia}</h6>
                                    <h6 class="form-label"><strong>Ciudad / Localidad: </strong>{inputShipping.ciudad}</h6>
                                    <h6 class="form-label"><strong>Domicilio: </strong>{inputShipping.direccion}</h6>
                                    <h6 class="form-label"><strong>Piso / N°: </strong>{inputShipping.piso}</h6>
                                    <h6 class="form-label"><strong>Comentarios: </strong>{inputShipping.comentarios}</h6>
                                </div>
                                <br />
                                <div className={style.botones}>
                                    <button className={style.volver} onClick={handlePasosVolver}>Volver</button>
                                    <button className={style.next} onClick={habilitarPago}>Pagar</button>

                                </div>
                            </div>
                        )}

                    </>
                <div>
                    <div className={style.grupo}>
                        <h3> Detalle de Compra</h3>
                        <br />
                        <div className={style.total}>
                            {
                                cartProduct.length>0  && cartProduct.map((producto) => {
                               
                                    return (
                                        <div className={style.productTotal}>
                                            <h6 className={style.nombreCantidad}> {producto.name + " x " + producto.quantity}</h6>
                                            <h6 className={style.precio}> $ {producto.price * producto.quantity}</h6>
                                        </div>
                                    )
                                })
                            }
                            <br />
                           
                            <div>
                              {descuento &&
                              <>
                                <div className={style.subtotalDescuento}>
                                    <h5> SubTotal: </h5>
                                    <h5 > $ {sumaTotal()}</h5>
                                </div>
                                <div className={style.subtotalDescuento}>
                                    <h5 >Descuento: {percentage} %</h5>
                                    <h5 > $ - {descuento}</h5>
                                </div>
                              </>}
                              
                            </div>
                            <br />
                            <div className={style.sumatotal}>
                                <h4>Total: </h4>
                                <h4>$ {descuento? sumaTotal()-descuento : sumaTotal()}</h4>
                            </div>
                            <br />
                        </div>
                        <div >
                            {habitado === true ? <button className={style.botonML} onClick={handleCosa}>Comprar ahora</button> :
                                <button className={style.botonllenar}>Completar Formulario</button>}
                        </div>
                        <br />
                        <div>
                            <img src={ML}  alt={'...'}/>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>
)
}
