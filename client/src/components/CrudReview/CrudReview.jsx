import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Container, Table } from 'reactstrap';
import styles from './crudReview.module.scss'
import { useDispatch, useSelector } from 'react-redux';

import { addReview, editReview, getAllReviewsUser, getProductStateComplete, deleteReview } from '../../actions/reviewAction';
import Rate from './Rate';
import { useHistory } from 'react-router-dom';

export function rate(valor){
  
  if( valor === 1){
    return(
      <>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      
      </>
    
    )
  }else if(valor ===2){
    return(
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </>
    
    )
  }else if(valor ===3){
    return(
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </>
    
    )
  }else if(valor ===4 ){
    return(
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
      </>)
    
  }else{
    return(
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </>
    
    )
  }

}


export default function CrudReview(props) {
 
  const dispatch= useDispatch()
  const history = useHistory()
  const productsComplete = useSelector((store) => store.product.productsComplete);
  const reviews = useSelector((store) => store.product.reviews);
  
  const [input, setInput] = useState({
    description: '',
    rate: '1',
    userId: props.id
  });
  const [idProductAdding, setIdProductAdding] = useState()
  const [infoEdit, setInfoEdit] = useState()
  const [deleteRev, setDeleteRev] = useState()

  const [productWithReview, setProductWithReview]= useState([])
  const [productWithoutReview, setProductWithoutReview]= useState([])
  
  const [errors, setErrors] = useState({description:"true"});
  const [modal, setModal] = useState(false);
  const toggleAdd = () => setModal(!modal);
  
  const [modal2, setModal2] = useState(false);
  const toggleEdit = () => setModal2(!modal2);
  
  const [modal3, setModal3] = useState(false);
  const toggleDelete = () => setModal3(!modal3);


  useEffect(() => {
    dispatch(getProductStateComplete(props.id))
    dispatch(getAllReviewsUser(props.id))
  }, [dispatch, props.id])
  
  const validate = function (input) {
    let errors = {};
    if (!input.description) {
      errors.description = '**Requiere una descripción';
    }
    return errors;
  }
  
  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
    setErrors(validate({
      ...input,
      [e.target.name]: e.target.value
    }));

  }
  const resetInput = () => {
    setInput({
      description: '',
      rate: '1',
      userId: props.id
    })
  }
  
  const handleOpenModal = (productId) => {
    setIdProductAdding(productId)
    toggleAdd()
  }
  const handleAddReview = async (productId) => {
    await dispatch(addReview(productId, input))
    await dispatch(getProductStateComplete(props.id))
    await dispatch(getAllReviewsUser(props.id))
    resetInput()
    toggleAdd()
  }
  
  const handleEditReview= (productId, reviewId, data)=>{
    setErrors({})
    setInfoEdit({productId, reviewId})
    setInput({...input,...data})
    toggleEdit()
  }
  const handleSendEditReview = async ()=>{
    await dispatch(editReview(infoEdit.productId,infoEdit.reviewId,input))
    await dispatch(getProductStateComplete(props.id))
    await dispatch(getAllReviewsUser(props.id))
    resetInput()
    toggleEdit()
    setErrors({description:"true"})
  }
  
  const handleDelete = (productId, reviewId) => {
    setDeleteRev({ productId, reviewId })
    toggleDelete()
  }

  const handleDeleteReview = async () => {
    await dispatch(deleteReview(deleteRev.productId, deleteRev.reviewId))
    toggleDelete()
    await dispatch(getProductStateComplete(props.id))
    await dispatch(getAllReviewsUser(props.id))
  }


  useEffect(() => {

    let conRev = [];
    let sinRev = [];
    let productCompleteUno = productsComplete;
    let reviewUno = reviews;

    for (let i = 0; i < productCompleteUno.length; i++) {
      let flag = 0;
      for (let j = 0; j < reviewUno.length; j++) {
        if (productCompleteUno[i].OrderDetails.productId === reviewUno[j].productId) {
          flag++
          conRev.push({ ...productCompleteUno[i], reviews: reviewUno[j] })
          reviewUno = reviewUno.filter(function(e) {return e.id !== reviewUno[j].id})
          break
        }
      }
      if (flag === 0) sinRev.push(productCompleteUno[i])
    }
    setProductWithReview(conRev);
    setProductWithoutReview(sinRev)

  }, [productsComplete, reviews])

  return (

    <Container className={styles.container}>
        <button className={styles.button_} onClick={()=>history.push("/users/me")} >Volver</button>
        <h1>Productos sin Reseña</h1>
        {productWithoutReview.length > 0 && <h3>{productWithoutReview.length}</h3>}
      <Table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>

          {productWithoutReview.length > 0 && productWithoutReview.map(((product, index) => (

            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <Button className={styles.button_} onClick={() => handleOpenModal(product.OrderDetails.productId)} >Añadir</Button>
              </td>
            </tr>
          )))}
        </tbody>
      </Table>
      <h1>Mis Reseñas</h1>
      <Table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Reseña</th>
            <th>Puntuación</th>
            <th>Opciones</th>

          </tr>
        </thead>
        <tbody>
          {productWithReview.length>0 && productWithReview.map((review, index)=>(
              <tr key={index}>
                <td>{review.name}</td>
                <td>{review.reviews.description}</td>
                <td className= {styles.estrellitas}>{rate(review.reviews.rate)}</td>
              <td>
                <Button className={styles.button_} onClick={() => handleEditReview(review.reviews.productId, review.reviews.id, { description: review.reviews.description, rate: review.reviews.rate })} >Editar</Button>
                <Button className={styles.button_} onClick={() => handleDelete(review.reviews.productId, review.reviews.id)}>Borrar</Button>
              </td>
            </tr>
          ))}

        </tbody>
      </Table>
      
      <div>
        <Modal isOpen={modal} toggle={toggleAdd} className={props.className}>
          <Form onSubmit={e => e.preventDefault()}>
            <ModalHeader toggle={toggleAdd}>Añadir Reseña</ModalHeader>
            <ModalBody>

              <FormGroup onSubmit={e => e.preventDefault()}>
                <Label for="description"> Descripcion</Label>
                <Input type="textarea" className={`${errors.description} && 'danger', "form-group"`} name="description" id='description' placeholder='Deja tu comentario...' value={input.description} onChange={handleInputChange} />
                {errors.description && (
                  <p className={"danger"}>{errors.description ==="true"?"":errors.description}</p>
                )}
              </FormGroup>
              <FormGroup onSubmit={e => e.preventDefault()}>
                <Label for="rate"> Puntuación </Label>
                <Rate handleInputChange={handleInputChange} data={input}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
             {errors.description || errors.rate?  <Button className={styles.button_} color="danger" >Revisa los campos</Button>:
             <Button className= {styles.button_} type= 'submit' onClick={()=>{ handleAddReview(idProductAdding)}}
                >Añadir Reseña</Button> }
              <Button className={styles.button_} onClick={toggleAdd}>Salir</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modal2} toggle={toggleEdit} className={props.className}>
          <Form onSubmit={e => e.preventDefault()}>
            <ModalHeader toggle={toggleEdit}>Modificar Reseña</ModalHeader>
            <ModalBody>
              
              <FormGroup onSubmit={e => e.preventDefault()}>
                <br />
                <Label for="description">Descripcion</Label>
                <Input type="textarea" className={`${errors.description} && 'danger', "form-group"`} name="description" id='description' value={input.description} onChange={handleInputChange} />
                {errors.description && (
                  <p className={styles.danger}>{errors.description==="true"?"":errors.description}</p>
                )}

              </FormGroup>
              <FormGroup  onSubmit={e=>e.preventDefault()}>
              <Label for="rate"> Puntuacion </Label>
                <Rate handleInputChange={handleInputChange} data={input}/>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              {errors.description? <Button color="danger" className={styles.button_}>Revisa los campos</Button> : <Button className={styles.button_} onClick={()=> handleSendEditReview()}>Modificar Reseña</Button>}
              <Button className={styles.button_} onClick={toggleEdit}>Salir</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
      <div>
        <Modal isOpen={modal3} toggle={toggleDelete} className={props.className}>
          <Form onSubmit={e => e.preventDefault()}>
            <ModalHeader toggle={toggleDelete}>¿Estas Seguro?</ModalHeader>
            <ModalFooter>
              <Button className={styles.button_} type="submit" onClick={() => handleDeleteReview()}>Si</Button>
              <Button className={styles.button_} onClick={toggleDelete}>No</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </Container>
  );

}
