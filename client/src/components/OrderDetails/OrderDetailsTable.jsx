import React from "react";
import styles from "./orderDetails.module.scss"
import {connect} from 'react-redux';
import {getUserOrder, updateStateOrder, getOrdersUser} from "../../actions/orderActions";
import Moment from "moment";
import {Link} from 'react-router-dom'


class OrderDetailsTable extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      OrderState: "",
      editing: false,
    };
    this.handleState = this.handleState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    
    
  }
  
  formatDate(date) {
    let formatDate = new Moment(date);
    return formatDate.format('DD/MM/YY - HH:mm:ss')
  }
  
  
  componentDidMount() {
    this.props.getUserOrder(this.props.id);
  }
  
  handleState() {
    this.setState({
      editing: true
    })
  }
  
  handleChange = event => {
    this.setState({
      OrderState: event.target.value,
    })
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    this.setState({
      editing: false,
      OrderState: event.target.value,
    });
    
    this.props.updateStateOrder(this.props.id, this.state.OrderState);
    
  }
  
  render() {
    let priceOrder = [];
    
    function getPriceOrder() {
      if (priceOrder.length > 0) {
        let total = 0;
        for (let i = 0; i < priceOrder.length; i++) {
          total = total + priceOrder[i];
        }
        return total.toFixed(2);
      }
    }
    
    let {id, state, createdAt, userId, products, address, discount} = this.props.order;
    
    return (
      <div className={styles.container}>
        <div>
          <table className="table-responsive-m">
            <tbody className={styles.bodyTable}>
            <tr>
              <th className={styles.letterLeft} scope="row">Fecha:</th>
              <td className={styles.letterhead}>{this.formatDate(createdAt)}</td>
            </tr>
            {
              this.props.userInfo.rol === 'admin' ?
                <tr>
                  <th className={styles.letterLeft} scope="row">Id de Usuario:</th>
                  <td className={styles.letterhead}>{userId}</td>
                </tr> : ''
            }
            
            <tr>
              <th scope="row" className={'mr-3 ' + styles.letterLeft}>Estado de la orden:</th>
              <td className={styles.letterhead}>
                <div>{this.state.editing ? " " : state}</div>
                {
                  this.props.userInfo.rol === 'admin' ?
                    <div className={styles.editar} onClick={this.handleState}>
                      {this.state.editing ? (
                        <form onSubmit={this.handleSubmit}>
                          <div className="row">
                            <div className="col-7 col-sm-6">
                              <label className={styles.inlineLabel}>Elige un estado</label>
                              <select name="state" id="state" value={this.state.OrderState}
                                      onChange={this.handleChange}>
                                <option value="carrito">En carrito</option>
                                <option value="creada">Creada</option>
                                <option value="procesando">Procesando</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="enviada">Enviada</option>
                                <option value="completa">Completa</option>
                              </select>
                            </div>
                            <div className={"col-5  col-sm-6 pl-sm-0 " + styles.aceptar}>
                              <input
                                className={styles.btnExtraSmall + " btn btn-sm"}
                                type="submit"
                                value="Aceptar"
                              />
                            </div>
                          </div>
                        </form>
                      ) : <div className="btn-sm "><i title="Editar" className={"fas fa-edit " + styles.icon}/></div>
                      }
                    </div> : ''
                }
              </td>
            </tr>
            <tr>
              <th className={styles.letterLeft} scope="row">Numero de orden:</th>
              <td className={styles.letterhead}>{id}</td>
            </tr>
            <tr>
              <th className={styles.letterLeft} scope="row">Dirección de envío:</th>
              <td className={styles.letterhead}>{address}</td>
            </tr>
            <tr>
              <th className={styles.letterLeft}>Productos:</th>
              <th></th>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.containerProducts}>
          {
            products && products.map(product => {
              let quantity = product.OrderDetails.quantity;
              let subTot = product.price * quantity;
              priceOrder.push(subTot);
              
              return <div className={"mb-1 " + styles.divProducts1}>
                <div className={styles.image}>
                  <img className={styles.imgResponsive} src={product.images ? product.images[0].url : ''}
                       alt="Cargando imagen..."/>
                </div>
                <div className={styles.quantity}>
                  <span className={styles.fontSize}>{quantity}</span>
                </div>
                <div className={styles.name}>
                  <span className={"ml-3 " + styles.fontSize}><Link
                    to={`/products?search=${product.name}`}>{product.name}</Link></span>
                </div>
                <div className={styles.price}>
                  <span className={styles.fontSize}>${product.price} </span>
                </div>
                <div className={styles.price}>
                  <span className={styles.fontSize}>${product.price * quantity}</span>
                </div>
              </div>
            })
          }
          {
            discount !== 0
              ?
              <div className={styles.ctnTotal}>
                <div className={styles.totalTable}>
                  <table className="table table-striped table-sm">
                    <tr>
                      <th className={styles.fontTotales} scope="row">Subtotal:</th>
                      <td className={styles.fontTotales} >${getPriceOrder()}</td>
                    </tr>
                    <tr>
                      <th className={styles.fontTotales} scope="row">Descuento:</th>
                      <td className={styles.fontTotales} >{discount ? discount : 0}%</td>
                    </tr>
                    <tr className={styles.total}>
                      <th scope="row">Total:</th>
                      <td>${(getPriceOrder() - (getPriceOrder() * discount / 100)).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
              </div>
              :
              <div className={styles.ctnTotal}>
                <div className={styles.totalTable}>
                  <table className="table">
                    <tr>
                      <th scope="row" className={styles.fontTotales}>Subtotal:</th>
                      <td className={styles.fontTotales}>${getPriceOrder()}</td>
                    </tr>
                    <tr>
                      <th className={styles.fontTotales} scope="row">Descuento:</th>
                      <td className={styles.fontTotales} >{discount ? discount : 0}%</td>
                    </tr>
                    <tr className={styles.total}>
                      <th scope="row">Total:</th>
                      <td>${(getPriceOrder() - (getPriceOrder() * discount / 100)).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
              </div>
          }
        
        </div>
      </div>
    
    )
  }
}

function mapStateToProps(state) {
  return {
    order: state.orderStore.order,
    userInfo: state.auth.userInfo
  }
}

export default connect(mapStateToProps, {getUserOrder, updateStateOrder, getOrdersUser})(OrderDetailsTable);