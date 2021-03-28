import React from "react";
import styles from './userProfile.module.scss'
import { Link } from "react-router-dom";
import { connect } from 'react-redux';




class UserProfile extends React.Component {
  
  
  render() {
    
    return (
      <div className={'container ' + styles.userCard}>
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className={"card-header " + styles.cardGestion}>
                Datos Personales
              </div>
              <div className="card-body">
                <p className="blockquote mb-0">Nombre</p>
                <p>{this.props.userInfo.fullname}</p>
                <p className="blockquote mb-0">Correo electrónico</p>
                <p>{this.props.userInfo.email}</p>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className={"card " + styles.cardGestion}>
              <div className="card-header">
                Gestiones de usuario
              </div>
              <div className={"card-body " + styles.cardBody}>
            <div className="row">
                <div className={"blockquote mb-0 " + styles.linksGestiones}>
                  <Link to={`/user/review/${this.props.userInfo.id}`}>
                    <button className={styles.buttonGestion} >
                     Mis reseñas
                    </button>
                  </Link>
                </div>
              <div className={"blockquote mb-0 " + styles.linksGestiones}>
                    <Link to={'/users/ordersTable'}>
                  <button className={styles.buttonGestion}>
                       Historial de Compras
                  </button>
                    </Link>
              </div>
                <div className={"blockquote mb-0 " + styles.linksGestiones}>
                  <button className={styles.buttonGestion}>
                    Cambiar contraseña
                  </button>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )

  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.auth.userInfo,
  }
}

export default connect(mapStateToProps, null)(UserProfile);