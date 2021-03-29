import React from 'react';
import { useHistory } from 'react-router-dom';
import '../PayCart/PayCart.scss';


export default function PayCart(props) {
  
  const history = useHistory()

  const cambio= async ()=>{
    
    if(props.dato3 == null) {
        return history.push("/auth/login")
    }
    else if (props.dato2) {
        return history.push("/CheckOut/")
    }
  }

    return (
        <div className="contenedor">
            <div className="juntar">
                <div className="grupo">
                  <h5>Total a pagar </h5>
                </div>
                <div className="grupo">
                    <h3> ${props.dato}</h3>
                </div>
            </div>
              <button disabled={props.dato2.length < 1 ? true : false}  onClick={cambio}>Finalizar Pago</button>
        </div>
    )
};
