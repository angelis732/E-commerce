import React, { useState } from 'react'
import style from './search.module.scss'
import { searchProduct } from '../../actions/productActions.js'
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";



export default function Search() {

    const [input, setInput] = useState({ search: '' })
    const dispatch = useDispatch();
    const history = useHistory();


    function handleChange(e) {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault();
        history.push("/products?search=" + input.search)
        dispatch(searchProduct(input.search))
    }

    return (
      <div className="col ">
          <div className={'' + style.searchBar} >
              <form className={"d-flex " + style.formSearch}  onSubmit={handleSubmit}>
                  <input onChange={handleChange} className={"form-control me-2 " + style.inputSearch}
                         name='search'
                         type='text'
                         placeholder="Buscar..."
                  />
                  <button className={style.btnSearch}>
                      <i className={"fas fa-search " + style.iconSearch}/>
                  </button>
              </form>
          </div>
      </div>
    )

}

// export default function Search() {
//
//     const [input, setInput] = useState({ search: '' })
//     const dispatch = useDispatch();
//     const history = useHistory();
//
//
//     function handleChange(e) {
//         setInput({ ...input, [e.target.name]: e.target.value })
//     }
//
//     function handleSubmit(e) {
//         e.preventDefault();
//         history.push("/products?search=" + input.search)
//         dispatch(searchProduct(input.search))
//     }
//
//     return (
//       <div className={style.searchBar} >
//           <form onSubmit={handleSubmit}>
//               <input name='search' type='text' placeholder='Buscar...' onChange={handleChange}/>
//               <button><i className="fas fa-search" /></button>
//           </form>
//       </div>
//     )
//
// }