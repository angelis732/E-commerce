import React, {Fragment} from 'react'
import styles from './viewUser_Guest.module.scss'
import MyAccount from "./MyAccount";
import { useSelector} from 'react-redux';
import {Link} from "react-router-dom";
import Badge from '@material-ui/core/Badge';


export default function ViewUser () {

  let cartProduct = useSelector(store => store.product.cart);
  
  return (
    <Fragment>
        <div className={styles.viewUser_Guest}>
          <div className='d-flex d-sm-none'>
          
      <Badge badgeContent={cartProduct.length} overlap='circle' color='primary'>
            <div className={styles.ctnCart}>
              <Link to={`/user/order`}>
                <button className={styles.cart} ><i className="fas fa-shopping-cart"/></button>
              </Link>
            </div>
      </Badge>
    
            <div className={styles.myAccount + ' d-flex d-sm-none'}>
              <div className="dropstart">
              <MyAccount/>
              </div>
            </div>
          </div>
          <div className='d-none d-sm-flex'>
         
          <Badge badgeContent={cartProduct.length} overlap="square" color='primary' >
            <div className={styles.ctnCart}>
              <Link to={`/user/order`}>
                <button className={styles.cart} ><i className="fas fa-shopping-cart"/></button>
              </Link>
            </div>
            </Badge>
           
            <div className={styles.myAccount + ' d-none d-sm-flex'}>
              <MyAccount/>
            </div>
          </div>
        </div>
    </Fragment>
  )
}
