import React from "react"
import rechazado from "../../img/pago-rechazado.jpg"
import styles from "./success.module.scss"

export default function Failed() {
    
    return(
        <>
        <div className={styles.contenedorImagen}>
            <h3 className={styles.titulito}>Su pago fue rechazado, lo esperamos nuevamente!</h3>
            <img className={styles.imagencita} src={rechazado} alt={'No se encontró la imagen'}/>
        </div>

        </>

    )
}
