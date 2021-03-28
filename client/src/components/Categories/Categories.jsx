import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getCategories } from "../../actions/productActions";
import styles from './categories.module.scss';


function Categories(props) {
  
  useEffect(() => {
    props.getCategories()
  }, [])

  return (
    <div className={styles.dropCategory}>
      <div className="dropdown">
        <button className={styles.botoncito} type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          Categorías &nbsp;<i className="fas fa-caret-down"/>
        </button>
        <ul className={"dropdown-menu " + styles.ctnDropList} aria-labelledby="dropdownMenuButton">
          {props.categories.map((e) => {
            return <div key={e.id} >
              <Link exact to={`/products/category/${e.name}`}  className="dropdown-item">
                <span className={styles.dropList}>{e.name} </span>
              </Link>
            </div>
          })}
          <div>
            <Link exact to="/products"  className="dropdown-item">
              <span className={styles.dropList}>Ver todo</span>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    categories: state.product.categories
  }
}

export default connect(mapStateToProps, { getCategories })(Categories);
