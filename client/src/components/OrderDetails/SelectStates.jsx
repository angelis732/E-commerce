import React from "react";
import styles from './orderDetails.module.scss';


export default class SelectStates extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      OrderState: "",
    };
    
  }
  render() {
    
    return (
      <div className={""}>
        <div className={styles.editar} onClick={this.handleState}>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-9">
                  <label className={styles.inlineLabel}>Elige un estado</label>
                  <select  name="state" id="state" value={this.state.OrderState} onChange={this.handleChange}>
                    <option value="carrito">carrito</option>
                    <option value="creada">creada</option>
                    <option value="procesando">procesando</option>
                    <option value="cancelada">cancelada</option>
                    <option value="completa">completa</option>
                  </select>
                </div>
                <div className="col-3">
                  <input className={styles.btnExtraSmall + " btn btn-info btn-sm"} type="submit" value="Aceptar"/>
                </div>
              </div>
            </form>
        </div>
      </div>
    )
  }}