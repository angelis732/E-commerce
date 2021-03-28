import React, {Fragment, useEffect, useState,} from "react";
import { getAllOrders } from '../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './orderTable.module.scss'
import { Link } from "react-router-dom";
import Moment from 'moment';


function OrderTable () {
  
  const [orderStates, setOrderStates] = useState('')
  const allOrders = useSelector(store => store.orderStore.allOrders);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllOrders())
  }, [dispatch])

  const formatDate = (date) => {
    let formatDate = new Moment(date);
    return formatDate.format('DD/MM/YY - HH:mm:ss')
  }
  
  const filteredOrders = (event) => {
    dispatch(getAllOrders(event.target.value))
    setOrderStates(event.target.value)
  }
  
   
    return (
      <Fragment>
        <br />
        <h2 className={styles.title}>Ordenes de Usuario:</h2>
        <div className={styles.select}>
          <div>
            <label>Filtrar por estado </label> &nbsp;
            <select  name="state" id="state" value={orderStates} onChange={filteredOrders}>
              <option value="">Todas</option>
              <option value="carrito">En carrito</option>
              <option value="creada">Creada</option>
              <option value="procesando">Procesando</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="enviada">Enviada</option>
              <option value="completa">Completa</option>
            </select>
          </div>
        </div>
        <div className={styles.cont}>
        <div className={"table-responsive"}>
          <table className={"table table-sm " + styles.table} >
            <thead>
              <tr>
                <th className={styles.th} scope="col">Número de Compra</th>
                <th className={styles.th} scope="col">Id del Usuario</th>
                <th className={styles.th} scope="col">
                 Estados
                </th>
                <th className={styles.th} scope="col">Monto</th>
                <th className={styles.th} scope="col">Fecha y hora</th>
              </tr>
            </thead>
            <tbody >
              {
               allOrders.map(order => {
                  let total = 0;
                  order.products.map(product => {
                    return total = total + product.price * product.OrderDetails.quantity;
                  })
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link exact to={`/orders/${order.id}`} >
                          {order.id}
                        </Link>
                      </td>
                      <td>{order.userId}</td>
                      <td>{order.state}
                      </td>
                      <td>${total.toFixed(2)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          {
            allOrders.length === 0 ? <div>
              No se encontraron ordenes en estado {orderStates}
            </div>: ""
          }
        </div>
        </div>
      </Fragment>
    )

}

export default OrderTable;
