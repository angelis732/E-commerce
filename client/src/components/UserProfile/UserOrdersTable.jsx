import React, {Fragment, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {connect} from "react-redux";
import styles from "../OrderTable/orderTable.module.scss"
import { getOrdersUser } from "../../actions/orderActions";
import Moment from "moment";



function UserOrdersTable (props) {
  
  
  const history = useHistory();
  
   useEffect(() =>{
      props.getOrdersUser(props.userInfo.id)
   }, [props.userInfo.id])
  
  const formatDate = (date) => {
    let formatDate = new Moment(date);
    return formatDate.format('DD/MM/YY - HH:mm:ss')
  }
  
    return (
      <Fragment>
        <div onClick={history.goBack} className={" btn btn-light " + styles.volver}>Volver</div>
        <h3 className={styles.title}>Historial de Órdenes</h3>
        <div className={styles.cont}>
          <div className="table-responsive" >
            <table className={"table table-sm " + styles.table} >
              <thead>
              <tr>
                <th scope="col">Número de Compra</th>
                <th scope="col">Estado</th>
                <th scope="col">Monto</th>
                <th scope="col">Fecha y hora</th>
                {/*<th scope="col">Dirección de envío</th>*/}
              </tr>
              </thead>
              <tbody >
              {
                props.ordersUser && props.ordersUser.map(order => {
                  let total = 0;
                  order.products.map(product => {
                   return total = total + product.price * product.OrderDetails.quantity;
                  })
                  return (
                    <tr key={order.id} >
                      <td >
                        <Link exact to={`/users/${order.id}/orders`} >
                          {order.id}
                        </Link>
                      </td>
                      <td>
                        {order.state}
                      </td>
                      <td>
                        ${total.toFixed(2)}
                      </td>
                      <td>
                        {formatDate(order.createdAt)}
                      </td>
                      {/*<td>*/}
                      {/*  {order.address}*/}
                      {/*</td>*/}
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    )
}


function mapStateToProps(state) {
  return {
    ordersUser: state.orderStore.ordersUser,
    userInfo: state.auth.userInfo,
  }
}

export default connect(mapStateToProps, { getOrdersUser } )(UserOrdersTable);
