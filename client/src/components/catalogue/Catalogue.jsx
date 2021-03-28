import React, { useEffect, useState } from 'react';
import ProductCard from '../productCard/ProductCard.jsx';
import styles from './catalogue.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productActions.js';
import { useHistory } from 'react-router-dom';
import { searchProduct } from '../../actions/productActions.js'

export default function Catalogue() {
    const history = useHistory();
    const products = useSelector((store) => store.product.products);

    const [pagina, setPagina] = useState(1);
    const [productosPaginados, setProductosPaginados] = useState([]);
    const [paginasDisponibles, setPaginasDisponibles] = useState("");
    const [productsPerPage, setProductsPerPage] =useState(8)

    function handleProductsPerPage(e){
        if(e.target.value ==="" || e.target.value< 1) return
        else setProductsPerPage(parseInt(e.target.value))
    }
    useEffect(()=>{
        setPagina(1)
        setPaginasDisponibles(Math.ceil(products.length/productsPerPage))
    },[products, productsPerPage])

    const dispatch = useDispatch();

    useEffect(() => {
        
        if (history.location.search.length === 0) dispatch(getProducts())
        if (history.location.search.length > 0) dispatch(searchProduct(history.location.search.slice(8)))
    }, [history, dispatch])

    useEffect(() => {
        setProductosPaginados(products.slice(pagina * productsPerPage - productsPerPage, pagina * productsPerPage))

    }, [pagina, products, productsPerPage])
    function handlePage(arg){
        console.log(paginasDisponibles)
        if(arg==="left"){
            console.log(pagina);
            if(pagina>1) {
                setPagina(pagina-1)}
        }
        if(arg==="right"){
            if(pagina<paginasDisponibles) setPagina(pagina+1)
        }
    }

    return (
        <div className={styles.catalogue}>
            <h2 className={styles.titleH2}>Nuestro Catálogo</h2>
            <div className={styles.selectContainer}>
            <label for="prueba">Productos por Página</label>
                <select  id="prueba" onChange={handleProductsPerPage}>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option selected value="8">8</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="20">20</option>
                </select>
            </div>
            <div className={styles.contentCards}>
                {productosPaginados && productosPaginados.map((infoProducto) => {
                    return <ProductCard key={infoProducto.id} data={infoProducto} />
                })}
            </div>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item" onClick={() => handlePage("left")}>
                        <span class="page-link" aria-label="Previous" >
                            <span aria-hidden="true"  >&laquo;</span>
                        </span>
                    </li>
                    <li class="page-item" onClick={() => handlePage("right")}>
                        <span class="page-link" aria-label="Next">
                            <span aria-hidden="true" >&raquo;</span>
                        </span>
                    </li>
                </ul>
            </nav>
        </div>
    )
}




