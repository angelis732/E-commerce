import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Modal, ModalHeader, ModalBody, ModalFooter, Container, FormGroup, Label, Input } from 'reactstrap'
import styles from './crud.module.scss'
import { connect } from 'react-redux';
import { getProducts, getCategories, searchProduct, insertProduct, deleteProduct, editProduct } from '../../actions/productActions'
class CrudProductForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {
                id: '',
                name: '',
                description: '',
                price: '',
                stock: '',
                url: ''
            },
            modalInsertar: false,
            modalEditar: false,
            search: '',
            isChecked: false,
            checkBoxes: [],
            file: null,
            cateEdit: []
        };

    }

    handleChange = e => {
        console.log('handlechange')
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value,
            }
        })
    }

    mostrarModalInsertar = () => {
        console.log('mostrarInsertar')
        this.setState({ modalInsertar: true })
        this.props.getCategories();
    }
    mostrarModalEditar = (product) => {
        this.setState({ modalEditar: true, form: product })
        this.props.getCategories();
    }
    ocultarModalInsertar = () => {
        console.log('oculmodalinsertar')
        this.setState({ modalInsertar: false })
    }
    ocultarModalEditar = (product) => {
        this.setState({ modalEditar: false });
        if (product) {
            if (this.state.form.categories) {
                this.props.putProduct(product)
            } else {
                alert('El Producto debe tener 1 categoria asignada')
            }

        }


    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.chargeProducts(this.state.form.search);
    }
    handleDelete(id) {
        this.props.destroyProduct(id);

    }
    handleEdit(product) {
        this.mostrarModalEditar(product)

    }
    componentDidMount() {
        this.props.getAllProducts();
    }
    handlepost(inputs) {

        if (this.state.checkBoxes.length > 0) {
            this.ocultarModalInsertar();
            this.props.postProducts({ product: inputs, cate: this.state.checkBoxes, img: this.state.file })


        } else {
            alert('Debe Seleccionar la Categoria a asignar')
        }
    }
    cambio(id) {
        const index = this.state.checkBoxes.indexOf(id);
        if (index > -1) {

            this.state.checkBoxes.splice(index, 1)

        } else {
            this.state.checkBoxes.push(id)

        }
    }
    handleChangeImage = e => {
        this.setState({
            file: e.target.files[0]
        });

    }
    checkEdit(catego) {
        const categorias = this.state.form.categories;
        if (categorias) {
            for (let i = 0; i < categorias.length; i++) {
                if (categorias[i].id === catego.id) {
                    return true
                }
            }
        }
    }
    checkEditClick(cate) {
        console.log('checkEditClick')
        const categorias = this.state.form.categories;
        for (var i = 0; i < categorias.length; i++) {
            if (categorias[i].id === cate.id) {

                this.state.form.categories.splice(i, 1);

                return
            }
        }
        this.state.form.categories.push(cate)
    }


    render() {
        return (
            <>
                <Container>
                    <div>
                    <br/>
                        <h2 className={styles.title}>Administrar Productos</h2>
                        <button className={styles.buttonFormAdd} color='primary' onClick={() => this.mostrarModalInsertar()}> + Agregar Producto </button>
                    </div>
                    <FormGroup>
                    <br/>
                        <div className={styles.formInline}>
                            <button className={styles.buttonFormAdd} color='primary' onClick={e => this.handleSubmit(e)}>Buscar</button>
                            <Input name='search' type="text" className={styles.input} placeholder="Ingresa el producto a buscar..." onChange={this.handleChange} />
                        </div>
                    </FormGroup>
                   
                    <div className={"table-responsive " + styles.container}>
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Borrar</th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.props.products && this.props.products.map((product => (
                                <tr>

                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock}</td>

                                    <td>
                                        <button className={styles.buttonForm} color='primary' onClick={() => this.handleEdit(product)}>Editar</button>
                                    </td>
                                    <td>
                                        <button className={styles.buttonForm} onClick={(e) => this.handleDelete(product.id)}>Borrar</button>
                                    </td>
                                </tr>
                            )))}

                        </tbody>
                    </table>
                    </div>
                    
                </Container>
                <Modal isOpen={this.state.modalEditar}>
                    <ModalHeader>
                        <div>
                            <h3>Editar Producto</h3>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>

                            <Label sm={3}>Nombre</Label>
                            <Col sm={20}>
                                <Input name='name' type='text' value={this.state.form.name} onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Descripcion</Label>
                            <Col sm={20}>
                                <Input name='description' type="textarea" value={this.state.form.description} onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Precio</Label>
                            <Col sm={20}>
                                <Input name='price' type='text' value={this.state.form.price} onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Stock</Label>
                            <Col sm={20}>
                                <Input name='stock' type='text' value={this.state.form.stock} onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup check>

                            {this.props.categories && this.props.categories.map((cateProd => (
                                <div className="form-check form-check-inline">
                                    <Label check>
                                        <Input row className="form-check-input" type="checkbox"
                                            name='isChecked' defaultChecked={this.checkEdit(cateProd)}
                                            onChange={() => this.checkEditClick(cateProd)} />

                                        {'    '}
                                        {cateProd.name}
                                        {'    '}
                                    </Label>
                                </div>
                            )))}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <button className={styles.buttonForm} onClick={() => this.ocultarModalEditar(this.state.form)}>Editar</button>
                        <button className={styles.buttonForm} onClick={() => this.ocultarModalEditar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>



                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div>
                            <h3>Agregar Producto</h3>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label sm={3}>Nombre</Label>
                            <Col sm={20}>
                                <Input name='name' type='text' onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Descripción</Label>
                            <Col sm={20}>
                                <Input  name='description' type="textarea" onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Precio</Label>
                            <Col sm={20}>
                                <Input  name='price' type='text' onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={3}>Stock</Label>
                            <Col sm={20}>
                                <Input  name='stock' type='text' onChange={this.handleChange} />
                            </Col>
                        </FormGroup>
                        <h4>Categorias</h4>
                        <FormGroup check>

                            {this.props.categories && this.props.categories.map((cate => (
                                <div className="form-check form-check-inline">

                                    <FormGroup check>
                                        <Label check>

                                            <Input row className="form-check-input" type="checkbox"
                                                value="option1" id="inlineCheckbox1" name='isChecked'
                                                onChange={() => this.cambio(cate.id)} />

                                            {/*console.log('mapea las categorias' + cate)*/}
                                            {'      '}
                                            {cate.name}
                                            {'      '}

                                        </Label>
                                    </FormGroup>
                                </div>
                            )))}

                        </FormGroup>
                        <FormGroup>
                            <Label>Url imagen</Label>
                            <Input type='text' name='url' onChange={this.handleChange} />
                            {/* <input type='file' name='file' onChange={this.handleChangeImage}/> */}

                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <button className={styles.buttonForm} onClick={() => this.handlepost({ name: this.state.form.name, description: this.state.form.description, price: this.state.form.price, stock: this.state.form.stock, image: [{ url: this.state.form.url }] })}>Insertar</button>
                        <button className={styles.buttonForm} onClick={() => this.ocultarModalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>
            </>

        )
    }
}

const mapsStateToProps = (state) => {
    return {
        products: state.product.products,
        categories: state.product.categories
    }
}
const mapDispatchToprops = (dispatch) => {
    return {
        chargeProducts: search => dispatch(searchProduct(search)),
        getCategories: () => dispatch(getCategories()),
        postProducts: (products) => dispatch(insertProduct(products)),
        destroyProduct: (id) => dispatch(deleteProduct(id)),
        getAllProducts: () => dispatch(getProducts()),
        putProduct: (payload) => dispatch(editProduct(payload)),
    }
}
export default connect(mapsStateToProps, mapDispatchToprops)(CrudProductForm)
