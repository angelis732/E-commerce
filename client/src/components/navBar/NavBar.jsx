import React, {Fragment} from 'react'
import Search from '../search/Search.jsx'
import logo from '../../img/logo.png'
import styles from './navBar.module.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import ViewUser from "./ViewUser";
import ViewGuest from "./ViewGuest";
import ViewAdmin from "./ViewAdmin";

function NavBar(props) {

    return (
      <Fragment>
  
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className={"container-fluid"}>
            <div className={"navbar-brand " + styles.containerLogo}>
              <Link to={`/`}>
                <img className={styles.logo} src={logo}  alt=''/>
              </Link>
            </div>
            <div >
              <Search />
            </div>
            <div className='d-flex d-sm-none'>
              {
                !props.userInfo ?
                  <ViewGuest /> : ''
              }
              {
                props.userInfo && props.userInfo.rol === 'User' ?
                  <ViewUser /> : ''
              }
              {
                props.userInfo && props.userInfo.rol === 'admin' ?
                  <ViewAdmin /> : ''
              }
            </div>
            <div className={"collapse navbar-collapse " + styles.navButtons} id="navbarSupportedContent">
              <ul className={"navbar-nav ml-auto mb-2 mb-lg-0 "}>
                
                <li className={"nav-item " + styles.navItem}>
                  <div>
                    {
                      !props.userInfo ?
                        <ViewGuest /> : ''
                    }
                    {
                      props.userInfo && props.userInfo.rol === 'User' ?
                        <ViewUser /> : ''
                    }
                    {
                      props.userInfo && props.userInfo.rol === 'admin' ?
                        <ViewAdmin /> : ''
                    }
                  </div>
                </li>
              </ul>
            </div>
            

          </div>
        </nav>
      </Fragment>
)
}

function mapStateToProps(state) {
  return {
    userInfo: state.auth.userInfo,
    
  }
}

export default connect(mapStateToProps, null)(NavBar);
