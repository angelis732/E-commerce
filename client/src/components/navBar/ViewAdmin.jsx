import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import {connect} from "react-redux";
import {logoutUser} from "../../actions/userAction";
import styles from "./viewUser_Guest.module.scss";



function ViewAdmin (props) {
  
  const history = useHistory();
  
  const logOutHandler = () => {
    props.logoutUser()
    history.push('/')
  }
  return (
    <div className={"dropdown " + styles.myAccount}>
      <button
        className={"dropdown-toggle " + styles.dropMyAccount}
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <i className="fas fa-bars"/>
      </button>
      <ul
        className={"dropdown-menu " + styles.dropdownList}
        aria-labelledby="dropdownMenuButton">
        <Link to={'/admin/products'} className="dropdown-item">
          Productos
          <li><span className="dropdown-item"/></li>
        </Link>
        <Link to={'/admin/categories'} className="dropdown-item">
          Categorías
          <li><span className="dropdown-item"/></li>
        </Link>
        <Link to={'/admin/orders'} className="dropdown-item">
          Órdenes de Usuario
          <li><span className="dropdown-item" /></li>
        </Link>
        <Link to={'/admin/users'} className="dropdown-item">
          Perfiles
          <li><span className="dropdown-item"/></li>
        </Link>
          <Link to={'/admin/discount'} className="dropdown-item">
            Descuentos
            <li><span className="dropdown-item" /></li>
          </Link>
            <Link className="dropdown-item">
              <div onClick={logOutHandler} className="dropdown-item">
                Cerrar sesión
              </div>
            <li><div className="dropdown-item" /></li>
            </Link>
        </ul>
      </div>
  )
}


export default connect(null, { logoutUser })(ViewAdmin);
