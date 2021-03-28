import React, {Fragment} from "react";
import styles from './orderDetails.module.scss';
import OrderDetailsTable from "./OrderDetailsTable";
import { useHistory } from "react-router-dom";

export default function OrderDetails (props) {
  
      const history = useHistory();
      
    return (
      <Fragment>
        <div onClick={history.goBack} className={" btn btn-light " + styles.volver}>
          Volver
        </div>
        <div className={styles.primerDiv}>
          <h2 className={styles.title}>Detalle de compra</h2>
          <OrderDetailsTable id={props.id} />
        </div>
      </Fragment>
    )
}



 

