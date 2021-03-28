import React, { useState } from 'react';


export default function Rate({handleInputChange,data}) {

    const [rating, setRating] = useState(data.rate);
    const [hover, setHover] = useState(null);
    const [review, setReview] = useState({
      rate: "",
    });
  
    const onChange = (e) => {
        setReview({
          ...review,
          [e.target.name]: e.target.value,
        });
        handleInputChange(e)
      };

    return(
        <div>
             <div>
                {[...Array(5)].map((star, i) => {
                  const ratingValue = i + 1;

                  return (
                    <label key={i}>
                      <input
                      style={{display: "none"}}
                        type="radio"
                        name="rate"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                        onChange={onChange}
                      />
                      <i class="fas fa-star"
                      style={ratingValue <= (hover || rating) ?{color: "gold"} : {color:"grey"}}
                      size={40}
                      onMouseEnter={() => {setHover(ratingValue)}}
                      onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
        </div>
    )
}
