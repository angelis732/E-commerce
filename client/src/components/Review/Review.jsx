import React from 'react';
import styles from './review.module.scss';
import Moment from 'moment';

export default function Review({data}) {

function formatDate(date) {
    let formatDate = new Moment(date);
    return formatDate.format('DD/MM/YY')
    }

let valor= data.rate;


function rate(valor){
  
  
  if (valor === 1) {
    return (
      <>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      
      </>
    
    )
  } else if (valor === 2) {
    return (
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </>
    
    )
  } else if (valor === 3) {
    return (
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </>
    
    )
  } else if (valor === 4) {
    return (
      <>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
      </>)
    
  } else {
    return (
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


    return(
        <>
          <div className= {styles.container}>
               { data&&
               <>
                <div className={styles.nameStar}>
                    <h4>{data.user?.fullname}</h4>
                    
                    <h4 className={styles.estrella}>{rate(valor)}</h4>

                </div>
                <div >
                    <p>{data.description}</p>
                    <label className={styles.labelDate}>{formatDate(data.createdAt)}</label>
                </div>
            </>}
            </div>
            
        </>
    )
}

