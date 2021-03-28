import React from "react"
import exito from "../../img/pago-exitoso.jpg"
import styles from "./success.module.scss"


export default function Success() {
    
    return(
        <>
        <div className={styles.contenedorImagen}>
            <h3 className={styles.titulito}>Su pago fue exitoso, muchas gracias por su compra !</h3>
            <img className={styles.imagencita} src={exito} alt={'No se encontró la imagen'}/>
        </div>

        </>

    )
}
